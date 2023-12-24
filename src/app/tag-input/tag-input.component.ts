import { HydrusFilesService } from './../hydrus-files.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, Optional, Self } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';
import { ControlValueAccessor, NgControl, UntypedFormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent, MatLegacyAutocomplete as MatAutocomplete } from '@angular/material/legacy-autocomplete';
import { Observable, firstValueFrom, of } from 'rxjs';
import { HydrusTagsService } from '../hydrus-tags.service';
import { HydrusSearchTags, HydrusTagSearchTag, TagDisplayType } from '../hydrus-tags';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { allSystemPredicates, predicateGroups, SystemPredicate } from '../hydrus-system-predicates';
import { SystemPredicateDialogComponent } from '../system-predicate-dialog/system-predicate-dialog.component';
import { TagInputDialogComponent } from '../tag-input-dialog/tag-input-dialog.component';
import { SettingsService } from '../settings.service';
import { SystemPredicateRatingsDialogComponent } from '../system-predicate-ratings-dialog/system-predicate-ratings-dialog.component';
import { HydrusService } from '../hydrus-services';
import { searchTagsContainsSystemPredicate } from '../utils/tag-utils';
import { HydrusRatingsService } from '../hydrus-ratings.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { TagSiblingsParentsDialogComponent } from '../tag-siblings-parents-dialog/tag-siblings-parents-dialog.component';

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

  @Input() enableFavorites = true;

  @Input() placeholder: string;

  @Input() defaultTags: HydrusSearchTags;

  @Input() displayType: TagDisplayType = 'display';

  @Input() enableSiblingParentsDialog = true;

  @Output()
  tags = new EventEmitter<HydrusSearchTags>();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    @Optional() @Self() private controlDir: NgControl,
    public filesService: HydrusFilesService,
    public tagsService: HydrusTagsService,
    public dialog: MatDialog,
    public settingsService: SettingsService,
    private ratingsService: HydrusRatingsService,
    private snackbar: MatSnackBar,
  ) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this
    }

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      switchMap(search => search && search.length >= 3 ? this.tagsService.searchTags(search, this.displayType) : of([]))
    );
   }

  favoriteTags = this.settingsService.appSettings.favoriteTags;

  canGetSiblingsParents$ = this.tagsService.canGetSiblingsParents$;


  writeValue(obj: string[]): void {
    if(!obj) {
      return;
    }
    this.searchTags = [...obj];
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
    if(!this.enableSystemPredicates && this.enableFavorites) {
      this.favoriteTags =  this.settingsService.appSettings.favoriteTags.filter(tags => !searchTagsContainsSystemPredicate(tags));
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

  addSearchTags(tags: HydrusSearchTags) {
    if(tags.length > 0) {
      this.searchTags.push(...tags);
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
    const dialogRef = TagInputDialogComponent.open(this.dialog, {
      displayType: 'display',
      enableOrSearch: false,
      title: 'Add OR Search',
      submitButtonText: 'Add'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.addSearchTags([result]);
      }
    });

  }

  isConvertedPredicateSingle(p: ConvertedPredicate | ConvertedPredicateGroup): p is ConvertedPredicate {
    return 'predicate' in p;
  }

  async systemPredicateButton(pred: SystemPredicate) {
    if(pred === SystemPredicate.RATING_GENERAL) {
      const result = await this.ratingPredicateDialog();
      if(result) {
        this.addSearchTag(result);
      }
      return;
    }
    const predicate = allSystemPredicates[pred];
    if(pred === SystemPredicate.HAS_RATING || pred === SystemPredicate.NO_RATING) {
      const ratingServices = await firstValueFrom(this.ratingsService.ratingServices$);
      if(ratingServices.length === 0) {
        this.noRatingServiceSnackbar();
        return;
      } else if(ratingServices.length === 1) {
        this.addSearchTag(`system:${predicate.name} ${ratingServices[0].name}`);
        return;
      }
    }
    if(!predicate.operator && !predicate.units && !predicate.value) {
      this.addSearchTag(`system:${predicate.name}`);
    } else {
      const result = await this.predicateDialog(pred);
      if(result) {
        this.addSearchTag(result);
      }
    }
  }

  async predicateDialog(pred: SystemPredicate) {
    const dialogRef = this.dialog.open<SystemPredicateDialogComponent, {predicate: SystemPredicate}, string>(
      SystemPredicateDialogComponent,
      {
        //width: '80vw',
        data: {predicate: pred},
      }
    )
    return firstValueFrom(dialogRef.afterClosed());
  }


  async ratingPredicateDialog() {
    const service = await this.ratingsService.getRatingServiceDialog();
    if(!service) {
      this.noRatingServiceSnackbar();
      return;
    }
    const dialogRef = this.dialog.open<SystemPredicateRatingsDialogComponent, {service: HydrusService}, string>(
      SystemPredicateRatingsDialogComponent,
      {
        data: {
          service
        },
        // maxWidth: '648px',
        // width: '90vw',
      }
    );
    return firstValueFrom(dialogRef.afterClosed());
  }

  noRatingServiceSnackbar() {
    this.snackbar.open('There are no rating services', undefined, {
      duration: 2000
    });
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

  async tagSiblingsParentsDialog(tag: string) {
    const dialog = TagSiblingsParentsDialogComponent.open(this.dialog, {
      tag,
      allowSearchTag: true,
      allowAddTagToSearch: true,
      allowNewSiblingParentDialog: true
    });
    const dialogResult = await firstValueFrom(dialog.afterClosed());
    if (dialogResult) {
      switch (dialogResult.action) {
        case 'searchTag':
          return this.setSearchTags([dialogResult.tag])
        case 'addSearchTag':
          return this.addSearchTags([dialogResult.tag]);
        case 'newSiblingParentDialog':
          return this.tagSiblingsParentsDialog(dialogResult.tag)
      }
    }
  }


}
