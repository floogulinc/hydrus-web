import { AppComponent } from './../app.component';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';
import { SearchService } from '../search.service';
import { HydrusFilesService } from '../hydrus-files.service';
import { Subscription } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsService } from '../settings.service';
import { HydrusSearchTags } from '../hydrus-tags';
import { defaultSort, displaySortGroups, HydrusSortType, isDisplaySortMetaTypeGroup, isDisplaySortType, SortInfo, sortToString } from '../hydrus-sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@UntilDestroy()
@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
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
    this.searchTags = [...settingsService.appSettings.browseDefaultSearchTags]
  }

  currentSearchIDs: number[] = [];
  searchTags: HydrusSearchTags = [];

  searchSub: Subscription;

  searching = this.settingsService.appSettings.browseSearchOnLoad;

  sort = defaultSort;


  displaySortGroups = displaySortGroups;
  isDisplaySortMetaTypeGroup = isDisplaySortMetaTypeGroup;
  isDisplaySortType = isDisplaySortType;
  sortToString = sortToString;
  defaultSort = defaultSort;

  ngOnInit() {

  }

  refreshButton() {
    this.currentSearchIDs = [];
    this.search();
  }

  ngAfterViewInit() {
    if (this.hydrusApiUrl && this.hydrusApiKey && this.settingsService.appSettings.browseSearchOnLoad) {
      this.search();
    }
  }

  tagsChanged(tags: HydrusSearchTags) {
    this.searchTags = tags;
    this.search();
  }

  setSortInfo(sort: SortInfo) {
    this.sort = sort;
    this.search();
  }
  setSort(sortType: HydrusSortType, sortAsc: boolean) {
    this.setSortInfo({sortType, sortAsc});
  }


  resetSort() {
    this.setSortInfo(defaultSort);
  }

  search() {
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
  }

}
