import { HydrusApiService } from './../hydrus-api.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatChipInputEvent } from '@angular/material/chips';
import { ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';


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

  constructor(private hydrusApi: HydrusApiService) { }

  currentFiles: number[];
  searchTags: string[] = [];

  searchArchive: boolean = false;

  ngOnInit() {
    
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
    this.hydrusApi.searchFiles(this.searchTags).subscribe((result) => {
      this.currentFiles = result;
      console.log(result);
    }, (error) => {

    })
  }



}
