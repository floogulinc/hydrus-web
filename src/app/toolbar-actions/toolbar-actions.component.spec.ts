import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarActionsComponent } from './toolbar-actions.component';

describe('ToolbarActionsComponent', () => {
  let component: ToolbarActionsComponent;
  let fixture: ComponentFixture<ToolbarActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
