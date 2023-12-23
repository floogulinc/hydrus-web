import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HydrusIncDecRating, HydrusIncDecRatingValue } from '../hydrus-rating';

@Component({
  selector: 'app-rating-inc-dec',
  templateUrl: './rating-inc-dec.component.html',
  styleUrls: ['./rating-inc-dec.component.scss']
})
export class RatingIncDecComponent {

  @Input() rating: HydrusIncDecRating

  @Output() ratingSet = new EventEmitter<HydrusIncDecRatingValue>()

  constructor() { }

  setRating(value: HydrusIncDecRatingValue) {
    this.ratingSet.emit(value);
  }

}
