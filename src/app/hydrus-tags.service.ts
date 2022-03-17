import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HydrusApiService } from './hydrus-api.service';
import { HydrusTagSearchTag } from './hydrus-tags';

@Injectable({
  providedIn: 'root'
})
export class HydrusTagsService {

  constructor(private api: HydrusApiService) { }

  searchTags(search: string): Observable<HydrusTagSearchTag[]> {
    return this.api.searchTags({search}).pipe(map(r => r['tags']));
  }


}
