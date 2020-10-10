import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarActionsComponent } from './toolbar-actions.component';

describe('ToolbarActionsComponent', () => {
  let component: ToolbarActionsComponent;
  let fixture: ComponentFixture<ToolbarActionsComponent>;

  beforeEach(async(() => {
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
