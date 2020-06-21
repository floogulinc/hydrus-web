import { Injectable } from '@angular/core';
import { HydrusFilesService } from './hydrus-files.service';
import { SearchService } from './search.service';
import { forkJoin, from } from 'rxjs';
import { map, switchMap, filter, mergeMap, toArray, delay, concatMap } from 'rxjs/operators';
import { TagUtils } from './tag-utils';
import { HydrusFile } from './hydrus-file';

@Injectable({
  providedIn: 'root'
})
export class ComicsService {

  constructor(private fileService: HydrusFilesService, private searchService: SearchService) { }

  comicTags: {
    tag: string,
    volumes: {tag: string, coverFile: HydrusFile}[]
  }[] = [];

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
    forkJoin([this.searchService.searchFiles(['page:0']), this.searchService.searchFiles(['page:1'])]).pipe(
      map(r => [...new Set([].concat(...r))]),
      switchMap(ids => this.fileService.getFileMetadata(ids)),
      switchMap(files => from(new Set(files.map(f => this.tagsFromFile(f)).reduce((acc, val) => acc.concat(val), [])))),
      filter(tag => TagUtils.getNamespace(tag) === 'title'),
      mergeMap(tag => this.searchService.searchFiles([tag]).pipe(
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
          cover: this.findCoverFile(fileMetadata)
        }))
      )),
      toArray()
    ).subscribe(x => {
      this.comicTags = x;
      console.log(x);
    });
  }
}
