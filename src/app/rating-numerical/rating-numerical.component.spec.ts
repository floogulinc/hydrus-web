import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingNumericalComponent } from './rating-numerical.component';

describe('RatingNumericalComponent', () => {
  let component: RatingNumericalComponent;
  let fixture: ComponentFixture<RatingNumericalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingNumericalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingNumericalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
