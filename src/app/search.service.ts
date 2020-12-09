import { HydrusApiService } from './hydrus-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private api: HydrusApiService) { }


  public searchFiles(tags: string[], options?: {system_inbox?: boolean, system_archive?: boolean}): Observable<number[]> {
    return this.api.searchFiles(
      encodeURIComponent(JSON.stringify(tags)),
      {
        system_inbox: options && options.system_inbox ? 'true' : 'false',
        system_archive: options && options.system_archive ? 'true' : 'false'
      }
    // tslint:disable-next-line: no-string-literal
    ).pipe(map(a => a['file_ids']));
  }
}
