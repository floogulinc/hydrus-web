import { Component, OnInit } from '@angular/core';
import { HydrusApiSettingsService } from '../hydrus-api-settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    public apiSettings: HydrusApiSettingsService
  ) { }


  ngOnInit() {
  }

  initialSelect = this.apiSettings.apiSet() ? 1 : 0;


}
