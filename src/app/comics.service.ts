import { Injectable } from '@angular/core';
import { HydrusFilesService } from './hydrus-files.service';
import { SearchService } from './search.service';
import { forkJoin, from } from 'rxjs';
import { map, switchMap, filter, mergeMap, toArray, delay, concatMap, tap, reduce } from 'rxjs/operators';
import { TagUtils } from './tag-utils';
import { HydrusFile } from './hydrus-file';

interface FlatComic {
  tag: string;
  volume?: string;
  coverFile: HydrusFile;
}


@Injectable({
  providedIn: 'root'
})
export class ComicsService {

  constructor(private fileService: HydrusFilesService, private searchService: SearchService) { }

  comicsFlat: FlatComic[] = [];

  comicFilters: string[] = [];

  loadingState : {
    loading: boolean,
    progress?: number,
    total?: number,
    barMode: string,
    currentTag?: string
  } = {
    loading: false,
    barMode: 'indeterminate'
  };

  clearComics() {
    this.comicsFlat = [];
  }

  updateLoading(tag: string) {
    if(this.loadingState.progress + 1 === this.loadingState.total) {
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

  private tagsFromFile(file: HydrusFile): string[] {
    return '0' in file.service_names_to_statuses_to_tags['all known tags'] ? file.service_names_to_statuses_to_tags['all known tags']['0'] : [];
  }

  private findCoverFile(files: HydrusFile[]): HydrusFile {
    let coverFile: HydrusFile = files.find(f => this.tagsFromFile(f).includes('page:0'));
    if (!coverFile) { coverFile = files.find(f => this.tagsFromFile(f).includes('page:1')); }
    if (!coverFile) { coverFile = files[0]; }
    return coverFile;
  }

  findComics() {
    let startTime = performance.now();
    this.clearComics();
    this.loadingState = {
      loading: true,
      barMode: 'query',
      progress: 0
    };
    forkJoin([this.searchService.searchFiles(['page:0', ...this.comicFilters]), this.searchService.searchFiles(['page:1', ...this.comicFilters])]).pipe(
      map(r => [...new Set([].concat(...r))]),
      switchMap(ids => this.fileService.getFileMetadata(ids)),
      map(files => new Set(files.map(f => this.tagsFromFile(f)).reduce((acc, val) => acc.concat(val), []).filter(tag => TagUtils.getNamespace(tag) === 'title'))),
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
      )),
      filter(({files}) => files.length > 3),
      mergeMap(({tag, files}) => this.fileService.getFileMetadata(files).pipe(
        map(fileMetadata => ({
          tag,
          volumes: [...new Set(fileMetadata.map(f => this.tagsFromFile(f)).reduce((acc, val) => acc.concat(val), []))]
            .filter(t => TagUtils.getNamespace(t) === 'volume')
            .map(vtag => ({
              tag: vtag,
              coverFile: this.findCoverFile(fileMetadata.filter(f => this.tagsFromFile(f).includes(vtag)))
            })
          ),
          coverFile: this.findCoverFile(fileMetadata)
        }))
      )),
      reduce((acc, val) => acc.concat([{tag: val.tag, coverFile: val.coverFile}, ...val.volumes.map(v => ({
        tag: val.tag,
        volume: v.tag,
        coverFile: v.coverFile
      }))]), [])
    ).subscribe(comics => {
      this.loadingState = {
        loading: false,
        barMode: 'indeterminate'
      };
      this.comicsFlat = comics;
      let endTime = performance.now();
      console.log(`Found ${comics.length} comics in ${endTime - startTime}ms`);
    });
  }
}
