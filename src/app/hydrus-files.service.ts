import { Injectable } from '@angular/core';
import { HydrusFile, HydrusFileFromAPI, HydrusFileType } from './hydrus-file';
import { Observable, of, forkJoin } from 'rxjs';
import { HydrusApiService } from './hydrus-api.service';
import { map, tap } from 'rxjs/operators';
import { TagUtils } from './tag-utils';

function chunk<T>(array: T[], size: number): T[][] {
  const chunked = [];
  for (let i = 0; i < array.length; i = i + size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

const QUERY_CHUNK_SIZE = 256;


@Injectable({
  providedIn: 'root'
})
export class HydrusFilesService {

  constructor(private api: HydrusApiService) { }

  private allFiles: Map<number, HydrusFile> = new Map<number, HydrusFile>();

  private allTags: Set<string> = new Set<string>();

  clearFilesCache(): void {
    this.allFiles.clear();
  }

  clearKnownTags(): void {
    this.allTags.clear();
  }

  getFilesCacheSize(): number {
    return this.allFiles.size;
  }

  getKnownTagsSize(): number {
    return this.allTags.size;
  }

  type(mime: string): HydrusFileType {
    if ([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/apng',
      'image/gif',
      'image/bmp',
      'image/webp'
    ].includes(mime)) {
      return HydrusFileType.Image;
    }
    if ([
      'video/mp4',
      'video/webm',
      'video/x-matroska',
      'video/quicktime',
    ].includes(mime)) {
      return HydrusFileType.Video;
    }
    if ([
      'audio/mp3',
      'audio/ogg',
      'audio/flac',
      'audio/x-wav',
    ].includes(mime)) {
      return HydrusFileType.Audio;
    }
    if ([
      'video/x-flv',
      'application/x-shockwave-flash'
    ].includes(mime)) {
      return HydrusFileType.Flash;
    }
    return HydrusFileType.Unsupported;
  }

  hasThumbnail(mime: string) {
    return ([
      'application/x-shockwave-flash',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/apng',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/tiff',
      'image/x-icon',
      'video/x-msvideo',
      'video/x-flv',
      'video/quicktime',
      'video/mp4',
      'video/mpeg',
      'video/x-ms-wmv',
      'video/x-matroska',
      'video/vnd.rn-realvideo',
      'application/vnd.rn-realmedia',
      'video/webm',
      'application/x-photoshop',
      'application/clip'
    ].includes(mime));
  }


  private getFileMetadataAPI(fileIds: number[]): Observable<HydrusFileFromAPI[]> {
    // tslint:disable-next-line: no-string-literal
    return this.api.getFileMetadata({ file_ids: JSON.stringify(fileIds) }).pipe(map(val => val['metadata']));
  }

  private getFileMetadataAPIChunked(fileIds: number[]): Observable<HydrusFileFromAPI[]> {
    return forkJoin(chunk(fileIds, QUERY_CHUNK_SIZE).map(ids => this.getFileMetadataAPI(ids))).pipe(
      map(files => files.flat())
    );
  }

  private getAndAddMetadata(fileIds: number[]): Observable<HydrusFile[]> {
    if (fileIds.length === 0) { return of([]); }
    return this.getFileMetadataAPIChunked(fileIds).pipe(
      map(v => v.map(i => ({
        ...i,
        file_url: this.api.getFileURLFromHash(i.hash),
        thumbnail_url: this.api.getThumbnailURLFromHash(i.hash),
        file_type: this.type(i.mime),
        has_thumbnail: this.hasThumbnail(i.mime)
      }))),
      tap(v => this.addFilesAndTags(v)));
  }

  private addFilesAndTags(files: HydrusFile[]) {
    files.forEach((file) => {
      this.allFiles.set(file.file_id, file);
      this.AddTags(file);
    });
  }

  getFileMetadata(fileIds: number[]): Observable<HydrusFile[]> {
    const existingFiles: HydrusFile[] = [];
    const filesToGet: number[] = [];
    for (const id of fileIds) {
      if (this.allFiles.has(id)) {
        existingFiles.push(this.allFiles.get(id));
      } else {
        filesToGet.push(id);
      }
    }
    return forkJoin([of(existingFiles), this.getAndAddMetadata(filesToGet)]).pipe(
      map(([s1, s2]) => [...s1, ...s2]),
      map((files) => {
        return files.sort((a, b) => {
          return fileIds.indexOf(a.file_id) - fileIds.indexOf(b.file_id);
        });
      })
    );
  }

  private AddTags(file: HydrusFile) {
    TagUtils.AllTagsFromFile(file).forEach((tag) => this.allTags.add(tag));
    // if (file.service_names_to_statuses_to_tags) {
    //   if ('0' in file.service_names_to_statuses_to_tags['all known tags']) {
    //     file.service_names_to_statuses_to_tags['all known tags']['0'].forEach((tag) => this.allTags.add(tag));
    //   }
    // }
  }

  getKnownTags(): Set<string> {
    return this.allTags;
  }

  public getFileAsFile(file: HydrusFile): Observable<File> {
    return this.api.getFileAsBlob(file.hash).pipe(
      map(b => new File([b], file.hash + file.ext, {type: this.fixFileType(b.type)}))
    );
  }

  // Needed until https://github.com/hydrusnetwork/hydrus/issues/646 is merged
  private fixFileType(type: string) {
    if (type === 'image/jpg') {
      return 'image/jpeg';
    } else {
      return type;
    }
  }

}
