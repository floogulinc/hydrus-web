import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaucenaoDialogComponent } from './saucenao-dialog.component';

describe('SaucenaoDialogComponent', () => {
  let component: SaucenaoDialogComponent;
  let fixture: ComponentFixture<SaucenaoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaucenaoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaucenaoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
