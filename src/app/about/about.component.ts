import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { HydrusFilesService } from '../hydrus-files.service';
import { Platform } from '@angular/cdk/platform';
import { MatDialog } from '@angular/material/dialog';
import { MrBonesDialogComponent } from '../mr-bones-dialog/mr-bones-dialog.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(
    public updates: SwUpdate,
    public filesService: HydrusFilesService,
    public platform: Platform,
    private dialog: MatDialog) { }

  public doc = document;

  public env = environment;

  public repoURL = 'https://github.com/floogulinc/hydrus-web';

  public navigator = navigator;

  public storageQuota: StorageEstimate;
  public storagePersisted: boolean;

  ngOnInit() {
    if (navigator.storage) {
      navigator.storage.estimate().then(quota => this.storageQuota = quota);
      navigator.storage.persisted().then(persisted => this.storagePersisted = persisted);
    }
  }

  boned() {
    this.dialog.open(MrBonesDialogComponent);
  }

}
