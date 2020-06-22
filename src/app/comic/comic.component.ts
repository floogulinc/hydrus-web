import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HydrusFile } from '../hydrus-file';
import { SearchService } from '../search.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { HydrusFilesService } from '../hydrus-files.service';
import { TagUtils } from '../tag-utils';

@Component({
  selector: 'app-comic',
  templateUrl: './comic.component.html',
  styleUrls: ['./comic.component.scss']
})
export class ComicComponent implements OnInit {

  files$: Observable<HydrusFile[]>

  constructor(public route: ActivatedRoute, public searchService: SearchService, public fileService: HydrusFilesService) { }


  private pageNumberFromFile(file: HydrusFile): number {
    return parseFloat(TagUtils.getTagValue(TagUtils.namespaceTagFromFile(file, 'page')));
  }

  private volumeNumberFromFile(file: HydrusFile): number {
    return parseFloat(TagUtils.getTagValue(TagUtils.namespaceTagFromFile(file, 'volume')));
  }

  ngOnInit(): void {
    this.files$ = this.route.queryParamMap.pipe(
      switchMap(params => this.searchService.searchFiles([...params.getAll('title'), ...params.getAll('volume')])),
      switchMap(files => this.fileService.getFileMetadata(files)),
      map(files => files
        .sort((a, b) => this.pageNumberFromFile(a) - this.pageNumberFromFile(b))
        .sort((a, b) => this.volumeNumberFromFile(a) - this.volumeNumberFromFile(b))
      )
    );
  }

}
