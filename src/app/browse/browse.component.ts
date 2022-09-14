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
  ) {
    this.searchTags = [...settingsService.appSettings.browseDefaultSearchTags]
  }

  currentSearchIDs: number[] = [];
  searchTags: HydrusSearchTags = [];

  searchSub: Subscription;

  searching = this.settingsService.appSettings.browseSearchOnLoad;



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

  search() {
    this.searching = true;
    this.searchSub?.unsubscribe();
    this.searchSub = this.searchService.searchFiles(
      this.searchTags
    ).pipe(untilDestroyed(this)).subscribe((result) => {
      this.searching = false;
      this.currentSearchIDs = result;
    }, () => {
      this.searching = false;
    });
  }

}
