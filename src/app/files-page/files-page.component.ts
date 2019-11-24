import { Component, OnInit, Input } from '@angular/core';
import { HydrusPageListItem, HydrusPage,  } from '../hydrus-page';
import { HydrusPagesService } from '../hydrus-pages.service';

@Component({
  selector: 'app-files-page',
  templateUrl: './files-page.component.html',
  styleUrls: ['./files-page.component.scss']
})
export class FilesPageComponent implements OnInit {

  @Input() pageListItem: HydrusPageListItem;

  pageInfo: HydrusPage;

  constructor(public pagesService: HydrusPagesService) { }

  ngOnInit() {
    this.pagesService.getPage(this.pageListItem.page_key).subscribe(
      (result) => {
        this.pageInfo = result;
      }
    )

  }

}
