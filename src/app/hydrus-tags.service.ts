import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HydrusApiService } from './hydrus-api.service';
import { HydrusTagSearchTag, TagDisplayType } from './hydrus-tags';
import { HydrusVersionService } from './hydrus-version.service';

@Injectable({
  providedIn: 'root'
})
export class HydrusTagsService {

  constructor(private api: HydrusApiService, private versionService: HydrusVersionService) { }

  canGetSiblingsParents$ = this.versionService.hydrusVersion$.pipe(
    map(v => v && v.hydrus_version >= 541),
  )

  searchTags(search: string, tag_display_type: TagDisplayType = 'storage') {
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

  getTagSiblingsAndParentsArray(tag: string, noCache = false) {
    return this.api.getSiblingsAndParents([tag], noCache).pipe(
      map(({ services, tags }) => Object.entries(tags[tag]).map(([serviceKey, data]) => {
        const service = services[serviceKey];
        return {
          serviceKey,
          serviceName: service.name,
          serviceType: service.type,
          ...data
        }
      }))
    );
  }


}
