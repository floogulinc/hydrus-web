export interface AppSettingsV1 {
  version: 1;

  browseSearchOnLoad: boolean;
  browseDefaultSearchTags: string[];
}

export type AppSettings = AppSettingsV1;

export const defaultAppSettings: AppSettings = {
  version: 1,
  browseSearchOnLoad: true,
  browseDefaultSearchTags: []
}
