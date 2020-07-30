import { Component, OnInit } from '@angular/core';
import { ComicsService } from '../comics.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-comics-list',
  templateUrl: './comics-list.component.html',
  styleUrls: ['./comics-list.component.scss']
})
export class ComicsListComponent implements OnInit {

  constructor(public comicsService: ComicsService) { }

  ngOnInit(): void {
    if (this.comicsService.comicsFlat.length === 0) {
      setTimeout(() => this.comicsService.findComics(), 500);
    }
  }

  refreshButton() {
    this.comicsService.findComics();
  }


}
