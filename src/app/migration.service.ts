import { Injectable } from '@angular/core';
import { LocalStorageService, StorageSerializer } from 'ngx-localstorage';

class StringSerializer implements StorageSerializer<string> {
  serialize(value: string): string {
    return value;
  }
  deserialize(storedValue: string): string {
    return storedValue;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MigrationService {

  constructor(private storage: LocalStorageService) {

  }

   async migrateLocalStorage() {
    const version = await this.storage.asPromisable().get('migrationVersion');
    console.log(`Local storage migration version ${version}`);
    switch(version) {
      case 1: {
        return;
      }
      case null: {
        console.log('Migrating local storage to version 1');
        if (await this.storage.asPromisable().get('hydrusApiKey', new StringSerializer())) {
          await this.storage.asPromisable().set(
            'hydrusApiKey',
            await this.storage.asPromisable().get('hydrusApiKey', new StringSerializer())
          );
        }
        if (await this.storage.asPromisable().get('hydrusApiUrl', new StringSerializer())) {
          await this.storage.asPromisable().set(
            'hydrusApiUrl',
            await this.storage.asPromisable().get('hydrusApiUrl', new StringSerializer())
          );
        }
        await this.storage.asPromisable().set(
          'migrationVersion', 1
        );
        await this.migrateLocalStorage();
        break;
      }
      default: {
        return;
      }
    }
   }
}
