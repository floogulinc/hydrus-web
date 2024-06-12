import { Injectable } from '@angular/core';
import { HydrusVersionService } from './hydrus-version.service';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, shareReplay, switchMap } from 'rxjs';
import { HydrusApiService } from './hydrus-api.service';
import { HydrusClientOptions } from './hydrus-client-options';

@Injectable({
  providedIn: 'root'
})
export class HydrusClientOptionsService {

  constructor(
    private apiService: HydrusApiService,
    private hydrusVersionService: HydrusVersionService,
  ) { }


  // public clientOptions$: Observable<HydrusClientOptions | null> = combineLatest(
  //   [
  //     this.hydrusVersionService.isAtLeastVersion(555),
  //     this.apiService.apiValidConfigChange$,
  //   ]
  // ).pipe(
  //   switchMap(([isVersion]) => isVersion
  //     ? this.apiService.getClientOptions().pipe(
  //       catchError(error => of(null))
  //     )
  //     : of(null)
  //   ),
  //   shareReplay(1),
  // )

  // public clientOptions$: Observable<HydrusClientOptions | null> = this.apiService.apiValidConfigChange$.pipe(
  //   switchMap(() => this.apiService.getClientOptions().pipe(
  //     catchError(error => of(null))
  //   )),
  //   shareReplay(1),
  // )

  public clientOptions$: Observable<HydrusClientOptions | null> = this.apiService.apiValidConfigChange$.pipe(
    switchMap(() => this.apiService.getClientOptions().pipe(
      catchError(error => of(null))
    )),
    shareReplay(1),
  )
}
