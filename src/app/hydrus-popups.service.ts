import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';
import { HydrusJobStatusAddRequest, HydrusJobStatusUpdateRequest } from './hydrus-job-status';
import { BehaviorSubject, EMPTY, interval, map, merge, of, switchMap } from 'rxjs';
import { HydrusVersionService } from './hydrus-version.service';

@Injectable({
  providedIn: 'root'
})
export class HydrusPopupsService {

  constructor(
    private api: HydrusApiService,
    private hydrusVersion: HydrusVersionService
  ) { }


  private refreshPopups$ = new BehaviorSubject<void>(undefined);

  canGetPopups$ = this.hydrusVersion.isAtLeastVersion(553); //TODO: set to 554

  popups$ = this.canGetPopups$.pipe(
    switchMap(canGetPopups => {
      if(canGetPopups) {
        return merge(this.refreshPopups$, interval(1 * 60 * 1000)).pipe(
          switchMap(() => this.getPopups().pipe(
            map(({job_statuses}) => job_statuses)
          ))
        )
      } else {
        return EMPTY
      }
    })
  )

  public refreshPopups() {
    this.refreshPopups$.next();
  }

  getPopups(only_in_view?: boolean) {
    return this.api.getPopups(only_in_view, true);
  }

  addPopup(data: HydrusJobStatusAddRequest) {
    return this.api.addPopup(data);
  }

  updatePopup(data: HydrusJobStatusUpdateRequest) {
    return this.api.updatePopup(data)
  }

  dismissPopup(key: string) {
    return this.api.dismissPopup({job_status_key: key});
  }

  finishPopup(key: string) {
    return this.api.finishPopup({job_status_key: key});
  }

  cancelPopup(key: string) {
    return this.api.cancelPopup({job_status_key: key});
  }

  callUserCallable(key: string) {
    return this.api.callUserCallablePopup({job_status_key: key});
  }

}
