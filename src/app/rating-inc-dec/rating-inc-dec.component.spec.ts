import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingIncDecComponent } from './rating-inc-dec.component';

describe('RatingIncDecComponent', () => {
  let component: RatingIncDecComponent;
  let fixture: ComponentFixture<RatingIncDecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingIncDecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingIncDecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
