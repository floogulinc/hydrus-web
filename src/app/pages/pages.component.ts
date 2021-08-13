import { Component, OnInit } from '@angular/core';
import { HydrusPagesService } from '../hydrus-pages.service';
import { HydrusPageListItem } from '../hydrus-page';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { HydrusApiSettingsQuery } from '../hydrus-api-settings';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(public pagesService: HydrusPagesService, public apiSettingsQuery: HydrusApiSettingsQuery) { }

  pages: HydrusPageListItem[] = [];

  public refreshButton$: Subject<boolean> = new Subject();

  ngOnInit() {
    //if (this.hydrusApiUrl && this.hydrusApiKey) {
      this.pagesService.getAllPages().subscribe(
        (result) => {
          this.pages = result;
        }
      );
    //}
  }

}
