import { Injectable } from '@angular/core';
import { LocalStorageService, ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';
import { MigrationService } from './migration.service';

@Injectable({
  providedIn: 'root'
})
export class HydrusApiSettingsService {

  constructor(
    private migrationService: MigrationService,
    private ls: LocalStorageService
  ) {
    this.setup();
  }

  async setup() {
    await this.migrationService.migrateLocalStorage();
  }

  @ngxLocalStorage({ prefix: environment.localStoragePrefix })
  hydrusApiUrl: string;

  @ngxLocalStorage({ prefix: environment.localStoragePrefix })
  hydrusApiKey: string;

  public get apiSet() {
    return !!this.hydrusApiUrl && !!this.hydrusApiKey;
  }

}
