import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrBonesDialogComponent } from './mr-bones-dialog.component';

describe('MrBonesDialogComponent', () => {
  let component: MrBonesDialogComponent;
  let fixture: ComponentFixture<MrBonesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrBonesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrBonesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
