import { Injectable } from '@angular/core';
import { HydrusFilesService } from './hydrus-files.service';
import { SearchService } from './search.service';
import { forkJoin, from } from 'rxjs';
import { map, switchMap, filter, mergeMap, toArray, delay, concatMap } from 'rxjs/operators';
import { TagUtils } from './tag-utils';

@Injectable({
  providedIn: 'root'
})
export class ComicsService {

  constructor(private fileService: HydrusFilesService, private searchService: SearchService) { }

  comicTags: string[] = [];

  findComics() {
    forkJoin([this.searchService.searchFiles(['page:0']), this.searchService.searchFiles(['page:1'])]).pipe(
      map(r => [...new Set([].concat(...r))]),
      switchMap(ids => this.fileService.getFileMetadata(ids)),
      switchMap(files => from(new Set(files.map(f => {
        return '0' in f.service_names_to_statuses_to_tags['all known tags'] ? f.service_names_to_statuses_to_tags['all known tags']['0'] : [];
      }).reduce((acc, val) => acc.concat(val), [])))),
      filter(tag => TagUtils.getNamespace(tag) === 'title'),
      delay(1000),
      mergeMap(tag => this.searchService.searchFiles([tag]).pipe(
        map(files => ({tag, files}))
      )),
      filter(({files}) => files.length > 2),
      map(x => x.tag),
      toArray()
    ).subscribe(x => {
      this.comicTags = x;
      console.log(x);
    });
  }
}
