import { AppComponent } from './../app.component';
import { HydrusApiService } from './../hydrus-api.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatChipInputEvent } from '@angular/material/chips';
import { ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';
import { SearchService } from '../search.service';
import { HydrusFilesService } from '../hydrus-files.service';
import { IPageInfo } from 'ngx-virtual-scroller';
import { HydrusFile } from '../hydrus-file';
import { PhotoswipeComponent } from '../photoswipe/photoswipe.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit, OnDestroy, AfterViewInit {

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiUrl: string;

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiKey: string;


  constructor(private searchService: SearchService, public filesService: HydrusFilesService, private appComponent: AppComponent) { }

  currentSearchIDs: number[] = [];
  searchTags: string[] = [];

  searchArchive: boolean = false;

  destroyNotifier$ = new Subject();


  ngOnInit() {
    this.appComponent.refresh$.pipe(takeUntil(this.destroyNotifier$)).subscribe(() => {
      this.currentSearchIDs = [];
      this.search();
    });
  }

  ngAfterViewInit() {
    if(this.hydrusApiUrl && this.hydrusApiKey) {
      this.search();
    }
  }

  ngOnDestroy() {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  tagsChanged(tags: string[]) {
    this.searchTags = tags;
    this.search();
  }

  search() {
    console.log('search called')
    this.searchService.searchFiles(this.searchTags).pipe(takeUntil(this.destroyNotifier$)).subscribe((result) => {
      this.currentSearchIDs = result;
    }, (error) => {

    })
  }

}
