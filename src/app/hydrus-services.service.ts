import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';
import { retry, shareReplay } from 'rxjs';

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

}
