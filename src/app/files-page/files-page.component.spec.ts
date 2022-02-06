import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilesPageComponent } from './files-page.component';

describe('FilesPageComponent', () => {
  let component: FilesPageComponent;
  let fixture: ComponentFixture<FilesPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
