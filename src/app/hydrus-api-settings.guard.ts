import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HydrusApiSettingsService } from './hydrus-api-settings.service';

@Injectable({
  providedIn: 'root'
})
export class HydrusApiSettingsGuard  {
  constructor(private apiSettings: HydrusApiSettingsService, private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.apiSettings.apiSet() ? true : this.router.parseUrl('/welcome');
  }

}
