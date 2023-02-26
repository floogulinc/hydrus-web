export enum HydrusPageType {
  GalleryDownloader = 1,
  SimpleDownloader = 2,
  HardDriveImport = 3,
  Petitions = 5,
  FileSearch = 6,
  URLDownloader = 7,
  Duplicates = 8,
  ThreadWatcher = 9,
  PageOfPages = 10,
}

export enum HydrusPageState {
  Ready = 0,
  Initializing = 1,
  Loading = 2,
  Cancelled = 3,
}

export interface HydrusPageSimple {
  name: string;
  page_key: string;
  page_type: HydrusPageType;
  page_state: HydrusPageState;
}

export interface HydrusPageListItem extends HydrusPageSimple {
  selected: boolean;
  pages?: HydrusPageListItem[];
}

export interface HydrusPage extends HydrusPageSimple {
  management?: any;
  media?: {
    num_files: number;
    hash_ids: number[];
    hashes?: string[];
  };
}

