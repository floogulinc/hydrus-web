import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(public updates: SwUpdate) { }

  public doc = document;

  public env = environment;

  public repoURL = "https://github.com/floogulinc/hydrus-web";

  ngOnInit() {
    
  }

}
