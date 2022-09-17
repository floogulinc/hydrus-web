import { HydrusSearchTags } from "./hydrus-tags";

export interface AppSettingsV1 {
  version: 1;

  browseSearchOnLoad: boolean;
  browseSearchWhenEmpty: boolean;
  browseDefaultSearchTags: HydrusSearchTags;
}

export type AppSettings = AppSettingsV1;

export const defaultAppSettings: AppSettings = {
  version: 1,
  browseSearchOnLoad: true,
  browseSearchWhenEmpty: true,
  browseDefaultSearchTags: []
}
