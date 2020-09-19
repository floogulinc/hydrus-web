import { Component, OnInit } from '@angular/core';
import { ComicsService, FlatComic } from '../comics.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-comics-list',
  templateUrl: './comics-list.component.html',
  styleUrls: ['./comics-list.component.scss']
})
export class ComicsListComponent implements OnInit {

  constructor(public comicsService: ComicsService, public appComponent: AppComponent) { }

  ngOnInit(): void {
    if (this.comicsService.comicsFlat.length === 0) {
      //setTimeout(() => this.comicsService.findComics(), 500);
      this.comicsService.findComics();
    }
  }

  refreshButton() {
    this.comicsService.findComics();
  }

  public scrollTrackByFunction(index: number, comic: FlatComic) {
    return comic.tag + comic.volume;
  }


}
