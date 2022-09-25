import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPredicateDialogComponent } from './system-predicate-dialog.component';

describe('SystemPredicateDialogComponent', () => {
  let component: SystemPredicateDialogComponent;
  let fixture: ComponentFixture<SystemPredicateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemPredicateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemPredicateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
