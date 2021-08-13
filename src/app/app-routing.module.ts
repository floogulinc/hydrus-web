import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { BrowseComponent } from './browse/browse.component';
import { AboutComponent } from './about/about.component';
import { PagesComponent } from './pages/pages.component';
import { SendComponent } from './send/send.component';
import { ComicsListComponent } from './comics-list/comics-list.component';
import { ComicComponent } from './comic/comic.component';
import { PersistLoadedGuard } from './persist-loaded.guard';

const routes: Routes = [
  {path: '', component: BrowseComponent, pathMatch: 'full', canActivate: [PersistLoadedGuard]},
  {path: 'pages', component: PagesComponent, canActivate: [PersistLoadedGuard]},
  {path: 'comics', component: ComicsListComponent, canActivate: [PersistLoadedGuard]},
  {path: 'comics/view', component: ComicComponent, canActivate: [PersistLoadedGuard]},
  {path: 'send', component: SendComponent, canActivate: [PersistLoadedGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [PersistLoadedGuard]},
  {path: 'about', component: AboutComponent, canActivate: [PersistLoadedGuard]},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
