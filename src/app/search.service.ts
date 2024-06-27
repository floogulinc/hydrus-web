import { HydrusApiService } from './hydrus-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HydrusSearchTags } from './hydrus-tags';
import { HydrusSortType } from './hydrus-sort';
import { HydrusRequestFileDomain } from './hydrus-api';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private api: HydrusApiService) { }


  public searchFiles(tags: HydrusSearchTags, options?: {
    tag_service_key?: string;
    file_sort_type?: HydrusSortType;
    file_sort_asc?: boolean;
  } & HydrusRequestFileDomain): Observable<number[]> {
    return this.api.searchFiles(
      tags,
      {
        ...options,
        return_file_ids: true,
        return_hashes: false
      }
    ).pipe(map(a => a.file_ids));
  }
}
