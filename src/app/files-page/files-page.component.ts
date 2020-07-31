import { Component, OnInit, Input, Optional } from '@angular/core';
import { HydrusPageListItem, HydrusPage,  } from '../hydrus-page';
import { HydrusPagesService } from '../hydrus-pages.service';
import { Subscription, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PagesComponent } from '../pages/pages.component';

@UntilDestroy()
@Component({
  selector: 'app-files-page',
  templateUrl: './files-page.component.html',
  styleUrls: ['./files-page.component.scss']
})
export class FilesPageComponent implements OnInit {

  @Input() pageListItem: HydrusPageListItem;
  @Input() refresh?: Observable<any>;

  pageInfo: HydrusPage;

  constructor(public pagesService: HydrusPagesService) { }

  loadSub: Subscription;

  load() {
    this.loadSub?.unsubscribe();
    this.pageInfo = null;
    this.loadSub = this.pagesService.getPage(this.pageListItem.page_key).pipe(untilDestroyed(this)).subscribe(
      (result) => {
        this.pageInfo = result;
      }
    );
  }

  ngOnInit() {
    this.load();
    if (this.refresh) {
      this.refresh.pipe(untilDestroyed(this)).subscribe(() => {
        this.load();
      });
    }
  }



}
