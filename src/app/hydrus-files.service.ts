import { Injectable } from '@angular/core';
import { HydrusFileList, HydrusFile } from './hydrus-file';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HydrusFilesService {

  constructor() { }

  private allFiles: HydrusFileList = [];

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
