import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { BrowseComponent } from './browse/browse.component';

const routes: Routes = [
  {path: '', component: BrowseComponent, pathMatch: 'full'},
  {path: 'settings', component: SettingsComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
