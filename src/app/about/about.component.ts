import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { HydrusFilesService } from '../hydrus-files.service';
import { Platform } from '@angular/cdk/platform';
import { MatDialog } from '@angular/material/dialog';
import { MrBonesDialogComponent } from '../mr-bones-dialog/mr-bones-dialog.component';
import { HydrusVersionService } from '../hydrus-version.service';
import { ServicesInfoDialogComponent } from '../services-info-dialog/services-info-dialog.component';

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
    private dialog: MatDialog,
    public hydrusVersion: HydrusVersionService) { }

  public doc = document;

  public env = environment;

  public repoURL = 'https://github.com/floogulinc/hydrus-web';

  public navigator = navigator;
  public window = window;

  public storageQuota: StorageEstimate;
  public storagePersisted: boolean;

  ngOnInit() {
    if (navigator.storage) {
      navigator.storage.estimate().then(quota => this.storageQuota = quota);
      navigator.storage.persisted().then(persisted => this.storagePersisted = persisted);
    }
  }

  boned() {
    this.dialog.open(MrBonesDialogComponent, {
      maxWidth: '95vw'
    });
  }

  services() {
    this.dialog.open(ServicesInfoDialogComponent, {
      maxWidth: '95w'
    });
  }

}
