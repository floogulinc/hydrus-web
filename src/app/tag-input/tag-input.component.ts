import { HydrusFilesService } from './../hydrus-files.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, Optional, Self } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ControlValueAccessor, NgControl, UntypedFormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { HydrusTagsService } from '../hydrus-tags.service';
import { HydrusSearchTags, HydrusTagSearchTag } from '../hydrus-tags';
import { OrSearchDialogComponent } from '../or-search-dialog/or-search-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { allSystemPredicates, predicateGroups, SystemPredicate } from '../hydrus-system-predicates';
import { SystemPredicateDialogComponent } from '../system-predicate-dialog/system-predicate-dialog.component';

function convertPredicate(p: SystemPredicate): ConvertedPredicate {
  const pred = allSystemPredicates[p];
  return {
    predicate: p,
    name: pred.name,
  }
}

interface ConvertedPredicate {
  predicate: SystemPredicate,
  name: string
}

interface ConvertedPredicateGroup {
  name: string;
  predicates: ConvertedPredicate[]
}

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent implements OnInit, ControlValueAccessor {

  searchTags: HydrusSearchTags = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  tagCtrl = new UntypedFormControl();
  filteredTags: Observable<HydrusTagSearchTag[]>;

  //inputControl = new FormControl("", this.validators)

  @Input() enableOrSearch = true;

  @Input() enableSystemPredicates = true;

  @Input() placeholder: string;

  @Input() defaultTags: HydrusSearchTags;

  @Output()
  tags = new EventEmitter<HydrusSearchTags>();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    @Optional() @Self() private controlDir: NgControl,
    public filesService: HydrusFilesService,
    public tagsService: HydrusTagsService,
    public dialog: MatDialog
  ) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this
    }

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      switchMap(search => search && search.length >= 3 ? this.tagsService.searchTags(search) : of([]))
    );
   }


  writeValue(obj: string[]): void {
    obj && this.setSearchTags(obj);
  }

  registerOnChange(fn: any): void {
    //throw new Error('Method not implemented.');
    this.tags.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  onTouched() {}

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.tagCtrl.disable() : this.tagCtrl.enable()
  }

  ngOnInit() {
    if(this.defaultTags) {
      this.searchTags = [...this.defaultTags];
    }

  }

  chipInputEvent(event: MatChipInputEvent): void {
    if(this.matAutocomplete.isOpen && this.matAutocomplete.options.some(x => x.active)) {
      return;
    }

    const input = event.chipInput.inputElement;
    const value = event.value.toLowerCase(); // Hydrus tags are always lowercase

    this.addSearchTag(value);

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  addSearchTag(tag: string) {
    const value = tag.toLowerCase();
    if ((value || '').trim()) {
      this.searchTags.push(value);
    }

    this.tags.emit(this.searchTags);
  }

  addSearchTagsArray(tags: HydrusSearchTags) {
    if(tags.length > 0) {
      this.searchTags.push([...tags]);
      this.tags.emit(this.searchTags);
    }
  }

  setSearchTags(tags: string[]) {
    this.searchTags = [...tags];
    this.tags.emit(this.searchTags);
  }



  removeSearchTag(index: number): void {
    //const index = this.searchTags.indexOf(tag);

    //if (index >= 0) {
    this.searchTags.splice(index, 1);
    //}

    this.tags.emit(this.searchTags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const negated = this.tagInput.nativeElement.value.startsWith('-');
    this.addSearchTag((negated ? '-' : '') + event.option.value);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }


  // private _filter(value: string): string[] {
  //   let filterValue = value ? value.toLowerCase() : '';
  //   const isNegated = filterValue.startsWith('-');
  //   if (isNegated) {
  //     filterValue = filterValue.substring(1);
  //   }

  //   let results = Array.from(this.filesService.getKnownTags())
  //     .filter(tag => tag.toLowerCase().indexOf(filterValue) !== -1)
  //     .filter(tag => !this.searchTags.includes(tag)).slice(0, 25);

  //   if (isNegated) {
  //     results = results.map(t => `-${t}`);
  //   }

  //   return results;
  // }

  orSearchButton() {
    const dialogRef = this.dialog.open<OrSearchDialogComponent, {}, HydrusSearchTags>(
      OrSearchDialogComponent,
      {
        width: '80vw',
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.addSearchTagsArray(result);
      }
    });

  }

  isConvertedPredicateSingle(p: ConvertedPredicate | ConvertedPredicateGroup): p is ConvertedPredicate {
    return 'predicate' in p;
  }

  systemPredicateButton(pred: SystemPredicate) {
    console.log(SystemPredicate[pred]);
    const predicate = allSystemPredicates[pred];
    if(!predicate.operator && !predicate.units && !predicate.value) {
      this.addSearchTag(`system:${predicate.name}`);
    } else {
      const dialogRef = this.dialog.open<SystemPredicateDialogComponent, {predicate: SystemPredicate}, string>(
        SystemPredicateDialogComponent,
        {
          //width: '80vw',
          data: {predicate: pred},
        }
      );
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.addSearchTag(result);
        }
      });
    }
  }


  predicateButtons: (ConvertedPredicateGroup | ConvertedPredicate)[] = predicateGroups.map(p => {
    const isGroup = 'predicates' in p;
    if(!isGroup) {
      return convertPredicate(p.predicate);
    } else {
      return {
        ...p,
        predicates: p.predicates.map(p => convertPredicate(p))
      }
    }
  })


}
