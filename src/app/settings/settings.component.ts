import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  hydrusApiUrl: string;
  hydrusApiKey: string;

  constructor() { }

  ngOnInit() {
    this.hydrusApiKey = "";
    this.hydrusApiUrl = "";
  }

  

  public submitForm(): void {

  }

}
