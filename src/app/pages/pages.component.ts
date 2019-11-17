import { Component, OnInit } from '@angular/core';
import { HydrusPagesService } from '../hydrus-pages.service';
import { Observable } from 'rxjs';
import { HydrusPageListItem } from '../hydrus-page';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(public pagesService: HydrusPagesService) { }

  pages: HydrusPageListItem[] = [];

  ngOnInit() {
    this.pagesService.getAllPages().subscribe(
      (result) => {
        this.pages = result;
      }
    )
  }

}
