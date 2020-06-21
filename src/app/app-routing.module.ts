import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { BrowseComponent } from './browse/browse.component';
import { AboutComponent } from './about/about.component';
import { PagesComponent } from './pages/pages.component';
import { SendComponent } from './send/send.component';
import { ComicsListComponent } from './comics-list/comics-list.component';

const routes: Routes = [
  {path: '', component: BrowseComponent, pathMatch: 'full'},
  {path: 'pages', component: PagesComponent},
  {path: 'comics', component: ComicsListComponent},
  {path: 'comics/:id', component: ComicsListComponent},
  {path: 'send', component: SendComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'about', component: AboutComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
