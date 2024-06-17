export enum HydrusPageState {
  Normal = 0,
  Initializing = 1,
  Searching = 2,
  SearchCanceled = 3
}

export enum HydrusPageType {
  ImportGallery = 1,
  ImportSimpleDownloader = 2,
  ImportHDD = 3,
  Petitions = 5,
  FileSearch = 6,
  ImportURLs = 7,
  Duplicates = 8,
  ImportWatcher = 9,
  PageOfPages = 10
}

export interface HydrusPageSimple {
  name: string;
  page_key: string;
  page_type: HydrusPageType;
  page_state: HydrusPageState
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

