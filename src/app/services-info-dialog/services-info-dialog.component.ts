import { Component, OnInit } from '@angular/core';
import { HydrusServicesService } from '../hydrus-services.service';

@Component({
  selector: 'app-services-info-dialog',
  templateUrl: './services-info-dialog.component.html',
  styleUrls: ['./services-info-dialog.component.scss']
})
export class ServicesInfoDialogComponent implements OnInit {

  constructor(
    public services: HydrusServicesService
  ) { }

  ngOnInit(): void {
  }

}
