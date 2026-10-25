import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, distinctUntilChanged, map, of, retry, shareReplay, switchMap } from 'rxjs';
import { HydrusApiService } from './hydrus-api.service';
import { requiredVersion, secureVersion } from './hydrus-version';
import { HydrusVersionDialogComponent } from './hydrus-version-dialog/hydrus-version-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class HydrusVersionService {

  constructor(private api: HydrusApiService, private dialog: MatDialog) {
    this.hydrusVersion$.subscribe(v => {
      console.log(v);
      if(v && v.is_idhan_instance) {
        return;
      } else if(v && ((v.hydrus_version && v.hydrus_version < requiredVersion) || (!v.hydrus_version && v.version))) {
        this.dialog.open(HydrusVersionDialogComponent, {
          data: {
            ...v,
            reason: 'outdated'
          }
        });
      } else if (v && v.hydrus_version && v.hydrus_version < secureVersion) {
        this.dialog.open(HydrusVersionDialogComponent, {
          data: {
            ...v,
            reason: 'insecure'
          }
        });
      }
    })
  }

  public hydrusVersion$ = this.api.apiValidConfigChange$.pipe(
    switchMap(() => this.api.getApiVersion().pipe(
      retry(1),
      catchError((err) => of(null))
    )),
    distinctUntilChanged((a,b) => a?.version === b?.version),
    shareReplay(1),
  )

  public isAtLeastVersion(version: number) {
    return this.hydrusVersion$.pipe(
      map(v => v && v.hydrus_version >= version),
      distinctUntilChanged()
    )
  }
}
