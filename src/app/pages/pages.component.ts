import { Component, OnInit } from '@angular/core';
import { HydrusPagesService } from '../hydrus-pages.service';
import { HydrusPageListItem } from '../hydrus-page';
import { HydrusApiSettingsService } from '../hydrus-api-settings.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(public pagesService: HydrusPagesService, public apiSettings: HydrusApiSettingsService) { }

  pages: HydrusPageListItem[] = [];

  ngOnInit() {
    if (this.apiSettings.apiSet) {
      this.pagesService.getAllPages().subscribe(
        (result) => {
          this.pages = result;
        }
      );
    }
  }

}
