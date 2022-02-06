import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageListLoaderComponent } from './image-list-loader.component';

describe('ImageListLoaderComponent', () => {
  let component: ImageListLoaderComponent;
  let fixture: ComponentFixture<ImageListLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageListLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
