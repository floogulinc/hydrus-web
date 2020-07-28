import { AppComponent } from './../app.component';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';
import { SearchService } from '../search.service';
import { HydrusFilesService } from '../hydrus-files.service';
import { Subscription } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

enum FilterOption {
  archive,
  inbox,
  none
}

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

  FilterOption = FilterOption;

  constructor(private searchService: SearchService, public filesService: HydrusFilesService, private appComponent: AppComponent) { }

  currentSearchIDs: number[] = [];
  searchTags: string[] = [];

  searchSub: Subscription;

  filterOption: FilterOption = FilterOption.none;

  setFilterOption(option: FilterOption){
    this.filterOption = option;
    this.search();
  }

  ngOnInit() {
    this.appComponent.refresh$.pipe(untilDestroyed(this)).subscribe(() => {
      this.currentSearchIDs = [];
      this.search();
    });
  }

  ngAfterViewInit() {
    if (this.hydrusApiUrl && this.hydrusApiKey) {
      this.search();
    }
  }

  tagsChanged(tags: string[]) {
    this.searchTags = tags;
    this.search();
  }

  search() {
    this.searchSub?.unsubscribe();
    this.searchSub = this.searchService.searchFiles(
      this.searchTags,
      {
        system_inbox: this.filterOption === FilterOption.inbox,
        system_archive: this.filterOption === FilterOption.archive
      }
    ).pipe(untilDestroyed(this)).subscribe((result) => {
      this.currentSearchIDs = result;
    }, () => {

    });
  }

}
