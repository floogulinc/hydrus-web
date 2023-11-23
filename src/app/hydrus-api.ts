import { RequireAtLeastOne } from "type-fest";

export interface HydrusKeyVerificationData {
  basic_permissions: number[];
  human_description: string;
}

export type HydrusRequestFiles = RequireAtLeastOne<{
  hash: string,
  hashes: string[],
  file_id: number,
  file_ids: number[]
}, 'hash' | 'hashes' | 'file_id' | 'file_ids'>


export type HydrusRequestSingleFile = RequireAtLeastOne<{
  hash: string,
  file_id: number,
}, 'hash' | 'file_id' >

export type HydrusRequestFileDomain = {
  file_service_key?: string,
  file_service_keys?: string[],
  deleted_file_service_key?: string,
  deleted_file_service_keys?: string[]
}
