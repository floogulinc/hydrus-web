import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject, Observable, ReplaySubject, distinctUntilChanged, shareReplay } from 'rxjs';
import { AppSettings, AppSettingsStorage, defaultAppSettings } from './settings';
import { dequal } from 'dequal';

const appSettingsKey = 'appSettings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _appSettings$: BehaviorSubject<AppSettings>;

  public appSettings$: Observable<AppSettings>;

  constructor(private ls: LocalStorageService) {
    const {version, ...settings} = ls.get(appSettingsKey) as AppSettingsStorage | null || {};
    const newSettings = {...defaultAppSettings, ...settings};
    this._appSettings$ = new BehaviorSubject(newSettings);
    this.appSettings$ = this._appSettings$.asObservable().pipe(
      distinctUntilChanged(dequal),
      shareReplay(1)
    );
  }


  public get appSettings(): AppSettings {
    return this._appSettings$.getValue();
  }

  private async storeAppSettings(settings: AppSettingsStorage) {
    return this.ls.asPromisable().set(appSettingsKey, settings);
  }

  public async setAppSettings(newSettings: Partial<AppSettings>) {
    const settings = {...defaultAppSettings, ...newSettings};
    this._appSettings$.next(settings);
    this.storeAppSettings({version : 1, ...settings})
  }


}
