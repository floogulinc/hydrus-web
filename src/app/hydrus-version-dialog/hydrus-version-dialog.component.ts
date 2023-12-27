import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
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
