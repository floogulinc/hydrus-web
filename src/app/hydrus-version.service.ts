import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, filter, map, of, retry, shareReplay, switchMap } from 'rxjs';
import { HydrusApiSettingsService } from './hydrus-api-settings.service';
import { HydrusApiService } from './hydrus-api.service';
import { requiredVersion } from './hydrus-version';
import { HydrusVersionDialogComponent } from './hydrus-version-dialog/hydrus-version-dialog.component';
import { debug } from 'ngxtension/debug';


@Injectable({
  providedIn: 'root'
})
export class HydrusVersionService {

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

  public hydrusVersion$ = this.api.apiValidConfigChange$.pipe(
    switchMap(() => this.api.getApiVersion().pipe(
      retry(1),
      catchError((err) => of(null))
    )),
    distinctUntilChanged((a,b) => a?.version === b?.version),
    shareReplay(1),
  )

  // public hydrusVersion$ = this.refreshVersion$.pipe(
  //   switchMap(() => {
  //     if(this.apiSettings.apiSet()) {
  //       return this.api.getApiVersion().pipe(
  //         retry(1),
  //         catchError((err) => of(null))
  //       )
  //     } else {
  //       return of(null);
  //     }
  //   }),
  //   distinctUntilChanged((a,b) => a.version === b.version),
  //   shareReplay(1),
  // );

  public isAtLeastVersion(version: number) {
    return this.hydrusVersion$.pipe(
      map(v => v && v.hydrus_version >= version),
      distinctUntilChanged()
    )
  }
}
