import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface UrlEditDialogData {
  url: string;
}

@Component({
  selector: 'app-url-edit-dialog',
  templateUrl: './url-edit-dialog.component.html',
  styleUrls: ['./url-edit-dialog.component.scss']
})
export class UrlEditDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UrlEditDialogComponent, UrlEditDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: UrlEditDialogData
  ) { }

  static open(dialog: MatDialog, data?: UrlEditDialogData, config?: MatDialogConfig<UrlEditDialogData>) {
    return dialog.open<UrlEditDialogComponent, UrlEditDialogData, UrlEditDialogData>(
      UrlEditDialogComponent,
      {
        width: '648px',
        data: {...data},
        //autoFocus: data && data.noteName ? '.note-content' : 'first-tabbable',
        ...config
      }
    );
  }

  urlForm = new FormGroup({
    url: new FormControl(this.data.url ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
      ]
    })
  });

  submitUrl() {
    this.dialogRef.close(this.urlForm.getRawValue());
  }

  ngOnInit(): void {
  }

}
