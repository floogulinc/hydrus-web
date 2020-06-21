import { Component, OnInit } from '@angular/core';
import { ComicsService } from '../comics.service';

@Component({
  selector: 'app-comics-list',
  templateUrl: './comics-list.component.html',
  styleUrls: ['./comics-list.component.scss']
})
export class ComicsListComponent implements OnInit {

  constructor(public comicsService: ComicsService) { }

  ngOnInit(): void {
  }

}
