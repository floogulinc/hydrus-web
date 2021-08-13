import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, Subscription } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { HydrusApiSettingsQuery, HydrusApiSettingsStore } from '../hydrus-api-settings';
import { HydrusApiService, HydrusKeyVerificationData } from '../hydrus-api.service';

@UntilDestroy()
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private snackbar: MatSnackBar,
    private api: HydrusApiService,
    public hydrusApiSettingsStore: HydrusApiSettingsStore,
    public hydrusApiSettingsQuery: HydrusApiSettingsQuery
  ) { }

  //testData: HydrusKeyVerificationData;

  apiSettingsForm = new FormGroup({
    hydrusApiKey: new FormControl(
      '',
      [
        Validators.required
      ]),
    hydrusApiUrl: new FormControl(
      '',
      [
        Validators.required
      ]
      ),
  });


/*   apiSaved$ = combineLatest([
    this.apiSettingsForm.valueChanges.pipe(startWith(this.apiSettingsForm.value)),
    this.hydrusApiSettingsQuery.select()
  ]).pipe(
    tap(val => console.log(val)),
    map(([formSettings, storeSettings]) =>
      storeSettings.hydrusApiUrl === formSettings.hydrusApiUrl &&
      storeSettings.hydrusApiKey === formSettings.hydrusApiKey
    ),
    tap(val => console.log(`apiSaved ${val}`)),
  ); */

  ngOnInit() {
    this.hydrusApiSettingsQuery.apiInfo$.pipe(untilDestroyed(this)).subscribe(apiSettings => {
      this.apiSettingsForm.setValue(apiSettings);
      this.apiSettingsForm.markAsPristine();
    });
  }

  saveApiSettings() {
    this.hydrusApiSettingsStore.update(this.apiSettingsForm.value);
    console.log('API settings saved');
    this.snackbar.open('API settings saved', undefined, {
      duration: 2000
    });
  }

  testApi() {
    this.api.testApiWithInfo(this.apiSettingsForm.value).subscribe((data) => {
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
