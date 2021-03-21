export interface ServiceNamesToStatusesToTags {
  [service: string]: {
    [status: string]: string[];
  };
}


export interface HydrusFileFromAPI {
  file_id: number;
  hash: string;
  size: number;
  mime: string;
  ext: string;
  width: number;
  height: number;
  has_audio: boolean;
  known_urls: string[];
  duration?: number | null;
  num_frames?: number | null;
  num_words?: number | null;
  service_names_to_statuses_to_tags: ServiceNamesToStatusesToTags;
  service_names_to_statuses_to_display_tags: ServiceNamesToStatusesToTags;  // Hydrus 419+
  is_inbox: boolean;
  is_local: boolean;
  is_trashed: boolean;
}

export interface HydrusFile extends HydrusFileFromAPI {
    file_url?: string;
    thumbnail_url?: string;
    file_type?: HydrusFileType;
    has_thumbnail?: boolean;
}

export interface HydrusFileList {
    [fileId: number]: HydrusFile;
}

export enum HydrusFileType {
  Image,
  Video,
  Flash,
  Unsupported
}
