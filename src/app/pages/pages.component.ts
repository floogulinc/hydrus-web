import { Component, OnInit } from '@angular/core';
import { HydrusPagesService } from '../hydrus-pages.service';
import { HydrusPageListItem } from '../hydrus-page';
import { ngxLocalStorage } from 'ngx-localstorage';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(public pagesService: HydrusPagesService) { }

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiUrl: string;

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiKey: string;

  pages: HydrusPageListItem[] = [];

  public refreshButton$: Subject<boolean> = new Subject();

  ngOnInit() {
    if (this.hydrusApiUrl && this.hydrusApiKey) {
      this.pagesService.getAllPages().subscribe(
        (result) => {
          this.pages = result;
        }
      );
    }
  }

}
