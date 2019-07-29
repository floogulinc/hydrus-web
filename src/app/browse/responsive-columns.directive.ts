// based on Алексей Сердюков's answer at Stackoverflow (https://stackoverflow.com/a/50837219/1143392)

import {
  Directive,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatGridList } from '@angular/material';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponsiveColumnsMap {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

// Usage: <mat-grid-list [responsiveColumns]="{xs: 1, sm: 2, md: 4, lg: 6, xl: 12}">
@Directive({
             selector: '[responsiveColumns]'
           })
export class ResponsiveColumnsDirective implements OnInit, OnDestroy {

  private static readonly DEFAULT_COLUMNS_MAP: ResponsiveColumnsMap = {
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 12
  };

  @Input() private responsiveColumns: ResponsiveColumnsMap;

  private watcher: Subscription;

  constructor(private readonly grid: MatGridList,
              private readonly mediaObserver: MediaObserver) {
  }

  ngOnInit(): void {
    this.responsiveColumns = this.responsiveColumns || ResponsiveColumnsDirective.DEFAULT_COLUMNS_MAP;

    this.initializeColsCount();

    this.watcher = this.mediaObserver.asObservable()
                       .pipe(
                         map(changes => {
                           const matchingAliases = changes.map(change => this.mapAlias(change.mqAlias))
                                                          // sort by number of columns desc
                                                          .sort((a, b) => this.responsiveColumns[ b ] - this.responsiveColumns[ a ])
                                                          // doublecheck
                                                          .filter(alias => Object.keys(this.responsiveColumns).includes(alias))
                                                          // triplecheck
                                                          .filter(alias => this.mediaObserver.isActive(alias));

                           const matchedAlias = matchingAliases.length > 0
                                                ? matchingAliases[ 0 ]     // take the first matching alias (most cols)
                                                : 'xs';                    // default to xs

                           return this.responsiveColumns[ matchedAlias ];
                         })
                       ).subscribe(cols => this.grid.cols = cols);
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  private initializeColsCount(): void {
    const matchingAliases = Object.keys(this.responsiveColumns)
                                  // sort by number of columns desc
                                  .sort((a, b) => this.responsiveColumns[ b ] - this.responsiveColumns[ a ])
                                  // doublecheck
                                  .filter(alias => this.mediaObserver.isActive(alias));

    if (matchingAliases.length > 0) {
      const firstMatchingAlias = matchingAliases[ 0 ];
      this.grid.cols           = this.responsiveColumns[ firstMatchingAlias ];
    } else {
      this.grid.cols = this.responsiveColumns.xs;
    }
  }

  private mapAlias(mqAlias: string): string {
    if (!mqAlias.includes('-')) {
      return mqAlias;
    }

    const parts  = mqAlias.split('-');
    const ltOrGt = parts[ 0 ];
    const alias  = parts[ 1 ];

    const keys  = Object.keys(this.responsiveColumns);
    const index = keys.indexOf(alias);

    return ltOrGt === 'lt'
           ? keys[ index - 1 ]
           : keys[ index + 1 ];
  }
}