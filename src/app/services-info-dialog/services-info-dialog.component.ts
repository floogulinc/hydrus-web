import { Component, OnInit } from '@angular/core';
import { HydrusServicesService } from '../hydrus-services.service';
import { isNumericalRatingService, isLikeRatingService, isIncDecRatingService } from '../hydrus-rating';
import { debug } from 'ngxtension/debug';

@Component({
  selector: 'app-services-info-dialog',
  templateUrl: './services-info-dialog.component.html',
  styleUrls: ['./services-info-dialog.component.scss']
})
export class ServicesInfoDialogComponent implements OnInit {

  isNumericalRatingService = isNumericalRatingService;
  isLikeRatingService = isLikeRatingService;
  isIncDecRatingService = isIncDecRatingService;

  constructor(
    public services: HydrusServicesService
  ) { }

  servicesArray$ = this.services.hydrusServicesArray$.pipe(
    debug('test')
  )

  ngOnInit(): void {
  }

}
