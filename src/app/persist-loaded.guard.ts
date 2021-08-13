import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { selectPersistStateInit } from '@datorama/akita';
import { Observable } from 'rxjs';
import { mapTo, skip, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersistLoadedGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return selectPersistStateInit().pipe(
      take(1),
      mapTo(true)
    );
  }

}
