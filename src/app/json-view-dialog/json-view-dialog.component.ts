import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';

interface JsonViewDialogData {
  json: any;
  title: string;
  copyButton?: boolean;
}

@Component({
  selector: 'app-json-view-dialog',
  templateUrl: './json-view-dialog.component.html',
  styleUrls: ['./json-view-dialog.component.scss']
})
export class JsonViewDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JsonViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JsonViewDialogData
  ) { }

  ngOnInit(): void {
  }

  getJSON(): string {
    return JSON.stringify(this.data.json, null, 2)
  }


  static open(dialog: MatDialog, data?: JsonViewDialogData, config?: MatDialogConfig<JsonViewDialogData>) {
    return dialog.open<JsonViewDialogComponent, JsonViewDialogData>(
      JsonViewDialogComponent,
      {
        maxWidth: '1280px',
        width: '95vw',
        data: {...data},
        ...config
      }
    );
  }
}
