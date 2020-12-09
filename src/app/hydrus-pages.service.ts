import { Injectable } from '@angular/core';
import { HydrusPageListItem, HydrusPage } from './hydrus-page';
import { HydrusApiService } from './hydrus-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable: no-string-literal

@Injectable({
  providedIn: 'root'
})
export class HydrusPagesService {

  constructor(private api: HydrusApiService) { }

  getAllPages(): Observable<HydrusPageListItem[]> {
    return this.api.getPages().pipe(map(val => val['pages']['pages']));
  }

  getPage(pageKey: string): Observable<HydrusPage> {
    return this.api.getPageInfo(pageKey, 'true').pipe(map(val => val['page_info']));
  }

}
