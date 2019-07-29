import { Injectable } from '@angular/core';
import { every, map } from 'rxjs/operators';
import { Observable, forkJoin, merge } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

const storageAPIKEY = "hydrusApiKey";
const storageAPIURL = "hydrusApiUrl";

export interface APISettings {
  apiKey: string;
  apiUrl: string;
}


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

/*   constructor(private storageMap: StorageMap) { }


  public getAPISettings(): Observable<APISettings> {
    return this.storageMap.get<unknown>("app_settings_1");
  }
  
  public getApiUrl(): Observable<string> {
    return this.storageMap.get<unknown>(storageAPIURL) as Observable<string>; //probably bad
  }

  public setApiUrl(apiUrl:string): Observable<boolean> {
    return this.storageMap.set(storageAPIURL, apiUrl);
  }

  public getApiKey(): Observable<string> {
    return this.storageMap.get<unknown>(storageAPIKEY) as Observable<string>; //probably bad
  }

  public setApiKey(apiKey:string): Observable<boolean> {
    return this.storageMap.set(storageAPIKEY, apiKey);
  }

  public clearData(): Observable<boolean> {
    return this.storageMap.clear();
  }

  public setApi(apiUrl:string, apiKey:string): Observable<boolean> {
    return merge(this.setApiUrl(apiUrl), this.setApiKey(apiKey)).pipe(every(val => val));
  }

  public getApi():Observable<{apiUrl:string, apiKey: string}> {
    return forkJoin({apiUrl: this.getApiUrl, apiKey: this.getApiKey});
  }

  public hasApi():Observable<boolean> {
    return forkJoin(this.storageMap.has(storageAPIURL), this.storageMap.has(storageAPIKEY)).pipe(map(([a, b]) => a && b));
  } */
}
