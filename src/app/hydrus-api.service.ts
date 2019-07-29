import { Injectable } from '@angular/core';
import {ngxLocalStorage} from 'ngx-localstorage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface HydrusKeyVerificationData {
  basic_permissions: number[];
  human_description: string;
}


@Injectable({
  providedIn: 'root'
})
export class HydrusApiService {


  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiUrl: string;

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiKey: string;

  constructor(private http: HttpClient) { }

  public testApi(): Observable<HydrusKeyVerificationData> {
    return this.http.get<HydrusKeyVerificationData>(this.hydrusApiUrl + "verify_access_key", {
      headers: {
        "Hydrus-Client-API-Access-Key" : this.hydrusApiKey
      }
    });
  }

  public searchFiles(tags: string[], system_inbox?: boolean, system_archive?: boolean): Observable<number[]> {
    return this.http.get<number[]>(this.hydrusApiUrl + "get_files/search_files", {
      params: {
        'tags' : JSON.stringify(tags),
        "system_inbox" : system_inbox ? "true" : "false",
        "system_archive" : system_archive ? "true" : "false"
      },
      headers: {
        "Hydrus-Client-API-Access-Key" : this.hydrusApiKey
      }
    }).pipe(map(a => a['file_ids']));
  }

//  searchFiles(tags: string[], system_inbox: boolean, system_archive: boolean): Observable<number[]> {
//    this.settings.getApi().switchMap(api => {
 //     
  //  })
//  }



}
