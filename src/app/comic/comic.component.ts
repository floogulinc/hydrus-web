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

  files$: Observable<HydrusFile[]>;

  constructor(public route: ActivatedRoute, public searchService: SearchService, public fileService: HydrusFilesService) { }

  collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'variant'});

  private compare(a, b): number {
    if (!a || !b) {
      return a ? b ? 0 : 1 : b ? -1 : 1;
    }
    return this.collator.compare(a, b);
  }

  private pageNumberFromFile(file: HydrusFile): string {
    return TagUtils.getTagValue(TagUtils.namespaceTagFromFile(file, 'page'));
  }

  private volumeNumberFromFile(file: HydrusFile): string {
    return TagUtils.getTagValue(TagUtils.namespaceTagFromFile(file, 'volume'));
  }

  private chapterNumberFromFile(file: HydrusFile): string {
    return TagUtils.getTagValue(TagUtils.namespaceTagFromFile(file, 'chapter'));
  }

  ngOnInit(): void {
    this.files$ = this.route.queryParamMap.pipe(
      switchMap(params => this.searchService.searchFiles([...params.getAll('title'), ...params.getAll('volume')])),
      switchMap(files => this.fileService.getFileMetadata(files)),
      map(files => files
        .sort((a, b) => this.compare(this.pageNumberFromFile(a), this.pageNumberFromFile(b)))
        .sort((a, b) => this.compare(this.chapterNumberFromFile(a), this.chapterNumberFromFile(b)))
        .sort((a, b) => this.compare(this.volumeNumberFromFile(a), this.volumeNumberFromFile(b)))
      )
    );
  }

}
