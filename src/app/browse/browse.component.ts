import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SearchService } from '../search.service';
import { HydrusFilesService } from '../hydrus-files.service';
import { BehaviorSubject, catchError, combineLatest, filter, firstValueFrom, map, Observable, of, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SettingsService } from '../settings.service';
import { HydrusSearchTags } from '../hydrus-tags';
import { defaultSort, displaySortGroups, HydrusSortType, isDisplaySortMetaTypeGroup, isDisplaySortType, SortInfo, sortToString } from '../hydrus-sort';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from '../error.service';
import { ALL_KNOWN_TAGS_SERVICE_KEY, ALL_MY_FILES_SERVICE_KEY, getTagServices, isFileService, isNonDeletedFileService } from '../hydrus-services';
import { ServiceSelectDialogComponent } from '../service-select-dialog/service-select-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HydrusServicesService } from '../hydrus-services.service';

@UntilDestroy()
@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private searchService: SearchService,
    public filesService: HydrusFilesService,
    public settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private errorService: ErrorService,
    private dialog: MatDialog,
    private hydrusServices: HydrusServicesService
    ) {
  }

  tagsFormControl = new FormControl<HydrusSearchTags>([]);

  searchTags$ = this.tagsFormControl.valueChanges.pipe(
    shareReplay(1)
  );

  sort$ = new BehaviorSubject(defaultSort);
  searching$ = new BehaviorSubject(this.settingsService.appSettings.browseSearchOnLoad);

  refresh$ = new Subject();

  tagServiceKey$ = new BehaviorSubject(ALL_KNOWN_TAGS_SERVICE_KEY);
  fileServiceKey$ = new BehaviorSubject(ALL_MY_FILES_SERVICE_KEY);

  tagService$ = combineLatest([this.tagServiceKey$, this.hydrusServices.hydrusServicesArray$]).pipe(
    map(([serviceKey, services]) => services.find(s => s.service_key === serviceKey))
  )

  fileService$ = combineLatest([this.fileServiceKey$, this.hydrusServices.hydrusServicesArray$]).pipe(
    map(([serviceKey, services]) => services.find(s => s.service_key === serviceKey))
  )

  displaySortGroups = displaySortGroups;
  isDisplaySortMetaTypeGroup = isDisplaySortMetaTypeGroup;
  isDisplaySortType = isDisplaySortType;
  sortToString = sortToString;
  defaultSort = defaultSort;

  currentSearch$: Observable<number[]> = combineLatest([this.searchTags$, this.sort$, this.tagServiceKey$, this.fileServiceKey$, this.refresh$]).pipe(
    filter(([searchTags]) => this.settingsService.appSettings.browseSearchWhenEmpty || searchTags.length > 0),
    tap(() => this.searching$.next(true)),
    switchMap(([searchTags, sort, tagService, fileService]) => this.searchService.searchFiles(
      searchTags,
      {
        file_sort_type: sort.sortType,
        file_sort_asc: sort.sortAsc,
        tag_service_key: tagService,
        file_service_key: fileService
      }
    ).pipe(
      catchError(error => {
        this.errorService.handleHydrusError(error, 'Error searching');
        return of([]);
      }),
    )),
    tap(() => this.searching$.next(false)),
    shareReplay(1),
  )

  searchTotal$ = this.currentSearch$.pipe(
    map(s => s.length)
  )

  firstParams = true;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('tags')) {
        this.tagsFormControl.setValue(JSON.parse(params.get('tags')))
        this.router.navigate(['/browse'], { replaceUrl: true });
      } else if (params.has('addTags')) {
        this.tagsFormControl.setValue([...this.tagsFormControl.value, ...JSON.parse(params.get('addTags'))])
        this.router.navigate(['/browse'], { replaceUrl: true });
      } else if (this.firstParams) {
        this.tagsFormControl.setValue(this.settingsService.appSettings.browseDefaultSearchTags);
      }
      this.firstParams = false;
    });
  }


  ngAfterViewInit() {
    if (this.settingsService.appSettings.browseSearchOnLoad) {
      this.refresh$.next(null);
    }
  }

  tagsSub = this.searchTags$.subscribe();

  ngOnDestroy() {
    this.tagsSub.unsubscribe();
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

  async tagServiceDialog() {
    const serviceDialog = ServiceSelectDialogComponent.open(this.dialog, {serviceFilter: (services) => getTagServices(services)})
    const service = await firstValueFrom(serviceDialog.afterClosed())
    if(!service) {
      return;
    }
    this.tagServiceKey$.next(service.service_key);
  }

  async fileServiceDialog() {
    const serviceDialog = ServiceSelectDialogComponent.open(this.dialog, {serviceFilter: (services) => services.filter(isNonDeletedFileService)})
    const service = await firstValueFrom(serviceDialog.afterClosed())
    if(!service) {
      return;
    }
    this.fileServiceKey$.next(service.service_key);
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
