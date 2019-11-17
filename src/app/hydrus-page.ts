export interface HydrusPageSimple {
  name: string;
  page_key: string;
  page_type: 1 | 2 | 3 | 5 | 6 | 7 | 8 | 9 | 10;
}

export interface HydrusPageListItem extends HydrusPageSimple {
  focused: boolean;
  pages?: HydrusPageListItem[]
}

export interface HydrusPage extends HydrusPageSimple {
  management?: any;
  media?: {
    num_files: number;
    hash_ids: number[];
    hashes?: string[];
  }
}

