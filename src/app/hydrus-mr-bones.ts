export interface HydrusBonedStats {
  num_inbox: number;
  num_archive: number;
  num_deleted: number;
  size_inbox: number;
  size_archive: number;
  size_deleted: number;
  earliest_import_time: number;
  total_viewtime: number[];
  total_alternate_files: number;
  total_duplicate_files: number;
  total_potential_pairs: number;
}
