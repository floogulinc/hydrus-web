import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectPersistStateInit } from '@datorama/akita';
import { filter, switchMap, take } from 'rxjs/operators';
import { HydrusApiSettingsQuery, HydrusApiSettingsStore } from './hydrus-api-settings';

@Injectable({
  providedIn: 'root'
})
export class HydrusApiSettingsMigrateService {

  constructor(
    private hydrusApiSettingsStore: HydrusApiSettingsStore,
    private hydrusApiSettingsQuery: HydrusApiSettingsQuery,
    private snackbar: MatSnackBar
  ) {

  }


  migrate() {
    selectPersistStateInit().pipe(take(1)).subscribe(() => {
      console.log('Checking for existing API config');
      const localStorage = window.localStorage;
      const hydrusApiUrl = localStorage.getItem('hydrus-web-1_hydrusApiUrl');
      const hydrusApiKey = localStorage.getItem('hydrus-web-1_hydrusApiKey');
      if (hydrusApiUrl && hydrusApiKey) {
        this.snackbar.open('Migrating API configuration...', undefined, {
          duration: 2000
        });
        this.hydrusApiSettingsStore.update({hydrusApiUrl, hydrusApiKey});
        localStorage.removeItem('hydrus-web-1_hydrusApiUrl');
        localStorage.removeItem('hydrus-web-1_hydrusApiKey');
      }
    })
  }
}

