import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortInputComponent } from './sort-input.component';

describe('SortInputComponent', () => {
  let component: SortInputComponent;
  let fixture: ComponentFixture<SortInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
