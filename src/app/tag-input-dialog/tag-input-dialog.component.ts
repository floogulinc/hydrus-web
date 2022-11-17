import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { HydrusSearchTags, TagDisplayType } from '../hydrus-tags';

interface TagInputDialogData {
  displayType: TagDisplayType;
  enableOrSearch: boolean;
  title: string;
  submitButtonText: string;
}

const defaultData: TagInputDialogData = {
  displayType: 'display',
  enableOrSearch: true,
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
    @Inject(MAT_DIALOG_DATA) public data: {displayType: TagDisplayType, enableOrSearch: boolean, title: string, submitButtonText: string}
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
