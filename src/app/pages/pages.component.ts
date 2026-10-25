import { Component, OnInit, ViewChild } from '@angular/core';
import { HydrusPagesService } from '../hydrus-pages.service';
import { HydrusPageListItem, HydrusPageType } from '../hydrus-page';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(public pagesService: HydrusPagesService) { }

  HydrusPageType = HydrusPageType;

  pages: HydrusPageListItem[] = [];

  ngOnInit() {
    this.pagesService.getAllPages().subscribe(
      (result) => {
        this.pages = result;
      }
    );
  }

  // scrollTabs sourced & edited from https://stackoverflow.com/questions/51544452/making-material-tabs-scrollable/51545130#51545130 by Kim Kern  CC BY-SA 4.0
  @ViewChild("tabGroup")
  tabGroup;
  scrollTabs(event: WheelEvent) {
    if ((event.target as HTMLElement).closest(".mat-mdc-tab-body-wrapper")) {
      // we scrolled on the thumbnails
      return;
    }
    // angular updates could demolish this whenever but it has been working for a while so 😇
    const children = this.tabGroup._tabHeader._elementRef.nativeElement.children;
    const back = children[0];
    const forward = children[2];
    if (event.deltaY > 0) {
      forward.click();
    } else {
      back.click();
    }

    // block propogation so we don't get down-scrolls on the right-end of the tab list
    event.preventDefault();
    return false;
  }

}
