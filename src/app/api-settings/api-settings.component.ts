import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HydrusApiService } from '../hydrus-api.service';
import { HydrusKeyVerificationData } from '../hydrus-api';
import { ErrorService } from '../error.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HydrusApiSettingsService } from '../hydrus-api-settings.service';

@Component({
  selector: 'app-api-settings',
  templateUrl: './api-settings.component.html',
  styleUrls: ['./api-settings.component.scss']
})
export class ApiSettingsComponent implements OnInit {

  constructor(
    private api: HydrusApiService,
    private snackbar: MatSnackBar,
    private errorService: ErrorService,
    public apiSettingsService: HydrusApiSettingsService
  ) { }

  testData: HydrusKeyVerificationData;

  apiSettingsForm = new FormGroup({
    hydrusApiUrl: new FormControl(this.apiSettingsService.hydrusApiUrl()),
    hydrusApiKey: new FormControl(this.apiSettingsService.hydrusApiKey(),)
  });

  ngOnInit(): void {
  }


  submitApiSettings() {
    try {
      this.apiSettingsService.setApiConfig(this.apiSettingsForm.getRawValue());
      this.snackbar.open('Settings saved', undefined, {
        duration: 2000
      });
    } catch (error) {
      this.errorService.handleError(error, 'Error saving settings');
    }
  }


  testApi() {
    this.api.testApi().subscribe((data) => {
      this.snackbar.open(data.human_description, undefined, {
        duration: 5000
      });
    }, (error) => {
      this.errorService.handleHydrusError(error)
    });
  }

}
