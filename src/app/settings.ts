import { HydrusSearchTags } from "./hydrus-tags";


export interface AppSettingsV1 {
  version: 1;
  browseSearchOnLoad: boolean;
  browseSearchWhenEmpty: boolean;
  browseDefaultSearchTags: HydrusSearchTags;
  favoriteTags: HydrusSearchTags;
  hyshareUrl: string;
  saucenaoApiKey: string;
  saucenaoSearchProxy: string;
  ipfsMultihashUrlPrefix: string;
  photopeaIntegration: boolean;
  sendDefaultPage: string;
  sendResetFormAfterSend: boolean;
  sendFixDiscordUrls: boolean;
  uploadFilenameTagService: string;
  mediaAutoplay: boolean;
  mediaLoop: boolean;
  mediaDefaultMuted: boolean;
}

export type AppSettingsStorage = AppSettingsV1;
export type AppSettings = Omit<AppSettingsStorage, "version">;

export const defaultAppSettings: AppSettings = {
  browseSearchOnLoad: true,
  browseSearchWhenEmpty: true,
  browseDefaultSearchTags: [],
  favoriteTags: [],
  hyshareUrl: '',
  saucenaoApiKey: '',
  saucenaoSearchProxy: '/__saucenao-search',
  ipfsMultihashUrlPrefix: 'https://ipfs.io/ipfs/',
  photopeaIntegration: false,
  sendDefaultPage: '',
  sendResetFormAfterSend: true,
  sendFixDiscordUrls: false,
  uploadFilenameTagService: '',
  mediaAutoplay: true,
  mediaLoop: true,
  mediaDefaultMuted: false,
}
