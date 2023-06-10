export enum HydrusServiceType {
  TAG_REPOSITORY = 0,
  FILE_REPOSITORY = 1,
  LOCAL_FILE_DOMAIN = 2,
  MESSAGE_DEPOT = 3,
  LOCAL_TAG = 5,
  LOCAL_RATING_NUMERICAL = 6,
  LOCAL_RATING_LIKE = 7,
  RATING_NUMERICAL_REPOSITORY = 8,
  RATING_LIKE_REPOSITORY = 9,
  COMBINED_TAG = 10,
  COMBINED_FILE = 11,
  LOCAL_BOORU = 12,
  IPFS = 13,
  LOCAL_FILE_TRASH_DOMAIN = 14,
  COMBINED_LOCAL_FILE = 15,
  TEST_SERVICE = 16,
  LOCAL_NOTES = 17,
  CLIENT_API_SERVICE = 18,
  COMBINED_DELETED_FILE = 19,
  LOCAL_FILE_UPDATE_DOMAIN = 20,
  COMBINED_LOCAL_MEDIA = 21,
  SERVER_ADMIN = 99,
  NULL_SERVICE = 100,
}

export const service_string_lookup: Record<HydrusServiceType, string> = {
  [HydrusServiceType.TAG_REPOSITORY]: 'hydrus tag repository',
  [HydrusServiceType.FILE_REPOSITORY]: 'hydrus file repository',
  [HydrusServiceType.LOCAL_FILE_DOMAIN]: 'local file domain',
  [HydrusServiceType.LOCAL_FILE_TRASH_DOMAIN]: 'local trash file domain',
  [HydrusServiceType.LOCAL_FILE_UPDATE_DOMAIN]: 'local update file domain',
  [HydrusServiceType.COMBINED_LOCAL_FILE]: 'virtual combined local file service',
  [HydrusServiceType.COMBINED_LOCAL_MEDIA]: 'virtual combined local media service',
  [HydrusServiceType.MESSAGE_DEPOT]: 'hydrus message depot',
  [HydrusServiceType.LOCAL_TAG]: 'local tag service',
  [HydrusServiceType.LOCAL_RATING_NUMERICAL]: 'local numerical rating service',
  [HydrusServiceType.LOCAL_RATING_LIKE]: 'local like/dislike rating service',
  [HydrusServiceType.RATING_NUMERICAL_REPOSITORY]: 'hydrus numerical rating repository',
  [HydrusServiceType.RATING_LIKE_REPOSITORY]: 'hydrus like/dislike rating repository',
  [HydrusServiceType.COMBINED_TAG]: 'virtual combined tag service',
  [HydrusServiceType.COMBINED_FILE]: 'virtual combined file service',
  [HydrusServiceType.LOCAL_BOORU]: 'client local booru',
  [HydrusServiceType.CLIENT_API_SERVICE]: 'client api',
  [HydrusServiceType.IPFS]: 'ipfs daemon',
  [HydrusServiceType.TEST_SERVICE]: 'test service',
  [HydrusServiceType.LOCAL_NOTES]: 'local file notes service',
  [HydrusServiceType.SERVER_ADMIN]: 'hydrus server administration service',
  [HydrusServiceType.COMBINED_DELETED_FILE]: 'virtual deleted file service',
  [HydrusServiceType.NULL_SERVICE]: 'null service'
}

export interface HydrusServiceSimple {
  name: string,
  type: HydrusServiceType,
  type_pretty: string
}

export interface HydrusService extends HydrusServiceSimple {
  service_key: string,
}

export interface HydrusServiceInfo {
  local_tags: HydrusService[]; // deprecated in v531
  tag_repositories: HydrusService[]; // deprecated in v531
  file_repositories: HydrusService[]; // deprecated in v531
  local_files: HydrusService[]; // deprecated in v531
  all_local_media: HydrusService[]; // deprecated in v531
  trash: HydrusService[]; // deprecated in v531
  local_updates: HydrusService[]; // deprecated in v531
  all_local_files: HydrusService[]; // deprecated in v531
  all_known_files: HydrusService[]; // deprecated in v531
  all_known_tags: HydrusService[]; // deprecated in v531
  services: HydrusServices; // added in v531
}

export interface HydrusServices {
  [service_key: string]: HydrusServiceSimple
}
