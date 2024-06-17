import { Component, OnInit, Input, Optional } from '@angular/core';
import { HydrusPageListItem, HydrusPage,  } from '../hydrus-page';
import { HydrusPagesService } from '../hydrus-pages.service';
import { Subscription, Observable, Subject, switchMap, map, tap } from 'rxjs';
import { AppComponent } from '../app.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PagesComponent } from '../pages/pages.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { HydrusVersionService } from '../hydrus-version.service';
import { ErrorService } from '../error.service';

@UntilDestroy()
@Component({
  selector: 'app-files-page',
  templateUrl: './files-page.component.html',
  styleUrls: ['./files-page.component.scss']
})
export class FilesPageComponent implements OnInit {

  @Input() pageListItem: HydrusPageListItem;

  pageInfo: HydrusPage;

  constructor(
    public pagesService: HydrusPagesService,
    private snackbar: MatSnackBar,
    private versionService: HydrusVersionService,
    private errorService: ErrorService
  ) { }

  loadSub: Subscription;

  public refreshButton$: Subject<boolean> = new Subject();
  public refreshPageButton$: Subject<boolean> = new Subject();

  public canRefreshInHydrus$ = this.versionService.isAtLeastVersion(512);

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
    this.refreshButton$.pipe(untilDestroyed(this)).subscribe(() => this.load());
    this.refreshPageButton$.pipe(untilDestroyed(this)).pipe(
      switchMap(() => this.pagesService.refreshPage(this.pageListItem.page_key))
    ).subscribe(() => {
      const snackbarRef = this.snackbar.open('Page refreshed in Hydrus', 'Refresh view', {
        duration: 2000
      });
      snackbarRef.onAction().subscribe(() => {
        this.load();
      })
    }, (error) => {
      this.errorService.handleHydrusError(error, 'Error refreshing page');
    })

  }



}
