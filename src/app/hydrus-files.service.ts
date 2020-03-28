import { Injectable } from '@angular/core';
import { HydrusFileList, HydrusFile } from './hydrus-file';
import { Observable, of, iif, forkJoin } from 'rxjs';
import { HydrusApiService } from './hydrus-api.service';
import { map, switchMap, mergeMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HydrusFilesService {

  constructor(private api: HydrusApiService) { }

  private allFiles : Map<number, HydrusFile> = new Map<number, HydrusFile>();

  private allTags : Set<string> = new Set<string>();

  private getFileMetadataAPI(file_ids: number[]): Observable<HydrusFile[]> {
    return this.api.getFileMetadata(JSON.stringify(file_ids)).pipe(map(val => val["metadata"]));
  }

  private getAndAddMetadata(file_ids: number[]) : Observable<HydrusFile[]> {
    if(file_ids.length == 0) return of([]);
    return this.getFileMetadataAPI(file_ids).pipe(
      map(v => v.map(i => ({
        ...i,
        file_url: this.api.getFileURL(i.file_id),
        thumbnail_url: this.api.getThumbnailURL(i.file_id)
      }))),
      tap(v => this.addFilesAndTags(v)));
  }

  private addFilesAndTags(files: HydrusFile[]) {
    files.forEach((file) => {
      this.allFiles.set(file.file_id, file);
      this.AddTags(file);
    });
  }

  getFileMetadata(file_ids: number[]) : Observable<HydrusFile[]> {
    let files : HydrusFile[] = [];
    let filesToGet: number[] = [];
    for(let id of file_ids) {
      if(this.allFiles.has(id)) {
        files.push(this.allFiles.get(id));
      } else {
        filesToGet.push(id);
      }
    }
    return forkJoin(of(files), this.getAndAddMetadata(filesToGet)).pipe(
      map(([s1, s2]) => [...s1, ...s2]),
      map((files) => {
        return files.sort((a,b) => {
          return file_ids.indexOf(a.file_id) - file_ids.indexOf(b.file_id);
        })
      })
      );

  }

      private AddTags(file: HydrusFile) {
        if(file.service_names_to_statuses_to_tags){
          // Object.entries(file.service_names_to_statuses_to_tags).forEach(([key, value]) => {
          //   if ("0" in value) {
          //     value["0"].forEach((tag) => this.allTags.add(tag));
          //   }
          // })
          if ("0" in file.service_names_to_statuses_to_tags["all known tags"]) {
            file.service_names_to_statuses_to_tags["all known tags"]["0"].forEach((tag) => this.allTags.add(tag));
          }
        }
      }

    getKnownTags() : Set<string> {
      return this.allTags;
    }

      /*   public getFileMetadata(id: number) : Observable<HydrusFile> {

        return Observable.create((observer) => {
          observer.next(this.allFiles.get(id));
          observer.complete();
        }).pipe(switchMap(val => val == undefined ? ))
      }
      */
      /* public getFile(id: number) : Observable<HydrusFile> {
        if(this.allFiles[id]) {
          return of(this.allFiles[id]);
        } else {
          return this.getAndAddFile(id);
        }
      } */

      /* private getAndAddFile(id: number) : Observable<HydrusFile> {

      } */

}
