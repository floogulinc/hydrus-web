import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ngxLocalStorage } from 'ngx-localstorage';
import { BehaviorSubject, catchError, map, NEVER, of, retry, shareReplay, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HydrusApiService } from './hydrus-api.service';
import { requiredVersion } from './hydrus-version';
import { HydrusVersionDialogComponent } from './hydrus-version-dialog/hydrus-version-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class HydrusVersionService {

  @ngxLocalStorage({ prefix: environment.localStoragePrefix })
  hydrusApiUrl: string;

  @ngxLocalStorage({ prefix: environment.localStoragePrefix })
  hydrusApiKey: string;

  constructor(private api: HydrusApiService, private dialog: MatDialog) {
    this.hydrusVersion$.subscribe(v => {
      console.log(v);
      if(v && ((v.hydrus_version && v.hydrus_version < requiredVersion) || (!v.hydrus_version && v.version))) {
        const dialogRef = this.dialog.open(HydrusVersionDialogComponent, {
          data: v
        });
      }
    })
  }

  private refreshVersion$ = new BehaviorSubject<void>(undefined);

  public checkHydrusVersion() {
    this.refreshVersion$.next();
  }

  public hydrusVersion$ = this.refreshVersion$.pipe(
    switchMap(() => {
      if(this.hydrusApiUrl && this.hydrusApiKey) {
        return this.api.getApiVersion().pipe(
          retry(1),
          catchError((err) => of(null))
        )
      } else {
        return of(null);
      }
    }),
    shareReplay(1),
  );
}
