import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhotoswipeComponent } from './photoswipe.component';

describe('PhotoswipeComponent', () => {
  let component: PhotoswipeComponent;
  let fixture: ComponentFixture<PhotoswipeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoswipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoswipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
