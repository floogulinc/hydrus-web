import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { HydrusApiSettingsService } from '../hydrus-api-settings.service';
import { getLocalTagServices } from '../hydrus-services';
import { HydrusServicesService } from '../hydrus-services.service';
import { defaultAppSettings } from '../settings';
import { SettingsService } from '../settings.service';
import { ErrorService } from '../error.service';
import { settingsThemeVariants } from '../theme/theme';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnInit {

  constructor(
    private settings: SettingsService,
    private snackbar: MatSnackBar,
    private hydrusServices: HydrusServicesService,
    public apiSettings: HydrusApiSettingsService,
    private errorService: ErrorService,
  ) { }

  settingsThemeVariants = settingsThemeVariants;

  ngOnInit(): void {
  }

  tagServices$ = this.hydrusServices.hydrusServicesArray$.pipe(
    map(s => getLocalTagServices(s))
  )

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
      this.errorService.handleError(error, 'Error saving settings');
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
