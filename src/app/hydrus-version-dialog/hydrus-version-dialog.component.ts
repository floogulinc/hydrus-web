import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { getPastHydrusWebVersion, HydrusVersionResponse, requiredVersion } from '../hydrus-version';

@Component({
  selector: 'app-hydrus-version-dialog',
  templateUrl: './hydrus-version-dialog.component.html',
  styleUrls: ['./hydrus-version-dialog.component.scss']
})
export class HydrusVersionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<HydrusVersionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HydrusVersionResponse) { }

  ngOnInit(): void {
  }

  requiredVersion = requiredVersion;

  pastVersion = getPastHydrusWebVersion(this.data);

  env = environment;

}
