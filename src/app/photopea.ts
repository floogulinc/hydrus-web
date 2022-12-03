import { HydrusBasicFile } from "./hydrus-file";
import { RecursiveArray } from "./utils/array-utils";

const photopeaBaseUrl = 'https://www.photopea.com/'

interface PhotopeaUrlData {
	files?: string[];
	resources?: string[];
  server?: {
    version: number;
    url: string;
    formats: string[]
  }
	environment?: {
    theme?: number;
    lang?: string;
    vmode?: 0 | 1 | 2;
    intro?: boolean;
    eparams?: Record<string, any>;
    customIO?: "new" | "open" | "openFromURL" | "takePic" | "showTemplates" | "save" | "saveAsPSD" | "publishOnline" | "exportLayers";
    localsave?: boolean;
    autosave?: number;
    showtools?: number[]
    menus?: RecursiveArray<number>;
    panels?: number[];
    phrases?: ([number, number] | string)[]
    topt?: Record<string, any>;
    tmnu?: Record<string, any>;
    icons?: Record<string, string>;
    plugins?: {
      name: string;
      url: string;
      icon: string;
    }[];
  }
	script?: string;
}

function generatePhotopeaUrl(data: PhotopeaUrlData) {
  return encodeURI(`${photopeaBaseUrl}#${JSON.stringify(data)}`);
}

export function canOpenInPhotopea(file: HydrusBasicFile) {
  return [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/apng',
    'image/gif',
    'image/bmp',
    'image/webp',
    'application/x-photoshop',
    'application/clip'
  ].includes(file.mime)
}

export function getPhotopeaUrlForFile(file: HydrusBasicFile) {
  return generatePhotopeaUrl({files:[file.file_url]});
}
