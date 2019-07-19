import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { StorageModule } from '@ngx-pwa/local-storage';


import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule } from '@angular/forms';

import {
  MdcButtonModule,
  MdcFabModule,
  MdcIconModule,
  MdcMenuModule,
  MdcTopAppBarModule,
  MdcTabBarModule,
  MdcListModule,
  MdcDrawerModule,
  MdcIconButtonModule,
  MdcTextFieldModule,
  MdcFormFieldModule,
  MdcTypographyModule,
  MdcImageListModule
} from '@angular-mdc/web';
import { BrowseComponent } from './browse/browse.component';
import { SettingsComponent } from './settings/settings.component';

const MDC_MODULES: any[] = [
  MdcButtonModule,
  MdcFabModule,
  MdcIconModule,
  MdcMenuModule,
  MdcTopAppBarModule,
  MdcTabBarModule,
  MdcListModule,
  MdcDrawerModule,
  MdcIconButtonModule,
  MdcTextFieldModule,
  MdcFormFieldModule ,
  MdcTypographyModule,
  MdcImageListModule
];

@NgModule({
  declarations: [
    AppComponent,
    BrowseComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    MDC_MODULES,
    StorageModule.forRoot({
      IDBNoWrap: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
