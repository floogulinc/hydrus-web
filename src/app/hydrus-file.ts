import { HydrusURLInfo } from "./hydrus-url";

export interface ServiceNamesToStatusesToTags {
  [service: string]: {
    [status: string]: string[];
  };
}

export interface FileFileServices {
  [service_id: string]: {
    time_imported?: number;
    time_deleted?: number;
  };
}

export interface HydrusNotes {
  [name: string]: string;
}

export interface HydrusBasicFileFromAPI {
  file_id: number;
  hash: string;
  size: number;
  mime: string;
  ext: string;
  width: number;
  height: number;
  duration?: number;
  has_audio: boolean;
  num_frames?: number;
  num_words?: number;
}

export interface HydrusFileFromAPI extends HydrusBasicFileFromAPI {
  known_urls: string[];
  file_services: {
    current?: FileFileServices;
    deleted?: FileFileServices;
  };
  time_modified: number;
  service_names_to_statuses_to_tags: ServiceNamesToStatusesToTags;
  service_names_to_statuses_to_display_tags: ServiceNamesToStatusesToTags;
  service_keys_to_statuses_to_tags: ServiceNamesToStatusesToTags;
  service_keys_to_statuses_to_display_tags: ServiceNamesToStatusesToTags;
  is_inbox: boolean;
  is_local: boolean;
  is_trashed: boolean;

  notes?: HydrusNotes;

  detailed_known_urls?: HydrusURLInfo[];

  ipfs_multihashes?: Record<string, string>;
}

export interface HydrusFile extends HydrusFileFromAPI, HydrusBasicFile {

}

export interface HydrusBasicFile extends HydrusBasicFileFromAPI {
  file_url: string;
  thumbnail_url: string;
  file_type: HydrusFileType;
}

export interface HydrusFileList {
    [fileId: number]: HydrusFile;
}

export enum HydrusFileType {
  Image,
  Video,
  Audio,
  Flash,
  Unsupported
}

export enum TagStatus {
  Current = 0,
  Pending = 1,
  Deleted = 2,
  Petitioned = 3,
}

export function type(mime: string): HydrusFileType {
  if ([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/apng',
    'image/gif',
    'image/bmp',
    'image/webp'
  ].includes(mime)) {
    return HydrusFileType.Image;
  }
  if ([
    'video/mp4',
    'video/webm',
    'video/x-matroska',
    'video/quicktime',
  ].includes(mime)) {
    return HydrusFileType.Video;
  }
  if ([
    'audio/mp3',
    'audio/ogg',
    'audio/flac',
    'audio/x-wav',
  ].includes(mime)) {
    return HydrusFileType.Audio;
  }
  if ([
    'video/x-flv',
    'application/x-shockwave-flash'
  ].includes(mime)) {
    return HydrusFileType.Flash;
  }
  return HydrusFileType.Unsupported;
}
