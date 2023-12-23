import { Component, OnInit } from '@angular/core';
import { HydrusServicesService } from '../hydrus-services.service';
import { isNumericalRatingService, isLikeRatingService, isIncDecRatingService } from '../hydrus-rating';

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

  ngOnInit(): void {
  }

}
