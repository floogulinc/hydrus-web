import { Component, Inject, OnInit } from '@angular/core';
import { HydrusService } from '../hydrus-services';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HydrusServicesService } from '../hydrus-services.service';
import { map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface ServiceSelectDialogData {
  title: string;
  serviceFilter: (services: HydrusService[]) => HydrusService[];
}

const defaultData: ServiceSelectDialogData = {
  title: 'Select service',
  serviceFilter: (services: HydrusService[]) => services,
}


@Component({
  selector: 'app-service-select-dialog',
  templateUrl: './service-select-dialog.component.html',
  styleUrls: ['./service-select-dialog.component.scss']
})
export class ServiceSelectDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ServiceSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceSelectDialogData,
    private servicesService: HydrusServicesService
  ) {
    if(!data) {
      this.data = defaultData;
    }
  }

  ngOnInit(): void {
  }

  services$ = this.servicesService.hydrusServicesArray$.pipe(
    map(s => this.data.serviceFilter(s))
  )

  currentService: HydrusService = null;

  static open(dialog: MatDialog, data?: Partial<ServiceSelectDialogData>, config?: MatDialogConfig<ServiceSelectDialogData>) {
    return dialog.open<ServiceSelectDialogComponent, ServiceSelectDialogData, HydrusService>(
      ServiceSelectDialogComponent,
      {
        maxWidth: '648px',
        width: '90vw',
        data: {
          ...defaultData,
          ...data
        },
        ...config
      }
    );
  }

}
