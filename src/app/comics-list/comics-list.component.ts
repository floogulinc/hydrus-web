import { Component, OnInit } from '@angular/core';
import { ComicsService } from '../comics.service';
import { AppComponent } from '../app.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-comics-list',
  templateUrl: './comics-list.component.html',
  styleUrls: ['./comics-list.component.scss']
})
export class ComicsListComponent implements OnInit {

  constructor(public comicsService: ComicsService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    if(this.comicsService.comicsFlat.length === 0) {
      setTimeout(() => this.comicsService.findComics(), 500);
    }
    this.appComponent.refresh$.pipe(untilDestroyed(this)).subscribe(() => {
      this.comicsService.findComics();
    });
  }


}
