import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComicsService } from '../comics.service';
import { AppComponent } from '../app.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-comics-list',
  templateUrl: './comics-list.component.html',
  styleUrls: ['./comics-list.component.scss']
})
export class ComicsListComponent implements OnInit, OnDestroy {

  destroyNotifier$ = new Subject();

  constructor(public comicsService: ComicsService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    if(this.comicsService.comicsFlat.length === 0) {
      setTimeout(() => this.comicsService.findComics(), 500);
    }
    this.appComponent.refresh$.pipe(takeUntil(this.destroyNotifier$)).subscribe(() => {
      this.comicsService.findComics();
    });
  }

  ngOnDestroy() {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
