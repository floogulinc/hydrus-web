import { HydrusSearchTags } from "./hydrus-tags";


export interface AppSettingsV1 {
  version: 1;
  browseSearchOnLoad: boolean;
  browseSearchWhenEmpty: boolean;
  browseDefaultSearchTags: HydrusSearchTags;
  hyshareUrl: string;
  saucenaoApiKey: string;
  saucenaoSearchProxy: string;
  ipfsMultihashUrlPrefix: string;
}

export type AppSettingsStorage = AppSettingsV1;
export type AppSettings = Omit<AppSettingsStorage, "version">;

export const defaultAppSettings: AppSettings = {
  browseSearchOnLoad: true,
  browseSearchWhenEmpty: true,
  browseDefaultSearchTags: [],
  hyshareUrl: '',
  saucenaoApiKey: '',
  saucenaoSearchProxy: '/__saucenao-search',
  ipfsMultihashUrlPrefix: 'https://ipfs.io/ipfs/'
}
