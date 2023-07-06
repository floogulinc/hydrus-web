import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';

@Injectable({
  providedIn: 'root'
})
export class HydrusRatingsService {

  constructor(private api: HydrusApiService) {}

  public setRating(hash: string, rating_service_key: string, rating: number | boolean | null) {
    return this.api.setRating({hash, rating_service_key, rating});
  }
}
