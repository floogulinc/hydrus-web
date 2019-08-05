import { HydrusApiService } from './../hydrus-api.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatChipInputEvent } from '@angular/material/chips';
import { ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';
import { SearchService } from '../search.service';
import { HydrusFilesService } from '../hydrus-files.service';
import { IPageInfo } from 'ngx-virtual-scroller';
import { HydrusFile } from '../hydrus-file';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiUrl: string;

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiKey: string;

  constructor(private searchService: SearchService, private apiService: HydrusApiService, public filesService: HydrusFilesService) { }

  currentSearchIDs: number[] = [];
  currentFiles: HydrusFile[] = [];
  searchTags: string[] = [];

  searchArchive: boolean = false;

  loading: boolean = false;

  loadAtOnce: number = 50;

  ngOnInit() {
    
  }

  getThumbnailURL(id: number) {
    return this.apiService.getThumbnailURL(id);
  }

  getFileURL(id: number) {
    return this.apiService.getFileURL(id);
  }

  ngAfterViewInit() {
    if(this.hydrusApiUrl && this.hydrusApiKey) {
      this.search();
    }
  }

  tagsChanged(tags: string[]) {
    this.searchTags = tags;
    console.log(tags);
    this.search();
  }

  search() {
    this.searchService.searchFiles(this.searchTags).subscribe((result) => {
      this.currentFiles = [];
      this.currentSearchIDs = result;
      this.fetchMore();
      console.log(result);
    }, (error) => {

    })
  }

  fetchMore(event?: IPageInfo) {
    if ((event && (event.endIndex !== this.currentFiles.length-1)) || this.loading) return;
    this.loading = true;
       // this.fetchNextChunk(this.buffer.length, 10).then(chunk => {
       //     this.buffer = this.buffer.concat(chunk);
       //     this.loading = false;
       // }, () => this.loading = false);
       console.log(this.currentFiles.length);
    this.filesService.getFileMetadata(this.currentSearchIDs.slice(this.currentFiles.length, this.currentFiles.length + this.loadAtOnce)).subscribe((files) => {
      this.currentFiles = this.currentFiles.concat(files);
      this.loading = false;
      console.log(this.currentFiles);
    })
  }

  testStuff() {
    this.filesService.getFileMetadata(this.currentSearchIDs.slice(0,100)).subscribe(files => {
      console.log(files);
      console.log(this.filesService.getKnownTags());
    })
  }



}
