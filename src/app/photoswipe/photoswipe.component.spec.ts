import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoswipeComponent } from './photoswipe.component';

describe('PhotoswipeComponent', () => {
  let component: PhotoswipeComponent;
  let fixture: ComponentFixture<PhotoswipeComponent>;

  beforeEach(async(() => {
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
