import { AppComponent } from './../app.component';
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';
import { SearchService } from '../search.service';
import { HydrusFilesService } from '../hydrus-files.service';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, startWith, Subject, Subscription, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsService } from '../settings.service';
import { HydrusSearchTags } from '../hydrus-tags';
import { defaultSort, displaySortGroups, HydrusSortType, isDisplaySortMetaTypeGroup, isDisplaySortType, SortInfo, sortToString } from '../hydrus-sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseComponent implements OnInit, AfterViewInit {

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiUrl: string;

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiKey: string;

  constructor(
    private searchService: SearchService,
    public filesService: HydrusFilesService,
    public settingsService: SettingsService,
    private snackbar: MatSnackBar,
  ) {
  }

  tagsFormControl = new FormControl<HydrusSearchTags>(this.settingsService.appSettings.browseDefaultSearchTags);

  searchTags$ = this.tagsFormControl.valueChanges.pipe(
    startWith(this.tagsFormControl.value)
  );

  sort$ = new BehaviorSubject(defaultSort);
  searching$ = new BehaviorSubject(this.settingsService.appSettings.browseSearchOnLoad);

  refresh$ = new Subject();



  displaySortGroups = displaySortGroups;
  isDisplaySortMetaTypeGroup = isDisplaySortMetaTypeGroup;
  isDisplaySortType = isDisplaySortType;
  sortToString = sortToString;
  defaultSort = defaultSort;

  currentSearch$: Observable<number[]> = combineLatest([this.searchTags$, this.sort$, this.refresh$]).pipe(
    filter(([searchTags]) => this.settingsService.appSettings.browseSearchWhenEmpty || searchTags.length > 0),
    tap(() => this.searching$.next(true)),
    switchMap(([searchTags, sort]) => this.searchService.searchFiles(
      searchTags,
      {
        file_sort_type: sort.sortType,
        file_sort_asc: sort.sortAsc
      }
    ).pipe(
      catchError(error => {
        this.snackbar.open(`Error searching: ${error.message}`, undefined, {
          duration: 5000
        })
        return of([]);
      }),
    )),
    tap(() => this.searching$.next(false)),
    shareReplay(1),
  )

  searchTotal$ = this.currentSearch$.pipe(
    map(s => s.length)
  )

  ngOnInit() {

  }


  ngAfterViewInit() {
    if (this.hydrusApiUrl && this.hydrusApiKey && this.settingsService.appSettings.browseSearchOnLoad) {
      this.refresh$.next(null);
    }
  }

/*   tagsChanged(tags: HydrusSearchTags) {
    console.log(tags);
    this.searchTags$.next(tags);
  } */

  setSortInfo(sort: SortInfo) {
    this.sort$.next(sort);
  }
  setSort(sortType: HydrusSortType, sortAsc: boolean) {
    this.setSortInfo({sortType, sortAsc});
  }


  resetSort() {
    this.setSortInfo(defaultSort);
  }

/*   search() {
    if(!this.settingsService.appSettings.browseSearchWhenEmpty && this.searchTags.length === 0) {
      return;
    }
    this.searching = true;
    this.searchSub?.unsubscribe();
    this.searchSub = this.searchService.searchFiles(
      this.searchTags,
      {
        file_sort_type: this.sort.sortType,
        file_sort_asc: this.sort.sortAsc
      }
    ).pipe(untilDestroyed(this)).subscribe((result) => {
      this.searching = false;
      this.currentSearchIDs = result;
    }, (error) => {
      this.searching = false;
      this.snackbar.open(`Error searching: ${error.message}`, undefined, {
        duration: 5000
      });
    });
  } */

}
