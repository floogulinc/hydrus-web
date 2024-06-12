import { Injectable, Signal, WritableSignal, computed, effect, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { MigrationService } from './migration.service';
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';


interface StorageState {
  hydrusApiUrl: string;
  hydrusApiKey: string;
};

@Injectable({
  providedIn: 'root'
})
export class HydrusApiSettingsService {

  private readonly _hydrusApiUrl: WritableSignal<string>;
  private readonly _hydrusApiKey: WritableSignal<string>;

  readonly hydrusApiUrl: Signal<string>;
  readonly hydrusApiKey: Signal<string>;

  constructor(
    private migrationService: MigrationService,
    private ls: LocalStorageService
  ) {

    const apiUrl = ls.get('hydrusApiUrl') as string | null;
    const apiKey = ls.get('hydrusApiKey') as string | null;

    this._hydrusApiUrl = signal(apiUrl);
    this._hydrusApiKey = signal(apiKey);

    this.hydrusApiUrl = this._hydrusApiUrl.asReadonly();
    this.hydrusApiKey = this._hydrusApiKey.asReadonly();

    this.apiSet$.subscribe((x) => {console.log(x)})
    effect(() => console.log(this.hydrusApiUrl()))
    effect(() => console.log(this.hydrusApiKey()))
    effect(() => console.log(`${this.hydrusApiUrl()}${this.hydrusApiKey()}`))
  }



  // @ngxLocalStorage({ prefix: environment.localStoragePrefix })
  // hydrusApiUrl: string;

  // @ngxLocalStorage({ prefix: environment.localStoragePrefix })
  // hydrusApiKey: string;

  // apiUrlSet = this.storage.has('hydrusApiUrl');
  // apiKeySet = this.storage.has('hydrusApiKey');

  apiConfig = computed(() => ({hydrusApiUrl: this.hydrusApiUrl(), hydrusApiKey: this.hydrusApiKey()}))

  apiSet = computed(() => !!this.hydrusApiUrl() && !!this.hydrusApiKey());

  // public get apiSet() {
  //   return !!this.hydrusApiUrl && !!this.hydrusApiKey;
  // }

  private refreshApiConfig$ = new BehaviorSubject<void>(undefined);

  public refreshApiConfig() {
    this.refreshApiConfig$.next();
  }

  apiSet$ = toObservable(this.apiSet);
  apiConfig$ = toObservable(this.apiConfig);

  apiValidConfigChange$: Observable<void> = combineLatest([this.apiSet$, this.apiConfig$, this.refreshApiConfig$]).pipe(
    filter(([apiSet]) => apiSet),
    map(() => null)
  )

  setApiConfig(config: {hydrusApiUrl: string, hydrusApiKey: string}) {
    this.ls.set('hydrusApiUrl', config.hydrusApiUrl);
    this.ls.set('hydrusApiKey', config.hydrusApiKey);

    this._hydrusApiUrl.set(config.hydrusApiUrl)
    this._hydrusApiKey.set(config.hydrusApiKey)
  }
}
