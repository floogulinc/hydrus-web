import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
import { HydrusApiService } from '../hydrus-api.service';

@Component({
  selector: 'app-mr-bones-dialog',
  templateUrl: './mr-bones-dialog.component.html',
  styleUrls: ['./mr-bones-dialog.component.scss']
})
export class MrBonesDialogComponent implements OnInit {

  constructor(private apiService: HydrusApiService) { }

  ngOnInit(): void {
  }

  bones$ = this.apiService.mrBones().pipe(
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

      return {
        stats: {
          ...stats,
          num_total,
          size_total,
          num_supertotal,
          size_supertotal,
          boned,
          supertotal_average_filesize,
          current_num_percent : num_total / num_supertotal,
          current_size_percent : size_total / size_supertotal,
          current_average_filesize : Math.floor(size_total / num_total),
          inbox_num_percent : num_inbox / num_total,
          inbox_size_percent : size_inbox / size_total,
          inbox_average_filesize : num_inbox > 0 ? Math.floor(size_inbox / num_inbox) : 0,
          archive_num_percent : num_archive / num_total,
          archive_size_percent : size_archive / size_total,
          archive_average_filesize : num_archive > 0 ? Math.floor(size_archive / num_archive) : 0,
          deleted_num_percent : num_deleted / num_supertotal,
          deleted_size_percent : size_deleted / size_supertotal,
          deleted_average_filesize : num_deleted > 0 ? Math.floor(size_deleted / num_deleted) : 0
        }
      }

    }),
    tap(console.log)
  )

}
