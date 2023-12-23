import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPredicateRatingsDialogComponent } from './system-predicate-ratings-dialog.component';

describe('SystemPredicateRatingsDialogComponent', () => {
  let component: SystemPredicateRatingsDialogComponent;
  let fixture: ComponentFixture<SystemPredicateRatingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemPredicateRatingsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemPredicateRatingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
