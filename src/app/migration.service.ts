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
    this.migrateLocalStorage();
  }

   migrateLocalStorage() {
    const version = this.storage.get('migrationVersion');
    console.log(`Local storage migration version ${version}`);
    switch(version) {
      case 1: {
        return;
      }
      case null: {
        console.log('Migrating local storage to version 1');
        if (this.storage.get('hydrusApiKey', new StringSerializer())) {
          this.storage.set(
            'hydrusApiKey',
            this.storage.get('hydrusApiKey', new StringSerializer())
          );
        }
        if (this.storage.get('hydrusApiUrl', new StringSerializer())) {
          this.storage.set(
            'hydrusApiUrl',
            this.storage.get('hydrusApiUrl', new StringSerializer())
          );
        }
        this.storage.set(
          'migrationVersion', 1
        );
        this.migrateLocalStorage();
        break;
      }
      default: {
        return;
      }
    }
   }
}
