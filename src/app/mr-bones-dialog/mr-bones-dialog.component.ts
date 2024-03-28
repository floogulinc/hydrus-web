import { Component, OnInit } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { HydrusApiService } from '../hydrus-api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorService } from '../error.service';

interface BonesTableElement {
  label: string,
  num: number,
  numPercent: number,
  size: number,
  sizePercent: number,
  averageFilesize: number,
}


@Component({
  selector: 'app-mr-bones-dialog',
  templateUrl: './mr-bones-dialog.component.html',
  styleUrls: ['./mr-bones-dialog.component.scss']
})
export class MrBonesDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MrBonesDialogComponent>,
    private apiService: HydrusApiService,
    private errorService: ErrorService
  ) { }

  ngOnInit(): void {
  }

  displayedColumns: (keyof BonesTableElement)[] = ['label', 'num', 'numPercent', 'size', 'sizePercent', 'averageFilesize']

  bones$ = this.apiService.mrBones().pipe(
    catchError((error, caught) => {
      this.errorService.handleHydrusError(error);
      this.dialogRef.close();
      return throwError(() => error);
    }),
    map(bones => bones.boned_stats),
    map(stats => {
      const {num_inbox, num_archive, num_deleted, size_inbox, size_archive, size_deleted} = stats;
      const num_total = num_archive + num_inbox;
      if(num_total === 0) {
        return {
          stats: null
        }
      }
      const size_total = size_archive + size_inbox;
      const num_supertotal = num_total + num_deleted
      const size_supertotal = size_total + size_deleted
      const boned = num_inbox > num_archive / 100
      const supertotal_average_filesize = Math.floor(size_supertotal / num_supertotal)

      const table: BonesTableElement[] = [
        {
          label: 'Total Ever Imported',
          num: num_supertotal,
          numPercent: null,
          size: size_supertotal,
          sizePercent: null,
          averageFilesize: supertotal_average_filesize
        },
        {
          label: 'All My Files',
          num: num_total,
          numPercent: num_total / num_supertotal,
          size: size_total,
          sizePercent: size_total / size_supertotal,
          averageFilesize: Math.floor(size_total / num_total)
        },
        {
          label: 'Inbox',
          num: num_inbox,
          numPercent: num_inbox / num_total,
          size: size_inbox ,
          sizePercent: size_inbox / size_total,
          averageFilesize: num_inbox > 0 ? Math.floor(size_inbox / num_inbox) : 0
        },
        {
          label: 'Archive',
          num: num_archive,
          numPercent: num_archive / num_total,
          size: size_archive ,
          sizePercent: size_archive / size_total,
          averageFilesize: num_archive > 0 ? Math.floor(size_archive / num_archive) : 0
        },
        {
          label: 'Trash',
          num: num_deleted,
          numPercent: num_deleted / num_supertotal,
          size: size_deleted ,
          sizePercent: size_deleted / size_supertotal,
          averageFilesize: num_deleted > 0 ? Math.floor(size_deleted / num_deleted) : 0
        }
      ]

      return {
        stats: {
          ...stats,
          num_total,
          size_total,
          num_supertotal,
          size_supertotal,
          boned,
          supertotal_average_filesize,
          table,
          earliestImport: new Date(stats.earliest_import_time * 1000)
        }
      }

    }),
  )

}
