import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';

@Injectable({
  providedIn: 'root'
})
export class HydrusAddService {

  constructor(private api: HydrusApiService) { }


}
