import { Component, Inject, OnInit } from '@angular/core';
import { HydrusService } from '../hydrus-services';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { HydrusServicesService } from '../hydrus-services.service';
import { Observable, config, filter, map, of, shareReplay, take, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

interface ServiceSelectDialogData {
  title: string;
  services?: HydrusService[];
  serviceFilter: (services: HydrusService[]) => HydrusService[];
}

const defaultData: ServiceSelectDialogData = {
  title: 'Select service',
  serviceFilter: (services: HydrusService[]) => services,
}

@UntilDestroy()
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
    if(this.data.services) {
      this.services$ = of(this.data.services);
    } else {
      this.services$ = this.servicesService.hydrusServicesArray$.pipe(
        map(s => this.data.serviceFilter(s)),
        shareReplay(1),
      )
    }
    this.services$.pipe(
      untilDestroyed(this),
      filter(services => services && services.length > 0),
      take(1),
    ).subscribe(services => this.serviceForm.get('service').setValue(services[0]))
  }

  ngOnInit(): void {
  }

  services$: Observable<HydrusService[]>

  serviceForm = new FormGroup({
    service: new FormControl<HydrusService>(null, Validators.required)
  })

  submitForm() {
    this.dialogRef.close(this.serviceForm.value.service)
  }

  serviceCompare(a: HydrusService, b: HydrusService) {
    return a?.service_key === b?.service_key;
  }

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
