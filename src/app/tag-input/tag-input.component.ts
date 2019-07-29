import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagUtils } from '../tag-utils';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent implements OnInit {

  searchTags: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  tagUtils = TagUtils;

  @Output()
  tags = new EventEmitter<string[]>();


  constructor() { }

  ngOnInit() {
  }

  addSearchTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.searchTags.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tags.emit(this.searchTags);
  }
  

  removeSearchTag(tag: string): void {
    const index = this.searchTags.indexOf(tag);

    if (index >= 0) {
      this.searchTags.splice(index, 1);
    }

    this.tags.emit(this.searchTags);
  }
  

}
