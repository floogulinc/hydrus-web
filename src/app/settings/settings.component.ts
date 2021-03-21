import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { hydrusApiKeyPattern, HydrusApiService, HydrusKeyVerificationData } from '../hydrus-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private api: HydrusApiService) { }

  testData: HydrusKeyVerificationData;

  apiForm = new FormGroup({
    url: new FormControl(null, [
      Validators.required,
    ]),
    key: new FormControl(null, [
      Validators.required,
      Validators.pattern(hydrusApiKeyPattern)
    ])
  });

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

}
