import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSiblingsParentsDialogComponent } from './tag-siblings-parents-dialog.component';

describe('TagSiblingsParentsDialogComponent', () => {
  let component: TagSiblingsParentsDialogComponent;
  let fixture: ComponentFixture<TagSiblingsParentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagSiblingsParentsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagSiblingsParentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
