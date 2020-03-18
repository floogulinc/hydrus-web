import { HydrusFilesService } from './../hydrus-files.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagUtils } from '../tag-utils';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent implements OnInit {

  searchTags: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  tagUtils = TagUtils;

  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;

  @Output()
  tags = new EventEmitter<string[]>();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public filesService : HydrusFilesService) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(""),
      map((tag: string) => this._filter(tag))
    );
    
   }

  ngOnInit() {
  }

  chipInputEvent(event: MatChipInputEvent): void {
    //if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value.toLowerCase(); //Hydrus tags are always lowercase

      this.addSearchTag(value);

      // Reset the input value
      if (input) {
        input.value = '';
      }
    //}
  }

  addSearchTag(tag: string) {
    const value = tag.toLowerCase();
    if ((value || '').trim()) {
      this.searchTags.push(value);
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

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addSearchTag(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }


  private _filter(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : "";

    return Array.from(this.filesService.getKnownTags()).filter(tag => tag.toLowerCase().indexOf(filterValue) === 0).filter(tag => !this.searchTags.includes(tag)).slice(0,25);
  }
  

}
