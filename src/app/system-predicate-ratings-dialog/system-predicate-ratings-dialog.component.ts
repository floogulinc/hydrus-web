import { Component, Inject, OnInit } from '@angular/core';
import { HydrusServicesService } from '../hydrus-services.service';
import { map, shareReplay } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { isNumericalRatingService, isLikeRatingService, isIncDecRatingService, HydrusRatingValue, ratingsServiceToRatingPredicate, HydrusNumericalRatingValue, HydrusIncDecRatingValue, HydrusLikeRatingValue } from '../hydrus-rating';
import { HydrusService } from '../hydrus-services';
import { ratingOperators } from '../hydrus-system-predicates';

function generateRating(service: HydrusService) {
  if (isNumericalRatingService(service)) {
    return {
      ...service,
      value: 0 as HydrusNumericalRatingValue
    }
  } else if (isLikeRatingService(service)) {
    return {
      ...service,
      value: null as HydrusLikeRatingValue
    }
  } else if (isIncDecRatingService(service)) {
    return {
      ...service,
      value: 0 as HydrusIncDecRatingValue
    }
  }
}

@Component({
  selector: 'app-system-predicate-ratings-dialog',
  templateUrl: './system-predicate-ratings-dialog.component.html',
  styleUrls: ['./system-predicate-ratings-dialog.component.scss']
})
export class SystemPredicateRatingsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SystemPredicateRatingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {service: HydrusService},
    //private services: HydrusServicesService
  ) { }

  ngOnInit(): void {
  }

  rating = generateRating(this.data.service);
  predicate = ratingsServiceToRatingPredicate(this.data.service);
  operators = ratingOperators[this.predicate]

  isNumericalRatingService = isNumericalRatingService;
  isLikeRatingService = isLikeRatingService;
  isIncDecRatingService = isIncDecRatingService;

  setRating(value: HydrusRatingValue) {
    this.rating.value = value;
  }

  operatorForm = new FormControl('is', Validators.required)

  getValue() {
    if(isNumericalRatingService(this.rating)) {
      return `${this.rating.value}/${this.rating.max_stars}`
    } else if(isLikeRatingService(this.rating)) {
      return this.rating.value ? 'liked' : 'disliked'
    } else if(isIncDecRatingService(this.rating)) {
      return `${this.rating.value}`
    } else {
      return ''
    }
  }

  getPredicateString() {
    if(this.rating.value === null) {
      return `system:no rating for ${this.data.service.name}`
    }
    const value = this.getValue();
    return `system:rating for ${this.data.service.name} ${this.operatorForm.value} ${value}`
  }

  addButton() {
    this.dialogRef.close(this.getPredicateString())
  }

  // ratingsServices$ = this.services.hydrusServicesArray$.pipe(
  //   map(services => getRatingsServices(services))
  // )

  // serviceInput = new FormControl<HydrusService>(null);

  // selectedService$ = this.serviceInput.valueChanges.pipe(
  //   shareReplay(1),
  // )

}
