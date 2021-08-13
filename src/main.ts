
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableAkitaProdMode } from '@datorama/akita';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { persistState } from '@datorama/akita';
import { debounceTime } from 'rxjs/operators';

import * as localForage from 'localforage';
import { HydrusApiSettingsState } from './app/hydrus-api-settings';

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

localForage.config({
  name: 'hydrus-web',
  version: 1.0,
  storeName: 'akita-storage',
});

const storage = persistState({
  include: [
    'hydrus-api-settings',
    'settings'
  ],
  preStorageUpdateOperator: () => debounceTime(2000),
  storage: localForage,
  preStoreUpdate(storeName, state, initialState) {
    console.log(`preStoreUpdate ${storeName}`);
    return state;
  }
});

const providers = [{ provide: 'persistStorage', useValue: storage }];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
