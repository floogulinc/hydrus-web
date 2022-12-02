// from https://github.com/FlandreDaisuki/zip_player/blob/master/zip_player.js

export interface ZipImagePlayerOptions {
  metadata: any;
  autoStart: boolean;
  debug: any;
  source: string;
  chunkSize: number;
  autosize: boolean;
  canvas: HTMLCanvasElement;
  loop: boolean;
}

export class ZipImagePlayer {
  private op: ZipImagePlayerOptions;
  private _URL = window.URL || window.webkitURL;
  private _Blob = window.Blob;
  private _Uint8Array = window.Uint8Array;
  private _DataView = window.DataView;
  private _ArrayBuffer = window.ArrayBuffer;
  _maxLoadAhead: number;
  _isSafari: boolean;
  _loadingState: number;
  _dead: boolean;
  _context: CanvasRenderingContext2D;
  _files: {};
  _frameCount: number;
  _trailerBytes: number;
  _failed: boolean;
  _frame: number;
  _loadFrame: number;
  _frameImages: HTMLImageElement[];
  _paused: boolean;
  _loadTimer: number;
  _len: number;
  _buf: ArrayBuffer;
  _bytes: Uint8Array;
  _pHead: number;
  _pNextHead: number;
  _pFetch: number;
  _pTail: number;
  _timer: number;
  constructor(options: ZipImagePlayerOptions) {
    this.op = options;
    this._maxLoadAhead = 0;
    this._isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    this._loadingState = 0;
    this._dead = false;
    this._context = options.canvas.getContext("2d");
    this._files = {};
    this._frameCount = this.op.metadata.frames.length;
    this._trailerBytes = 30000;
    this._failed = false;
    this._debugLog(`Frame count: ${this._frameCount}`);
    this._frame = 0;
    this._loadFrame = 0;
    this._frameImages = [];
    this._paused = false;
    this._loadTimer = null;
    this._startLoad();
    if (this.op.autoStart) {
      this.play();
    }
    else {
      this._paused = true;
    }

  }
  private _mkerr(msg: string) {
    return () => {
      this._error(msg);
    };
  }
  private _error(msg: string) {
    this._failed = true;
    throw Error(`ZipImagePlayer error: ${msg}`);
  }
  private _debugLog(msg: string) {
    if (this.op.debug) {
      console.log(msg);
    }
  }
  private _load(offset: number, length: number, callback: (off: number, len: number) => void) {
    // Unfortunately JQuery doesn't support ArrayBuffer XHR
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      if (this._dead) {
        return;
      }
      this._debugLog(`Load: ${offset} ${length} status=${xhr.status}`);
      if (xhr.status == 200) {
        this._debugLog("Range disabled or unsupported, complete load");
        offset = 0;
        length = xhr.response.byteLength;
        this._len = length;
        this._buf = xhr.response;
        this._bytes = new this._Uint8Array(this._buf);
      } else {
        if (xhr.status != 206) {
          this._error(`Unexpected HTTP status ${xhr.status}`);
        }
        if (xhr.response.byteLength != length) {
          this._error(`Unexpected length ${xhr.response.byteLength} (expected ${length})`);
        }
        this._bytes.set(new this._Uint8Array(xhr.response), offset);
      }
      if (callback) {
        callback.apply(this, [offset, length]);
      }
    }, false);
    xhr.addEventListener("error", this._mkerr("Fetch failed"), false);
    xhr.open("GET", this.op.source);
    xhr.responseType = "arraybuffer";
    if (offset != null && length != null) {
      const end = offset + length;
      xhr.setRequestHeader("Range", `bytes=${offset}-${(end - 1)}`);
      if (this._isSafari) {
        // Range request caching is broken in Safari
        // https://bugs.webkit.org/show_bug.cgi?id=82672
        xhr.setRequestHeader("Cache-control", "no-cache");
        xhr.setRequestHeader("If-None-Match", Math.random().toString());
      }
    }
    /*this._debugLog("Load: " + offset + " " + length);*/
    xhr.send();
  }
  private _startLoad() {
    if (!this.op.source) {
      // Unpacked mode (individiual frame URLs) - just load the frames.
      this._loadNextFrame();
      return;
    }
    fetch(this.op.source, {
      method: "HEAD",
    }).then(resp => {
      if (this._dead) {
        return;
      }
      this._pHead = 0;
      this._pNextHead = 0;
      this._pFetch = 0;
      const len = parseInt(resp.headers.get("Content-Length"));
      if (!len) {
        this._debugLog("HEAD request failed: invalid file length.");
        this._debugLog("Falling back to full file mode.");
        this._load(null, null, (off, len) => {
          this._pTail = 0;
          this._pHead = len;
          this._findCentralDirectory();
        });
        return;
      }
      this._debugLog(`Len: ${len}`);
      this._len = len;
      this._buf = new this._ArrayBuffer(len);
      this._bytes = new this._Uint8Array(this._buf);
      let off = len - this._trailerBytes;
      if (off < 0) {
        off = 0;
      }
      this._pTail = len;
      this._load(off, len - off, (off) => {
        this._pTail = off;
        this._findCentralDirectory();
      });

    }).catch(this._mkerr("Length fetch failed"));
  }
  private _findCentralDirectory() {
    // No support for ZIP file comment
    const dv = new this._DataView(this._buf, this._len - 22, 22);
    if (dv.getUint32(0, true) != 0x06054b50) {
      this._error("End of Central Directory signature not found");
    }
    const cd_count = dv.getUint16(10, true);
    const cd_size = dv.getUint32(12, true);
    const cd_off = dv.getUint32(16, true);
    if (cd_off < this._pTail) {
      this._load(cd_off, this._pTail - cd_off, () => {
        this._pTail = cd_off;
        this._readCentralDirectory(cd_off, cd_size, cd_count);
      });
    } else {
      this._readCentralDirectory(cd_off, cd_size, cd_count);
    }
  }
  private _readCentralDirectory(offset: number, size: number, count: number) {
    const dv = new this._DataView(this._buf, offset, size);
    let p = 0;
    for (let i = 0; i < count; i++ ) {
      if (dv.getUint32(p, true) != 0x02014b50) {
        this._error("Invalid Central Directory signature");
      }
      const compMethod = dv.getUint16(p + 10, true);
      const uncompSize = dv.getUint32(p + 24, true);
      const nameLen = dv.getUint16(p + 28, true);
      const extraLen = dv.getUint16(p + 30, true);
      const cmtLen = dv.getUint16(p + 32, true);
      const off = dv.getUint32(p + 42, true);
      if (compMethod != 0) {
        this._error("Unsupported compression method");
      }
      p += 46;
      const nameView = new this._Uint8Array(this._buf, offset + p, nameLen);
      let name = "";
      for (let j = 0; j < nameLen; j++) {
        name += String.fromCharCode(nameView[j]);
      }
      p += nameLen + extraLen + cmtLen;
      /*this._debugLog("File: " + name + " (" + uncompSize +
                           " bytes @ " + off + ")");*/
      this._files[name] = { off: off, len: uncompSize };
    }
    // Two outstanding fetches at any given time.
    // Note: the implementation does not support more than two.
    if (this._pHead >= this._pTail) {
      this._pHead = this._len;
      this._loadNextFrame();
    } else {
      this._loadNextChunk();
      this._loadNextChunk();
    }
  }
  private _loadNextChunk() {
    if (this._pFetch >= this._pTail) {
      return;
    }
    const off = this._pFetch;
    let len = this.op.chunkSize;
    if (this._pFetch + len > this._pTail) {
      len = this._pTail - this._pFetch;
    }
    this._pFetch += len;
    this._load(off, len, () => {
      if (off == this._pHead) {
        if (this._pNextHead) {
          this._pHead = this._pNextHead;
          this._pNextHead = 0;
        } else {
          this._pHead = off + len;
        }
        if (this._pHead >= this._pTail) {
          this._pHead = this._len;
        }
        /*this._debugLog("New pHead: " + this._pHead);*/
        if (!this._loadTimer) {
          this._loadNextFrame();
        }
      } else {
        this._pNextHead = off + len;
      }
      this._loadNextChunk();
    });
  }
  private _fileDataStart(offset: number) {
    const dv = new DataView(this._buf, offset, 30);
    const nameLen = dv.getUint16(26, true);
    const extraLen = dv.getUint16(28, true);
    return offset + 30 + nameLen + extraLen;
  }
  private _isFileAvailable(name: string) {
    const info = this._files[name];
    if (!info) {
      this._error(`File ${name} not found in ZIP`);
    }
    if (this._pHead < (info.off + 30)) {
      return false;
    }
    return this._pHead >= (this._fileDataStart(info.off) + info.len);
  }
  private _loadNextFrame() {
    if (this._dead) {
      return;
    }
    const frame = this._loadFrame;
    if (frame >= this._frameCount) {
      return;
    }
    const meta = this.op.metadata.frames[frame];
    if (!this.op.source) {
      // Unpacked mode (individiual frame URLs)
      this._loadFrame += 1;
      this._loadImage(frame, meta.file, false);
      return;
    }
    if (!this._isFileAvailable(meta.file)) {
      return;
    }
    this._loadFrame += 1;
    const off = this._fileDataStart(this._files[meta.file].off);
    const end = off + this._files[meta.file].len;
    let url: string;
    const mime_type = this.op.metadata.mime_type || "image/png";
    let slice: Iterable<number> | BlobPart;
    if (!this._buf.slice) {
      slice = new this._ArrayBuffer(this._files[meta.file].len);
      const view = new this._Uint8Array(slice);
      view.set(this._bytes.subarray(off, end));
    } else {
      slice = this._buf.slice(off, end);
    }
    let blob = new this._Blob([slice], { type: mime_type });
    url = this._URL.createObjectURL(blob);
    this._loadImage(frame, url, true);
}
private _loadImage(frame: number, url: string, isBlob: boolean) {
    const image = new Image();
    const meta = this.op.metadata.frames[frame];
    image.addEventListener('load', () => {
      this._debugLog(`Loaded ${meta.file} to frame ${frame}`);
      if (isBlob) {
        this._URL.revokeObjectURL(url);
      }
      if (this._dead) {
        return;
      }
      this._frameImages[frame] = image;
      if (this._loadingState == 0) {
        this._displayFrame.apply(this);
      }
      if (frame >= (this._frameCount - 1)) {
        this._setLoadingState(2);
        this._buf = null;
        this._bytes = null;
      } else {
        if (!this._maxLoadAhead ||
                    (frame - this._frame) < this._maxLoadAhead) {
          this._loadNextFrame();
        } else if (!this._loadTimer) {
          this._loadTimer = window.setTimeout(() => {
            this._loadTimer = null;
            this._loadNextFrame();
          }, 200);
        }
      }
    });
    image.src = url;
  }
  private _setLoadingState(state: number) {
    if (this._loadingState != state) {
      this._loadingState = state;
    }
  }
  private _displayFrame() {
    if (this._dead) {
      return;
    }
    const meta = this.op.metadata.frames[this._frame];
    this._debugLog(`Displaying frame: ${this._frame} ${meta.file}`);
    const image = this._frameImages[this._frame];
    if (!image) {
      this._debugLog("Image not available!");
      this._setLoadingState(0);
      return;
    }
    if (this._loadingState != 2) {
      this._setLoadingState(1);
    }
    if (this.op.autosize) {
      if (this._context.canvas.width != image.width || this._context.canvas.height != image.height) {
        // make the canvas autosize itself according to the images drawn on it
        // should set it once, since we don't have variable sized frames
        this._context.canvas.width = image.width;
        this._context.canvas.height = image.height;
      }
    }
    this._context.clearRect(0, 0, this.op.canvas.width,
      this.op.canvas.height);
    this._context.drawImage(image, 0, 0);
    if (!this._paused) {
      this._timer = window.setTimeout(() => {
        this._timer = null;
        this._nextFrame.apply(this);
      }, meta.delay);
    }
  }
  private _nextFrame() {
    if (this._frame >= (this._frameCount - 1)) {
      if (this.op.loop) {
        this._frame = 0;
      } else {
        this.pause();
        return;
      }
    } else {
      this._frame += 1;
    }
    this._displayFrame();
  }
  play() {
    if (this._dead) {
      return;
    }
    if (this._paused) {
      this._paused = false;
      this._displayFrame();
    }
  }
  pause() {
    if (this._dead) {
      return;
    }
    if (!this._paused) {
      if (this._timer) {
        clearTimeout(this._timer);
      }
      this._paused = true;
    }
  }
  rewind() {
    if (this._dead) {
      return;
    }
    this._frame = 0;
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._displayFrame();
  }
  stop() {
    this._debugLog("Stopped!");
    this._dead = true;
    if (this._timer) {
      clearTimeout(this._timer);
    }
    if (this._loadTimer) {
      clearTimeout(this._loadTimer);
    }
    this._frameImages = null;
    this._buf = null;
    this._bytes = null;
  }
  getCurrentFrame() {
    return this._frame;
  }
  getLoadedFrames() {
    return this._frameImages.length;
  }
  getFrameCount() {
    return this._frameCount;
  }
  hasError() {
    return this._failed;
  }
}
