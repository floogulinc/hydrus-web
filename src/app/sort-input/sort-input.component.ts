import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { provideValueAccessor, WrappedControlSuperclass } from '@s-libs/ng-core';
import { map, shareReplay, startWith, tap } from 'rxjs';
import { defaultAscending, defaultSortType, displaySortGroups, getSortOrderInfo, isDisplaySortMetaTypeGroup, isDisplaySortType, SortInfo } from '../hydrus-sort';

@UntilDestroy()
@Component({
  selector: 'app-sort-input',
  templateUrl: './sort-input.component.html',
  styleUrls: ['./sort-input.component.scss'],
  providers: [provideValueAccessor(SortInputComponent)],
})
export class SortInputComponent extends WrappedControlSuperclass<SortInfo, Partial<SortInfo>> implements OnInit {

  /* constructor() {
    super();
    this.sortOrderInfo$.subscribe();
  } */

  ngOnInit(): void {
    this.sortOrderInfo$.subscribe();
  }

  displaySortGroups = displaySortGroups;
  isDisplaySortMetaTypeGroup = isDisplaySortMetaTypeGroup;
  isDisplaySortType = isDisplaySortType;

  control = new FormGroup({
    sortType: new FormControl(defaultSortType, {nonNullable: true}),
    sortAsc: new FormControl(defaultAscending, {nonNullable: true}),
  });

  sortOrderInfo$ = this.control.get('sortType').valueChanges.pipe(
    startWith(defaultSortType),
    map(sortType => getSortOrderInfo(sortType)),
    tap(({defaultAsc}) => this.control.get('sortAsc').setValue(defaultAsc)),
    shareReplay(1),
    untilDestroyed(this)
  )

  protected outerToInnerValue(outer: SortInfo | null): SortInfo {
    // `outer` can come in as `null` during initialization when the user binds with `ngModel`
    return outer || {sortType: defaultSortType, sortAsc: defaultAscending}
  }

}
