import { HydrusBasicFile } from "./hydrus-file";
import { HydrusFiletype } from "./hydrus-file-mimes";
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
    HydrusFiletype.IMAGE_JPEG,
    HydrusFiletype.IMAGE_PNG,
    HydrusFiletype.ANIMATION_APNG,
    HydrusFiletype.IMAGE_GIF,
    HydrusFiletype.ANIMATION_GIF,
    HydrusFiletype.IMAGE_BMP,
    HydrusFiletype.IMAGE_WEBP,
    HydrusFiletype.APPLICATION_PSD,
    HydrusFiletype.APPLICATION_CLIP,
    HydrusFiletype.IMAGE_TIFF,
    HydrusFiletype.IMAGE_ICON,
    HydrusFiletype.APPLICATION_KRITA,
    HydrusFiletype.IMAGE_SVG,
  ].includes(file.file_type)
}

export function getPhotopeaUrlForFile(file: HydrusBasicFile) {
  return generatePhotopeaUrl({files:[file.file_url]});
}
