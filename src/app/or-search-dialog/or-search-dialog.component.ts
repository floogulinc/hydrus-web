import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HydrusSearchTags } from '../hydrus-tags';

@Component({
  selector: 'app-or-search-dialog',
  templateUrl: './or-search-dialog.component.html',
  styleUrls: ['./or-search-dialog.component.scss']
})
export class OrSearchDialogComponent implements OnInit {

  tags: HydrusSearchTags = [];

  constructor(public dialogRef: MatDialogRef<OrSearchDialogComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
