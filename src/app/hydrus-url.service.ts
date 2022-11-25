import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';
import { Observable } from 'rxjs';
import { HydrusURLInfo, HydrusURLFiles, HydrusURLServiceNamesToTags, HydrusAddURLResponse } from './hydrus-url';

export interface AddUrlOptions {
  destination_page_key?: string;
  destination_page_name?: string;
  show_destination_page?: string;
  service_names_to_tags?: HydrusURLServiceNamesToTags;
}

@Injectable({
  providedIn: 'root'
})
export class HydrusUrlService {

  constructor(private api: HydrusApiService) { }

  public getUrlInfo(url: string) {
    return this.api.getUrlInfo(url);
  }

  public getUrlFiles(url: string) {
    return this.api.getUrlFiles(url);
  }

  public addUrl(url: string, options?: AddUrlOptions): Observable<HydrusAddURLResponse> {
    return this.api.addUrl({url, ...options}) as Observable<HydrusAddURLResponse>;
  }

  public associateUrl(hash: string, url: string) {
    return this.api.associateUrls({url_to_add: url, hash});
  }

  public deleteUrl(hash: string, url: string) {
    return this.api.associateUrls({url_to_delete: url, hash});
  }

  public replaceUrl(hash: string, oldUrl: string, newUrl: string) {
    return this.api.associateUrls({url_to_delete: oldUrl, url_to_add: newUrl, hash});
  }

}
