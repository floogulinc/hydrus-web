import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HydrusPageListItem, HydrusPage,  } from '../hydrus-page';
import { HydrusPagesService } from '../hydrus-pages.service';
import { Subject } from 'rxjs';
import { AppComponent } from '../app.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-files-page',
  templateUrl: './files-page.component.html',
  styleUrls: ['./files-page.component.scss']
})
export class FilesPageComponent implements OnInit, OnDestroy {

  @Input() pageListItem: HydrusPageListItem;

  pageInfo: HydrusPage;

  destroyNotifier$ = new Subject();

  constructor(public pagesService: HydrusPagesService, private appComponent: AppComponent) { }

  load() {
    this.pageInfo = null;
    this.pagesService.getPage(this.pageListItem.page_key).pipe(takeUntil(this.destroyNotifier$)).subscribe(
      (result) => {
        this.pageInfo = result;
      }
    );
  }

  ngOnInit() {
    this.load();
    this.appComponent.refresh$.pipe(takeUntil(this.destroyNotifier$)).subscribe(() => {
      this.load();
    });
  }

  ngOnDestroy() {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
