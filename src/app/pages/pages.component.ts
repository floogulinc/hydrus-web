import { Component, OnInit } from '@angular/core';
import { HydrusPagesService } from '../hydrus-pages.service';
import { HydrusPageListItem } from '../hydrus-page';
import { ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { SettingsState } from '../settings.state';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(public pagesService: HydrusPagesService) { }

  // @ngxLocalStorage({prefix: environment.localStoragePrefix})
  // hydrusApiUrl: string;

  // @ngxLocalStorage({prefix: environment.localStoragePrefix})
  // hydrusApiKey: string;

  @ViewSelectSnapshot(SettingsState.apiConfigured) apiConfigured: boolean | null;

  pages: HydrusPageListItem[] = [];

  public refreshButton$: Subject<boolean> = new Subject();

  ngOnInit() {
    if (this.apiConfigured) {
      this.pagesService.getAllPages().subscribe(
        (result) => {
          this.pages = result;
        }
      );
    }
  }

}
