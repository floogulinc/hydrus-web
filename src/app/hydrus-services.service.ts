import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';
import { map, retry, shareReplay } from 'rxjs';
import { getServiceArrayUniversal } from './hydrus-services';

@Injectable({
  providedIn: 'root'
})
export class HydrusServicesService {

  constructor(
    private api: HydrusApiService
  ) { }

  public hydrusServices$ = this.api.getServices().pipe(
    retry(1),
    shareReplay(1)
  );

  public hydrusServicesArray$ = this.hydrusServices$.pipe(
    map(s => getServiceArrayUniversal(s)),
  )

}
