import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingLikeComponent } from './rating-like.component';

describe('RatingLikeComponent', () => {
  let component: RatingLikeComponent;
  let fixture: ComponentFixture<RatingLikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingLikeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
