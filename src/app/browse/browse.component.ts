import { AppComponent } from './../app.component';
import { HydrusApiService } from './../hydrus-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatChipInputEvent } from '@angular/material/chips';
import { ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';
import { SearchService } from '../search.service';
import { HydrusFilesService } from '../hydrus-files.service';
import { IPageInfo } from 'ngx-virtual-scroller';
import { HydrusFile } from '../hydrus-file';
import { PhotoswipeComponent } from '../photoswipe/photoswipe.component';


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

  @ViewChild(PhotoswipeComponent, {static: true})
  photoswipe: PhotoswipeComponent;

  constructor(private searchService: SearchService, private apiService: HydrusApiService, public filesService: HydrusFilesService, public appComponent: AppComponent) { }

  currentSearchIDs: number[] = [];
  currentFiles: HydrusFile[] = [];
  searchTags: string[] = [];

  searchArchive: boolean = false;

  loading: boolean = false;

  loadAtOnce: number = 100;

  ngOnInit() {

  }

  ngAfterViewInit() {
    if(this.hydrusApiUrl && this.hydrusApiKey) {
      this.search();
    }
  }

  tagsChanged(tags: string[]) {
    this.searchTags = tags;
    this.search();
  }

  search() {
    this.searchService.searchFiles(this.searchTags).subscribe((result) => {
      this.currentFiles = [];
      this.currentSearchIDs = result;
      this.fetchMore();
    }, (error) => {

    })
  }

  fetchMore(event?: IPageInfo) {
    if (
      (event && (
        (event.endIndex !== this.currentFiles.length-1) ||
        (event.endIndex+1 >= this.currentSearchIDs.length)
        ) )|| this.loading) return;
    this.loading = true;
       // this.fetchNextChunk(this.buffer.length, 10).then(chunk => {
       //     this.buffer = this.buffer.concat(chunk);
       //     this.loading = false;
       // }, () => this.loading = false);
    this.filesService.getFileMetadata(this.currentSearchIDs.slice(this.currentFiles.length, this.currentFiles.length + this.loadAtOnce)).subscribe((files) => {
      this.currentFiles = this.currentFiles.concat(files);
      this.loading = false;
    })
  }


  public scrollTrackByFunction(index: number, file: HydrusFile): number {
    return file.file_id;
}



}
