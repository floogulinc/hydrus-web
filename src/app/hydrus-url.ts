export interface HydrusURLFile {
  status: 0 | 2 | 3;
  hash: string;
  note: string;
}

export interface HydrusURLFiles {
  normalised_url: string;
  url_file_statuses: HydrusURLFile[];
}

export interface HydrusURLInfo {
  normalised_url: string;
  url_type: 0 | 2 | 3 | 4 | 5;
  url_type_string: string;
  match_name: string;
  can_parse: boolean;
}

export interface HydrusURLServiceNamesToTags {
  [service: string]: string[];
}

export interface HydrusAddURLResponse {
  human_result_text: string;
  normalised_url: string;
}
