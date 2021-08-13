import { Injectable } from '@angular/core';
import { Query, Store, StoreConfig } from '@datorama/akita';
import { filter } from 'rxjs/operators';

export interface HydrusApiSettingsState {
  hydrusApiUrl: string;
  hydrusApiKey: string;
}

export function createInitialState(): HydrusApiSettingsState {
  return {
    hydrusApiKey: null,
    hydrusApiUrl: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'hydrus-api-settings' })
export class HydrusApiSettingsStore extends Store<HydrusApiSettingsState> {

  constructor() {
    super(createInitialState());
  }

}

@Injectable({ providedIn: 'root' })
export class HydrusApiSettingsQuery extends Query<HydrusApiSettingsState> {

  constructor(protected store: HydrusApiSettingsStore) {
    super(store);
  }

  apiInfo$ = this.select().pipe(filter(({hydrusApiUrl, hydrusApiKey}) => !!hydrusApiUrl && !!hydrusApiKey));

  apiInfoExists$ = this.select(state =>
    state.hydrusApiKey &&
    state.hydrusApiUrl &&
    state.hydrusApiUrl.length > 0 &&
    state.hydrusApiKey.length > 0);

}
