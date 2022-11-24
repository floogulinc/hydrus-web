import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HydrusSearchTags, TagDisplayType } from '../hydrus-tags';

interface TagInputDialogData {
  displayType: TagDisplayType;
  enableOrSearch: boolean;
  enableSystemPredicates: boolean;
  enableFavorites: boolean;
  title: string;
  submitButtonText: string;
}

const defaultData: TagInputDialogData = {
  displayType: 'display',
  enableOrSearch: true,
  enableSystemPredicates: true,
  enableFavorites: true,
  title: 'Tags',
  submitButtonText: 'OK'
}

@Component({
  selector: 'app-tag-input-dialog',
  templateUrl: './tag-input-dialog.component.html',
  styleUrls: ['./tag-input-dialog.component.scss']
})
export class TagInputDialogComponent implements OnInit {

  tags: HydrusSearchTags = [];

  constructor(
    public dialogRef: MatDialogRef<TagInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TagInputDialogData
  ) {
    if(!data) {
      this.data = defaultData;
    }
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  static open(dialog: MatDialog, data?: Partial<TagInputDialogData>, config?: MatDialogConfig<TagInputDialogData>) {
    return dialog.open<TagInputDialogComponent, TagInputDialogData, HydrusSearchTags>(
      TagInputDialogComponent,
      {
        width: '80vw',
        data: {
          ...defaultData,
          ...data
        },
        ...config
      }
    );
  }

}
