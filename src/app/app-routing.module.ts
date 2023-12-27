import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { BrowseComponent } from './browse/browse.component';
import { AboutComponent } from './about/about.component';
import { PagesComponent } from './pages/pages.component';
import { SendComponent } from './send/send.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HydrusApiSettingsGuard } from './hydrus-api-settings.guard';
import { UploadFileComponent } from './upload-file/upload-file.component';

const routes: Routes = [
  {path: '', component: BrowseComponent, pathMatch: 'full', canActivate: [HydrusApiSettingsGuard]},
  {path: 'pages', component: PagesComponent, canActivate: [HydrusApiSettingsGuard]},
  {path: 'send', component: SendComponent, canActivate: [HydrusApiSettingsGuard]},
  {path: 'upload', component: UploadFileComponent, canActivate: [HydrusApiSettingsGuard]},
  {path: 'settings', component: SettingsComponent},
  {path: 'about', component: AboutComponent},
  {path: 'welcome', component: WelcomeComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
