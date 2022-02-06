import { Injectable } from '@angular/core';
import { HydrusFilesService } from './hydrus-files.service';
import { SearchService } from './search.service';
import { forkJoin, from } from 'rxjs';
import { map, switchMap, filter, mergeMap, toArray, delay, concatMap, tap, reduce, distinct, retry } from 'rxjs/operators';
import { TagUtils } from './tag-utils';
import { HydrusFile } from './hydrus-file';
import { ProgressBarMode } from '@angular/material/progress-bar';

export interface FlatComic {
  tag: string;
  volume?: string;
  coverFile: HydrusFile;
  numFiles: number;
}

const CONCURRENCY = 8;

@Injectable({
  providedIn: 'root'
})
export class ComicsService {

  constructor(private fileService: HydrusFilesService, private searchService: SearchService) { }

  comicsFlat: FlatComic[] = [];

  comicFilters: string[] = [];
  titleNamespace = 'title';

  loadingState: {
    loading: boolean,
    progress?: number,
    total?: number,
    barMode: ProgressBarMode,
    currentTag?: string
  } = {
    loading: false,
    barMode: 'indeterminate'
  };

  clearComics() {
    this.comicsFlat = [];
  }

  updateLoading(tag: string) {
    if (this.loadingState.progress + 1 === this.loadingState.total) {
      this.loadingState = {
        loading: true,
        barMode: 'indeterminate'
      };
    } else {
      this.loadingState = {
        ...this.loadingState,
        progress: this.loadingState.progress + 1,
        currentTag: tag,
        barMode: this.loadingState.progress + 1 === this.loadingState.total ? 'indeterminate' : 'determinate'
      };
    }
  }

  private findCoverFile(files: HydrusFile[]): HydrusFile {
    let coverFile: HydrusFile = files.find(f => TagUtils.AllTagsFromFile(f).includes('page:0'));
    if (!coverFile) { coverFile = files.find(f => TagUtils.AllTagsFromFile(f).includes('page:1')); }
    if (!coverFile) { coverFile = files[0]; }
    return coverFile;
  }

  findComics() {
    const startTime = performance.now();
    this.clearComics();
    this.loadingState = {
      loading: true,
      barMode: 'query',
      progress: 0
    };
    forkJoin([
      this.searchService.searchFiles(['page:0', ...this.comicFilters]),
      this.searchService.searchFiles(['page:1', ...this.comicFilters])])
    .pipe(
      map(r => [...new Set([].concat(...r))]),
      switchMap(ids => this.fileService.getFileMetadata(ids)),
      map(files => new Set(
        files.map(f => TagUtils.AllTagsFromFile(f))
        .reduce((acc, val) => acc.concat(val), [])
        .filter(tag => TagUtils.getNamespace(tag) === this.titleNamespace)
      )),
      tap(tags => {
        this.loadingState = {
          ...this.loadingState,
          total: tags.size,
        };
        console.log(`Found ${tags.size} title tags`);
      }),
      switchMap(tags => from(tags)),
      mergeMap(tag => this.searchService.searchFiles([tag]).pipe(
        tap(() => this.updateLoading(tag)),
        map(files => ({tag, files}))
      ), CONCURRENCY))
    .pipe(
      filter(({files}) => files.length > 3),
      distinct(({files}) => files.toString()),
      mergeMap(({tag, files}) => this.fileService.getFileMetadata(files).pipe(
        map(fileMetadata => ({
          tag,
          volumes: [...new Set(fileMetadata.map(f => TagUtils.AllTagsFromFile(f)).reduce((acc, val) => acc.concat(val), []))]
            .filter(t => TagUtils.getNamespace(t) === 'volume')
            .map(vtag => {
              const volumefiles = fileMetadata.filter(f => TagUtils.AllTagsFromFile(f).includes(vtag));
              return {
                tag: vtag,
                coverFile: this.findCoverFile(volumefiles),
                numFiles: volumefiles.length
              };
            }
          ),
          coverFile: this.findCoverFile(fileMetadata),
          numFiles: fileMetadata.length
        }))
      ), CONCURRENCY),
      reduce((acc, val) => acc.concat([{tag: val.tag, coverFile: val.coverFile, numFiles: val.numFiles}, ...val.volumes.map(v => ({
        tag: val.tag,
        volume: v.tag,
        coverFile: v.coverFile,
        numFiles: v.numFiles
      }))]), [])
    ).subscribe(comics => {
      this.loadingState = {
        loading: false,
        barMode: 'indeterminate'
      };
      this.comicsFlat = comics;
      const endTime = performance.now();
      console.log(`Found ${comics.length} comics in ${endTime - startTime}ms`);
    });
  }
}
