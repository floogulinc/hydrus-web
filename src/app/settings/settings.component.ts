import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HydrusApiService, HydrusKeyVerificationData } from '../hydrus-api.service';
import { defaultAppSettings } from '../settings';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private settingsService: SettingsService, private snackbar: MatSnackBar, private api: HydrusApiService) { }

  testData: HydrusKeyVerificationData;

  ngOnInit() {
  }

  apiUrlStored() {
    this.snackbar.open('API URL saved', undefined, {
      duration: 2000
    });
  }

  apiKeyStored() {
    this.snackbar.open('API key saved', undefined, {
      duration: 2000
    });
  }

  testApi() {
    this.api.testApi().subscribe((data) => {
      this.snackbar.open(data.human_description, undefined, {
        duration: 5000
      });
    }, (error) => {
      console.log(error);
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 5000
      });
    });
  }

  appSettingsForm = new FormGroup({
    browseSearchOnLoad: new FormControl(this.settingsService.appSettings.browseSearchOnLoad, {nonNullable: true}),
    browseDefaultSearchTags: new FormControl(this.settingsService.appSettings.browseDefaultSearchTags, {nonNullable: true}),
  });

  async submitAppSettings() {
    const result = await this.settingsService.setAppSettings(this.appSettingsForm.value);
    if(result) {
      this.snackbar.open('Settings saved', undefined, {
        duration: 2000
      });
    } else {
      this.snackbar.open('Error saving settings', undefined, {
        duration: 2000
      });
    }
  }

  resetAppSettings() {
    this.appSettingsForm.reset();
  }

  resetAppSettingsDefault() {
    this.appSettingsForm.patchValue(defaultAppSettings);
  }

  console = console;

}
