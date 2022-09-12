import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { AppSettings, defaultAppSettings } from './settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private appSettingsKey = 'appSettings';

  private _appSettings$: BehaviorSubject<AppSettings>;

  private _appSettings: AppSettings;

  public appSettings$: Observable<AppSettings>;

  constructor(private ls: LocalStorageService) {
    const appSettingsFromStorage = ls.get(this.appSettingsKey) as AppSettings | null;
    this._appSettings = {...defaultAppSettings, ...appSettingsFromStorage};
    this._appSettings$ = new BehaviorSubject(this._appSettings);
    this.appSettings$ = this._appSettings$.asObservable();
  }


  public get appSettings() {
    return this._appSettings;
  }

  public async setAppSettings(newSettings: AppSettings) {
    this._appSettings = newSettings;
    this._appSettings$.next(this._appSettings);
    return this.ls.asPromisable().set(this.appSettingsKey, newSettings);
  }


}
