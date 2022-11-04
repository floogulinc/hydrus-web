import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { AppSettings, AppSettingsStorage, defaultAppSettings } from './settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private appSettingsKey = 'appSettings';

  private _appSettings$: BehaviorSubject<AppSettings>;

  private _appSettings: AppSettings;

  public appSettings$: Observable<AppSettings>;

  constructor(private ls: LocalStorageService) {
    const {version, ...settings} = ls.get(this.appSettingsKey) as AppSettingsStorage | null || {};
    this._appSettings = {...defaultAppSettings, ...settings};
    this._appSettings$ = new BehaviorSubject(this._appSettings);
    this.appSettings$ = this._appSettings$.asObservable();
  }


  public get appSettings() {
    return this._appSettings;
  }

  private async storeAppSettings(settings: AppSettingsStorage) {
    return this.ls.asPromisable().set(this.appSettingsKey, settings);
  }

  public async setAppSettings(newSettings: Partial<AppSettings>) {
    this._appSettings = {...defaultAppSettings, ...newSettings};
    this._appSettings$.next(this._appSettings);
    this.storeAppSettings({version : 1, ...this._appSettings})
  }


}
