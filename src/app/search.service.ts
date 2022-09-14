import { HydrusApiService } from './hydrus-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HydrusSearchTags } from './hydrus-tags';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private api: HydrusApiService) { }


  public searchFiles(tags: HydrusSearchTags, options?: {system_inbox?: boolean, system_archive?: boolean}): Observable<number[]> {
    return this.api.searchFiles(
      encodeURIComponent(JSON.stringify(tags)),
      {
        system_inbox: options && options.system_inbox ? 'true' : 'false',
        system_archive: options && options.system_archive ? 'true' : 'false'
      }
    // eslint-disable-next-line @typescript-eslint/dot-notation
    ).pipe(map(a => a['file_ids']));
  }
}
