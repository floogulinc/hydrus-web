import { Injectable } from '@angular/core';
import { HydrusPageListItem } from './hydrus-page';
import { HydrusApiService } from './hydrus-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HydrusPagesService {

  constructor(private api: HydrusApiService) { }

  getAllPages() : Observable<HydrusPageListItem[]> {
    return this.api.getPages().pipe(map(val => val["pages"]["pages"]));
  }

}
