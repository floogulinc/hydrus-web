import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HydrusApiService } from './hydrus-api.service';
import { HydrusTagSearchTag, TagDisplayType } from './hydrus-tags';

@Injectable({
  providedIn: 'root'
})
export class HydrusTagsService {

  constructor(private api: HydrusApiService) { }

  searchTags(search: string, tag_display_type: TagDisplayType = 'storage'): Observable<HydrusTagSearchTag[]> {
    return this.api.searchTags({search, tag_display_type}).pipe(map(r => r['tags']));
  }

  addTagsToService(hash: string, tags: string[], serviceKey: string) {
    return this.api.addTags(
      {
        hash,
        service_keys_to_tags: {
          [serviceKey]: tags
        }
      }
    )
  }

  deleteTagsFromLocalService(hash: string, tags: string[], serviceKey: string) {
    return this.api.addTags(
      {
        hash,
        service_keys_to_actions_to_tags: {
          [serviceKey]: {
            "1": tags
          }
        }
      }
    )
  }


}
