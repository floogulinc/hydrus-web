import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';
import { firstValueFrom, map } from 'rxjs';
import { isRatingService } from './hydrus-rating';
import { ServiceSelectDialogComponent } from './service-select-dialog/service-select-dialog.component';
import { HydrusServicesService } from './hydrus-services.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class HydrusRatingsService {

  constructor(
    private api: HydrusApiService,
    private servicesServcice: HydrusServicesService,
    public dialog: MatDialog,
  ) {}

  public setRating(hash: string, rating_service_key: string, rating: number | boolean | null) {
    return this.api.setRating({hash, rating_service_key, rating});
  }

  public ratingServices$ = this.servicesServcice.hydrusServicesArray$.pipe(
    map(services => services.filter(isRatingService))
  )

  async getRatingServiceDialog() {
    const services = await firstValueFrom(this.ratingServices$);
    if(services.length === 0) {
      return null;
    } else if(services.length === 1) {
      return services[0]
    } else {
      const serviceDialog = ServiceSelectDialogComponent.open(this.dialog, {
        title: 'Select rating service',
        services
      })
      return firstValueFrom(serviceDialog.afterClosed());
    }
  }
}
