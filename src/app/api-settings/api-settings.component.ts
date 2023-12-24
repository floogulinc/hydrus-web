import { Component, OnInit } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { HydrusApiService } from '../hydrus-api.service';
import { HydrusKeyVerificationData } from '../hydrus-api';
import { SettingsService } from '../settings.service';
import { HydrusVersionService } from '../hydrus-version.service';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-api-settings',
  templateUrl: './api-settings.component.html',
  styleUrls: ['./api-settings.component.scss']
})
export class ApiSettingsComponent implements OnInit {

  constructor(
    private api: HydrusApiService,
    private snackbar: MatSnackBar,
    private hydrusVersionService: HydrusVersionService,
    private errorService: ErrorService
  ) { }

  testData: HydrusKeyVerificationData;

  ngOnInit(): void {
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
      console.log(data);
      this.hydrusVersionService.checkHydrusVersion();
      this.snackbar.open(data.human_description, undefined, {
        duration: 5000
      });
    }, (error) => {
      this.errorService.handleHydrusError(error)
    });
  }

}
