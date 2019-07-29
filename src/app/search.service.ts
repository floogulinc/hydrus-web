import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private settings: SettingsService) {}

  /* search(tags?: string[]) : Observable<number[]> {
    return this.settings.getApi
  } */

}
