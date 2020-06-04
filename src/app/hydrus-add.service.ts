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
export class HydrusAddService {

  constructor(private api: HydrusApiService) { }

  public getUrlInfo(url: string): Observable<HydrusURLInfo> {
    return this.api.getUrlInfo(url) as Observable<HydrusURLInfo>;
  }

  public getUrlFiles(url: string): Observable<HydrusURLFiles> {
    return this.api.getUrlFiles(url) as Observable<HydrusURLFiles>;
  }

  public addUrl(url: string, options?: AddUrlOptions): Observable<HydrusAddURLResponse> {

    return this.api.addUrl({url, ...options}) as Observable<HydrusAddURLResponse>;
  }


}
