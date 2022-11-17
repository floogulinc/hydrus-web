import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { HydrusApiService, HydrusKeyVerificationData } from '../hydrus-api.service';
import { defaultAppSettings, AppSettings } from '../settings';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private settings: SettingsService,
    private snackbar: MatSnackBar,
    private api: HydrusApiService,
  ) { }

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

  /* appSettingsForm = new FormGroup({
    browseSearchOnLoad: new FormControl(this.settings.appSettings.browseSearchOnLoad, {nonNullable: true}),
    browseSearchWhenEmpty: new FormControl(this.settings.appSettings.browseSearchWhenEmpty, {nonNullable: true}),
    browseDefaultSearchTags: new FormControl(this.settings.appSettings.browseDefaultSearchTags, {nonNullable: true}),
  }); */

  appSettingsForm = new FormGroup(
    Object.keys(this.settings.appSettings)
      .map(k => ({ [k]: new FormControl(this.settings.appSettings[k], {nonNullable: true}) }))
      .reduce((p, c) => ({...p, ...c}))
  );

  async submitAppSettings() {
    try {
      await this.settings.setAppSettings(this.appSettingsForm.value);
      this.resetAppSettings();
      this.snackbar.open('Settings saved', undefined, {
        duration: 2000
      });
    } catch (error) {
      this.snackbar.open(`Error saving settings: ${{error}}`, undefined, {
        duration: 2000
      });
    }
  }

  resetAppSettings() {
    this.appSettingsForm.patchValue(this.settings.appSettings);
    this.appSettingsForm.markAsPristine();
  }

  resetAppSettingsDefault() {
    this.appSettingsForm.patchValue(defaultAppSettings);
  }



}
