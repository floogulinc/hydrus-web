// Based on https://github.com/hydrusnetwork/hydrus/blob/master/hydrus/core/HydrusConstants.py

export enum HydrusFiletype {
  APPLICATION_HYDRUS_CLIENT_COLLECTION = 0,
  IMAGE_JPEG = 1,
  IMAGE_PNG = 2,
  ANIMATION_GIF = 3,
  IMAGE_BMP = 4,
  APPLICATION_FLASH = 5,
  APPLICATION_YAML = 6,
  IMAGE_ICON = 7,
  TEXT_HTML = 8,
  VIDEO_FLV = 9,
  APPLICATION_PDF = 10,
  APPLICATION_ZIP = 11,
  APPLICATION_HYDRUS_ENCRYPTED_ZIP = 12,
  AUDIO_MP3 = 13,
  VIDEO_MP4 = 14,
  AUDIO_OGG = 15,
  AUDIO_FLAC = 16,
  AUDIO_WMA = 17,
  VIDEO_WMV = 18,
  UNDETERMINED_WM = 19,
  VIDEO_MKV = 20,
  VIDEO_WEBM = 21,
  APPLICATION_JSON = 22,
  ANIMATION_APNG = 23,
  UNDETERMINED_PNG = 24,
  VIDEO_MPEG = 25,
  VIDEO_MOV = 26,
  VIDEO_AVI = 27,
  APPLICATION_HYDRUS_UPDATE_DEFINITIONS = 28,
  APPLICATION_HYDRUS_UPDATE_CONTENT = 29,
  TEXT_PLAIN = 30,
  APPLICATION_RAR = 31,
  APPLICATION_7Z = 32,
  IMAGE_WEBP = 33,
  IMAGE_TIFF = 34,
  APPLICATION_PSD = 35,
  AUDIO_M4A = 36,
  VIDEO_REALMEDIA = 37,
  AUDIO_REALMEDIA = 38,
  AUDIO_TRUEAUDIO = 39,
  GENERAL_AUDIO = 40,
  GENERAL_IMAGE = 41,
  GENERAL_VIDEO = 42,
  GENERAL_APPLICATION = 43,
  GENERAL_ANIMATION = 44,
  APPLICATION_CLIP = 45,
  AUDIO_WAVE = 46,
  VIDEO_OGV = 47,
  AUDIO_MKV = 48,
  AUDIO_MP4 = 49,
  UNDETERMINED_MP4 = 50,
  APPLICATION_CBOR = 51,
  APPLICATION_WINDOWS_EXE = 52,
  AUDIO_WAVPACK = 53,
  APPLICATION_SAI2 = 54,
  APPLICATION_KRITA = 55,
  IMAGE_SVG = 56,
  APPLICATION_XCF = 57,
  APPLICATION_GZIP = 58,
  GENERAL_APPLICATION_ARCHIVE = 59,
  GENERAL_IMAGE_PROJECT = 60,
  IMAGE_HEIF = 61,
  IMAGE_HEIF_SEQUENCE = 62,
  IMAGE_HEIC = 63,
  IMAGE_HEIC_SEQUENCE = 64,
  IMAGE_AVIF = 65,
  IMAGE_AVIF_SEQUENCE = 66,
  UNDETERMINED_GIF = 67,
  IMAGE_GIF = 68,
  APPLICATION_PROCREATE = 69,
  IMAGE_QOI = 70,
  APPLICATION_EPUB = 71,
  APPLICATION_DJVU = 72,
  APPLICATION_CBZ = 73,
  ANIMATION_UGOIRA = 74,
  APPLICATION_RTF = 75,
  APPLICATION_MICROSOFT_OPEN_XML_DOCX = 76,
  APPLICATION_MICROSOFT_OPEN_XML_XLSX = 77,
  APPLICATION_MICROSOFT_OPEN_XML_PPTX = 78,
  UNDETERMINED_OLE = 79,
  APPLICATION_DOC = 80,
  APPLICATION_XLS = 81,
  APPLICATION_PPT = 82,
  ANIMATION_WEBP = 83,
  UNDETERMINED_WEBP = 84,
  APPLICATION_OCTET_STREAM = 100,
  APPLICATION_UNKNOWN = 101
}

const searchableFileTypes = [
  HydrusFiletype.IMAGE_JPEG,
  HydrusFiletype.IMAGE_PNG,
  HydrusFiletype.ANIMATION_APNG,
  HydrusFiletype.IMAGE_GIF,
  HydrusFiletype.ANIMATION_GIF,
  HydrusFiletype.IMAGE_WEBP,
  HydrusFiletype.ANIMATION_WEBP,
  HydrusFiletype.IMAGE_TIFF,
  HydrusFiletype.IMAGE_QOI,
  HydrusFiletype.IMAGE_ICON,
  HydrusFiletype.IMAGE_SVG,
  HydrusFiletype.IMAGE_HEIF,
  HydrusFiletype.IMAGE_HEIF_SEQUENCE,
  HydrusFiletype.IMAGE_HEIC,
  HydrusFiletype.IMAGE_HEIC_SEQUENCE,
  HydrusFiletype.IMAGE_AVIF,
  HydrusFiletype.IMAGE_AVIF_SEQUENCE,
  HydrusFiletype.IMAGE_BMP,
  HydrusFiletype.ANIMATION_UGOIRA,
  HydrusFiletype.APPLICATION_FLASH,
  HydrusFiletype.VIDEO_AVI,
  HydrusFiletype.VIDEO_FLV,
  HydrusFiletype.VIDEO_MOV,
  HydrusFiletype.VIDEO_MP4,
  HydrusFiletype.VIDEO_MKV,
  HydrusFiletype.VIDEO_REALMEDIA,
  HydrusFiletype.VIDEO_WEBM,
  HydrusFiletype.VIDEO_OGV,
  HydrusFiletype.VIDEO_MPEG,
  HydrusFiletype.APPLICATION_CBZ,
  HydrusFiletype.APPLICATION_CLIP,
  HydrusFiletype.APPLICATION_PSD,
  HydrusFiletype.APPLICATION_SAI2,
  HydrusFiletype.APPLICATION_KRITA,
  HydrusFiletype.APPLICATION_XCF,
  HydrusFiletype.APPLICATION_PROCREATE,
  HydrusFiletype.APPLICATION_PDF,
  HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_DOCX,
  HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_XLSX,
  HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_PPTX,
  HydrusFiletype.APPLICATION_DOC,
  HydrusFiletype.APPLICATION_XLS,
  HydrusFiletype.APPLICATION_PPT,
  HydrusFiletype.APPLICATION_EPUB,
  HydrusFiletype.APPLICATION_DJVU,
  HydrusFiletype.APPLICATION_RTF,
  HydrusFiletype.APPLICATION_ZIP,
  HydrusFiletype.APPLICATION_RAR,
  HydrusFiletype.APPLICATION_7Z,
  HydrusFiletype.APPLICATION_GZIP,
  HydrusFiletype.AUDIO_M4A,
  HydrusFiletype.AUDIO_MP3,
  HydrusFiletype.AUDIO_REALMEDIA,
  HydrusFiletype.AUDIO_OGG,
  HydrusFiletype.AUDIO_FLAC,
  HydrusFiletype.AUDIO_WAVE,
  HydrusFiletype.AUDIO_TRUEAUDIO,
  HydrusFiletype.AUDIO_WMA,
  HydrusFiletype.VIDEO_WMV,
  HydrusFiletype.AUDIO_MKV,
  HydrusFiletype.AUDIO_MP4,
  HydrusFiletype.AUDIO_WAVPACK
]

const IMAGES = [
  HydrusFiletype.IMAGE_JPEG,
  HydrusFiletype.IMAGE_PNG,
  HydrusFiletype.IMAGE_GIF,
  HydrusFiletype.IMAGE_BMP,
  HydrusFiletype.IMAGE_WEBP,
  HydrusFiletype.IMAGE_TIFF,
  HydrusFiletype.IMAGE_QOI,
  HydrusFiletype.IMAGE_ICON,
  HydrusFiletype.IMAGE_HEIF,
  HydrusFiletype.IMAGE_HEIC,
  HydrusFiletype.IMAGE_AVIF,
]

const ANIMATIONS = [
  HydrusFiletype.ANIMATION_GIF,
  HydrusFiletype.ANIMATION_APNG,
  HydrusFiletype.ANIMATION_WEBP,
  HydrusFiletype.IMAGE_HEIF_SEQUENCE,
  HydrusFiletype.IMAGE_HEIC_SEQUENCE,
  HydrusFiletype.IMAGE_AVIF_SEQUENCE,
  HydrusFiletype.ANIMATION_UGOIRA
]

const VIEWABLE_ANIMATIONS = [
  HydrusFiletype.ANIMATION_GIF,
  HydrusFiletype.ANIMATION_APNG,
  HydrusFiletype.ANIMATION_WEBP,
  HydrusFiletype.IMAGE_HEIF_SEQUENCE,
  HydrusFiletype.IMAGE_HEIC_SEQUENCE,
  HydrusFiletype.IMAGE_AVIF_SEQUENCE,
  HydrusFiletype.ANIMATION_UGOIRA
]

const HEIF_TYPE_SEQUENCES = [
  HydrusFiletype.IMAGE_HEIF_SEQUENCE,
  HydrusFiletype.IMAGE_HEIC_SEQUENCE,
  HydrusFiletype.IMAGE_AVIF_SEQUENCE
]

const AUDIO = [
  HydrusFiletype.AUDIO_MP3,
  HydrusFiletype.AUDIO_OGG,
  HydrusFiletype.AUDIO_FLAC,
  HydrusFiletype.AUDIO_M4A,
  HydrusFiletype.AUDIO_MKV,
  HydrusFiletype.AUDIO_MP4,
  HydrusFiletype.AUDIO_REALMEDIA,
  HydrusFiletype.AUDIO_TRUEAUDIO,
  HydrusFiletype.AUDIO_WAVE,
  HydrusFiletype.AUDIO_WAVPACK,
  HydrusFiletype.AUDIO_WMA
]

const VIDEO = [
  HydrusFiletype.VIDEO_MP4,
  HydrusFiletype.VIDEO_WEBM,
  HydrusFiletype.VIDEO_MKV,
  HydrusFiletype.VIDEO_AVI,
  HydrusFiletype.VIDEO_FLV,
  HydrusFiletype.VIDEO_MOV,
  HydrusFiletype.VIDEO_MPEG,
  HydrusFiletype.VIDEO_OGV,
  HydrusFiletype.VIDEO_REALMEDIA,
  HydrusFiletype.VIDEO_WMV
]

const APPLICATIONS = [
  HydrusFiletype.APPLICATION_FLASH,
  HydrusFiletype.APPLICATION_PDF,
  HydrusFiletype.APPLICATION_EPUB,
  HydrusFiletype.APPLICATION_DJVU,
  HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_DOCX,
  HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_XLSX,
  HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_PPTX,
  HydrusFiletype.APPLICATION_DOC,
  HydrusFiletype.APPLICATION_XLS,
  HydrusFiletype.APPLICATION_PPT,
  HydrusFiletype.APPLICATION_RTF,
]

const IMAGE_PROJECT_FILES = [
  HydrusFiletype.APPLICATION_PSD,
  HydrusFiletype.APPLICATION_CLIP,
  HydrusFiletype.APPLICATION_SAI2,
  HydrusFiletype.APPLICATION_KRITA,
  HydrusFiletype.IMAGE_SVG,
  HydrusFiletype.APPLICATION_XCF,
  HydrusFiletype.APPLICATION_PROCREATE,
]

const ARCHIVES = [
  HydrusFiletype.APPLICATION_CBZ,
  HydrusFiletype.APPLICATION_7Z,
  HydrusFiletype.APPLICATION_GZIP,
  HydrusFiletype.APPLICATION_RAR,
  HydrusFiletype.APPLICATION_ZIP
]

const MIMES_WITH_THUMBNAILS = [
  ...IMAGES,
  ...ANIMATIONS,
  ...VIDEO,
  HydrusFiletype.IMAGE_SVG,
  HydrusFiletype.APPLICATION_PDF,
  HydrusFiletype.APPLICATION_FLASH,
  HydrusFiletype.APPLICATION_CLIP,
  HydrusFiletype.APPLICATION_PSD,
  HydrusFiletype.APPLICATION_KRITA,
  HydrusFiletype.APPLICATION_PROCREATE,
  HydrusFiletype.APPLICATION_CBZ,
  HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_PPTX
]

export function hasThumbnail(mime: HydrusFiletype) {
  return MIMES_WITH_THUMBNAILS.includes(mime);
}

export const mime_string_lookup: Record<HydrusFiletype, string> = {
  [HydrusFiletype.APPLICATION_HYDRUS_CLIENT_COLLECTION] : 'collection',
  [HydrusFiletype.IMAGE_JPEG] : 'jpeg',
  [HydrusFiletype.IMAGE_PNG] : 'png',
  [HydrusFiletype.ANIMATION_APNG] : 'apng',
  [HydrusFiletype.IMAGE_GIF] : 'static gif',
  [HydrusFiletype.ANIMATION_GIF] : 'animated gif',
  [HydrusFiletype.IMAGE_BMP] : 'bitmap',
  [HydrusFiletype.IMAGE_WEBP] : 'webp',
  [HydrusFiletype.ANIMATION_WEBP] : 'animated webp',
  [HydrusFiletype.IMAGE_TIFF] : 'tiff',
  [HydrusFiletype.IMAGE_QOI] : 'qoi',
  [HydrusFiletype.IMAGE_ICON] : 'icon',
  [HydrusFiletype.IMAGE_SVG] : 'svg',
  [HydrusFiletype.IMAGE_HEIF]: 'heif',
  [HydrusFiletype.IMAGE_HEIF_SEQUENCE]: 'heif sequence',
  [HydrusFiletype.IMAGE_HEIC]: 'heic',
  [HydrusFiletype.IMAGE_HEIC_SEQUENCE]: 'heic sequence',
  [HydrusFiletype.IMAGE_AVIF]: 'avif',
  [HydrusFiletype.IMAGE_AVIF_SEQUENCE]: 'avif sequence',
  [HydrusFiletype.ANIMATION_UGOIRA] : 'ugoira',
  [HydrusFiletype.APPLICATION_CBZ] : 'cbz',
  [HydrusFiletype.APPLICATION_FLASH] : 'flash',
  [HydrusFiletype.APPLICATION_OCTET_STREAM] : 'application/octet-stream',
  [HydrusFiletype.APPLICATION_YAML] : 'yaml',
  [HydrusFiletype.APPLICATION_JSON] : 'json',
  [HydrusFiletype.APPLICATION_CBOR] : 'cbor',
  [HydrusFiletype.APPLICATION_PDF] : 'pdf',
  [HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_DOCX] : 'docx',
  [HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_XLSX] : 'xlsx',
  [HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_PPTX] : 'pptx',
  [HydrusFiletype.APPLICATION_DOC] : 'doc',
  [HydrusFiletype.APPLICATION_XLS] : 'xls',
  [HydrusFiletype.APPLICATION_PPT] : 'ppt',
  [HydrusFiletype.APPLICATION_EPUB] : 'epub',
  [HydrusFiletype.APPLICATION_DJVU] : 'djvu',
  [HydrusFiletype.APPLICATION_RTF]: 'rtf',
  [HydrusFiletype.APPLICATION_PSD] : 'psd',
  [HydrusFiletype.APPLICATION_CLIP] : 'clip',
  [HydrusFiletype.APPLICATION_SAI2] : 'sai2',
  [HydrusFiletype.APPLICATION_KRITA] : 'krita',
  [HydrusFiletype.APPLICATION_XCF] : 'xcf',
  [HydrusFiletype.APPLICATION_PROCREATE] : 'procreate',
  [HydrusFiletype.APPLICATION_ZIP] : 'zip',
  [HydrusFiletype.APPLICATION_RAR] : 'rar',
  [HydrusFiletype.APPLICATION_7Z] : '7z',
  [HydrusFiletype.APPLICATION_GZIP] : 'gzip',
  [HydrusFiletype.APPLICATION_WINDOWS_EXE] : 'windows exe',
  [HydrusFiletype.APPLICATION_HYDRUS_ENCRYPTED_ZIP] : 'application/hydrus-encrypted-zip',
  [HydrusFiletype.APPLICATION_HYDRUS_UPDATE_CONTENT] : 'application/hydrus-update-content',
  [HydrusFiletype.APPLICATION_HYDRUS_UPDATE_DEFINITIONS] : 'application/hydrus-update-definitions',
  [HydrusFiletype.AUDIO_M4A] : 'm4a',
  [HydrusFiletype.AUDIO_MP3] : 'mp3',
  [HydrusFiletype.AUDIO_OGG] : 'ogg',
  [HydrusFiletype.AUDIO_FLAC] : 'flac',
  [HydrusFiletype.AUDIO_MKV] : 'matroska audio',
  [HydrusFiletype.AUDIO_MP4] : 'mp4 audio',
  [HydrusFiletype.AUDIO_WAVE] : 'wave',
  [HydrusFiletype.AUDIO_REALMEDIA] : 'realaudio',
  [HydrusFiletype.AUDIO_TRUEAUDIO] : 'tta',
  [HydrusFiletype.AUDIO_WMA] : 'wma',
  [HydrusFiletype.AUDIO_WAVPACK] : 'wavpack',
  [HydrusFiletype.TEXT_HTML] : 'html',
  [HydrusFiletype.TEXT_PLAIN] : 'plaintext',
  [HydrusFiletype.VIDEO_AVI] : 'avi',
  [HydrusFiletype.VIDEO_FLV] : 'flv',
  [HydrusFiletype.VIDEO_MOV] : 'quicktime',
  [HydrusFiletype.VIDEO_MP4] : 'mp4',
  [HydrusFiletype.VIDEO_MPEG] : 'mpeg',
  [HydrusFiletype.VIDEO_WMV] : 'wmv',
  [HydrusFiletype.VIDEO_MKV] : 'matroska',
  [HydrusFiletype.VIDEO_OGV] : 'ogv',
  [HydrusFiletype.VIDEO_REALMEDIA] : 'realvideo',
  [HydrusFiletype.VIDEO_WEBM] : 'webm',
  [HydrusFiletype.UNDETERMINED_WM] : 'wma or wmv',
  [HydrusFiletype.UNDETERMINED_MP4] : 'mp4 with or without audio',
  [HydrusFiletype.UNDETERMINED_PNG] : 'png or apng',
  [HydrusFiletype.UNDETERMINED_OLE] : 'ole file',
  [HydrusFiletype.UNDETERMINED_GIF] : 'animated or static gif',
  [HydrusFiletype.UNDETERMINED_WEBP] : 'animated or static webp',
  [HydrusFiletype.APPLICATION_UNKNOWN] : 'unknown filetype',
  [HydrusFiletype.GENERAL_APPLICATION] : 'application',
  [HydrusFiletype.GENERAL_APPLICATION_ARCHIVE] : 'archive',
  [HydrusFiletype.GENERAL_IMAGE_PROJECT] : 'image project file',
  [HydrusFiletype.GENERAL_AUDIO] : 'audio',
  [HydrusFiletype.GENERAL_IMAGE] : 'image',
  [HydrusFiletype.GENERAL_VIDEO] : 'video',
  [HydrusFiletype.GENERAL_ANIMATION] : 'animation'
}

const mime_mimetype_string_lookup: Record<HydrusFiletype, string> = {
  [HydrusFiletype.APPLICATION_HYDRUS_CLIENT_COLLECTION] : 'collection',
  [HydrusFiletype.IMAGE_JPEG] : 'image/jpeg',
  [HydrusFiletype.IMAGE_PNG] : 'image/png',
  [HydrusFiletype.ANIMATION_APNG] : 'image/apng',
  [HydrusFiletype.IMAGE_GIF] : 'image/gif',
  [HydrusFiletype.ANIMATION_GIF] : 'image/gif',
  [HydrusFiletype.IMAGE_BMP] : 'image/bmp',
  [HydrusFiletype.IMAGE_WEBP] : 'image/webp',
  [HydrusFiletype.ANIMATION_WEBP] : 'image/webp',
  [HydrusFiletype.IMAGE_TIFF] : 'image/tiff',
  [HydrusFiletype.IMAGE_QOI] : 'image/qoi',
  [HydrusFiletype.IMAGE_ICON] : 'image/x-icon',
  [HydrusFiletype.IMAGE_SVG] : 'image/svg+xml',
  [HydrusFiletype.IMAGE_HEIF]: 'image/heif',
  [HydrusFiletype.IMAGE_HEIF_SEQUENCE]: 'image/heif-sequence',
  [HydrusFiletype.IMAGE_HEIC]: 'image/heic',
  [HydrusFiletype.IMAGE_HEIC_SEQUENCE]: 'image/heic-sequence',
  [HydrusFiletype.IMAGE_AVIF]: 'image/avif',
  [HydrusFiletype.IMAGE_AVIF_SEQUENCE]: 'image/avif-sequence',
  [HydrusFiletype.ANIMATION_UGOIRA] : 'application/zip',
  [HydrusFiletype.APPLICATION_FLASH] : 'application/x-shockwave-flash',
  [HydrusFiletype.APPLICATION_OCTET_STREAM] : 'application/octet-stream',
  [HydrusFiletype.APPLICATION_CBZ] : 'application/vnd.comicbook+zip',
  [HydrusFiletype.APPLICATION_YAML] : 'application/x-yaml',
  [HydrusFiletype.APPLICATION_JSON] : 'application/json',
  [HydrusFiletype.APPLICATION_CBOR] : 'application/cbor',
  [HydrusFiletype.APPLICATION_PDF] : 'application/pdf',
  [HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_DOCX] : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  [HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_XLSX] : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  [HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_PPTX] : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  [HydrusFiletype.APPLICATION_DOC] : 'application/msword',
  [HydrusFiletype.APPLICATION_XLS] : 'application/vnd.ms-excel',
  [HydrusFiletype.APPLICATION_PPT] : 'application/vnd.ms-powerpoint',
  [HydrusFiletype.APPLICATION_EPUB] : 'application/epub+zip',
  [HydrusFiletype.APPLICATION_DJVU] : 'image/vnd.djvu',
  [HydrusFiletype.APPLICATION_RTF] : 'application/rtf',
  [HydrusFiletype.APPLICATION_PSD] : 'image/vnd.adobe.photoshop',
  [HydrusFiletype.APPLICATION_CLIP] : 'application/clip',
  [HydrusFiletype.APPLICATION_SAI2] : 'application/sai2',
  [HydrusFiletype.APPLICATION_KRITA]: 'application/x-krita',
  [HydrusFiletype.APPLICATION_XCF] : 'image/x-xcf',
  [HydrusFiletype.APPLICATION_PROCREATE] : 'application/x-procreate',
  [HydrusFiletype.APPLICATION_ZIP] : 'application/zip',
  [HydrusFiletype.APPLICATION_RAR] : 'application/vnd.rar',
  [HydrusFiletype.APPLICATION_7Z] : 'application/x-7z-compressed',
  [HydrusFiletype.APPLICATION_GZIP]: 'application/gzip',
  [HydrusFiletype.APPLICATION_WINDOWS_EXE] : 'application/octet-stream',
  [HydrusFiletype.APPLICATION_HYDRUS_ENCRYPTED_ZIP] : 'application/hydrus-encrypted-zip',
  [HydrusFiletype.APPLICATION_HYDRUS_UPDATE_CONTENT] : 'application/hydrus-update-content',
  [HydrusFiletype.APPLICATION_HYDRUS_UPDATE_DEFINITIONS] : 'application/hydrus-update-definitions',
  [HydrusFiletype.AUDIO_M4A] : 'audio/mp4',
  [HydrusFiletype.AUDIO_MP3] : 'audio/mp3',
  [HydrusFiletype.AUDIO_OGG] : 'audio/ogg',
  [HydrusFiletype.AUDIO_FLAC] : 'audio/flac',
  [HydrusFiletype.AUDIO_MKV] : 'audio/x-matroska',
  [HydrusFiletype.AUDIO_MP4] : 'audio/mp4',
  [HydrusFiletype.AUDIO_WAVE] : 'audio/x-wav',
  [HydrusFiletype.AUDIO_REALMEDIA] : 'audio/vnd.rn-realaudio',
  [HydrusFiletype.AUDIO_TRUEAUDIO] : 'audio/x-tta',
  [HydrusFiletype.AUDIO_WMA] : 'audio/x-ms-wma',
  [HydrusFiletype.AUDIO_WAVPACK] : 'audio/wavpack',
  [HydrusFiletype.TEXT_HTML] : 'text/html',
  [HydrusFiletype.TEXT_PLAIN] : 'text/plain',
  [HydrusFiletype.VIDEO_AVI] : 'video/x-msvideo',
  [HydrusFiletype.VIDEO_FLV] : 'video/x-flv',
  [HydrusFiletype.VIDEO_MOV] : 'video/quicktime',
  [HydrusFiletype.VIDEO_MP4] : 'video/mp4',
  [HydrusFiletype.VIDEO_MPEG] : 'video/mpeg',
  [HydrusFiletype.VIDEO_WMV] : 'video/x-ms-wmv',
  [HydrusFiletype.VIDEO_MKV] : 'video/x-matroska',
  [HydrusFiletype.VIDEO_OGV] : 'video/ogg',
  [HydrusFiletype.VIDEO_REALMEDIA] : 'video/vnd.rn-realvideo',
  [HydrusFiletype.VIDEO_WEBM] : 'video/webm',
  [HydrusFiletype.UNDETERMINED_OLE] : 'application/x-ole-storage',
  [HydrusFiletype.APPLICATION_UNKNOWN] : 'unknown filetype',
  [HydrusFiletype.GENERAL_APPLICATION] : 'application',
  [HydrusFiletype.GENERAL_APPLICATION_ARCHIVE] : 'archive',
  [HydrusFiletype.GENERAL_IMAGE_PROJECT] : 'image project file',
  [HydrusFiletype.GENERAL_AUDIO] : 'audio',
  [HydrusFiletype.GENERAL_IMAGE] : 'image',
  [HydrusFiletype.GENERAL_VIDEO] : 'video',
  [HydrusFiletype.GENERAL_ANIMATION] : 'animation',
  [HydrusFiletype.UNDETERMINED_WM] : 'audio/x-ms-wma or video/x-ms-wmv',
  [HydrusFiletype.UNDETERMINED_MP4] : 'audio/mp4 or video/mp4',
  [HydrusFiletype.UNDETERMINED_PNG] : 'image/png or image/apng',
  [HydrusFiletype.UNDETERMINED_GIF] : 'image/gif',
  [HydrusFiletype.UNDETERMINED_WEBP] : 'image/webp',
}

const mime_ext_lookup: Partial<Record<HydrusFiletype, string>> = {
  [HydrusFiletype.APPLICATION_HYDRUS_CLIENT_COLLECTION] : '.collection',
  [HydrusFiletype.IMAGE_JPEG] : '.jpg',
  [HydrusFiletype.IMAGE_PNG] : '.png',
  [HydrusFiletype.ANIMATION_APNG] : '.png',
  [HydrusFiletype.IMAGE_GIF] : '.gif',
  [HydrusFiletype.ANIMATION_GIF] : '.gif',
  [HydrusFiletype.IMAGE_BMP] : '.bmp',
  [HydrusFiletype.IMAGE_WEBP] : '.webp',
  [HydrusFiletype.ANIMATION_WEBP] : '.webp',
  [HydrusFiletype.IMAGE_TIFF] : '.tiff',
  [HydrusFiletype.IMAGE_QOI] : '.qoi',
  [HydrusFiletype.IMAGE_ICON] : '.ico',
  [HydrusFiletype.IMAGE_SVG] : '.svg',
  [HydrusFiletype.IMAGE_HEIF]: '.heif',
  [HydrusFiletype.IMAGE_HEIF_SEQUENCE]: '.heifs',
  [HydrusFiletype.IMAGE_HEIC]: '.heic',
  [HydrusFiletype.IMAGE_HEIC_SEQUENCE]: '.heics',
  [HydrusFiletype.IMAGE_AVIF]: '.avif',
  [HydrusFiletype.IMAGE_AVIF_SEQUENCE]: '.avifs',
  [HydrusFiletype.ANIMATION_UGOIRA] : '.zip',
  [HydrusFiletype.APPLICATION_CBZ] : '.cbz',
  [HydrusFiletype.APPLICATION_FLASH] : '.swf',
  [HydrusFiletype.APPLICATION_OCTET_STREAM] : '.bin',
  [HydrusFiletype.APPLICATION_YAML] : '.yaml',
  [HydrusFiletype.APPLICATION_JSON] : '.json',
  [HydrusFiletype.APPLICATION_PDF] : '.pdf',
  [HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_DOCX] : '.docx',
  [HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_XLSX] : '.xlsx',
  [HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_PPTX] : '.pptx',
  [HydrusFiletype.APPLICATION_DOC] : '.doc',
  [HydrusFiletype.APPLICATION_XLS] : '.xls',
  [HydrusFiletype.APPLICATION_PPT] : '.ppt',
  [HydrusFiletype.APPLICATION_EPUB] : '.epub',
  [HydrusFiletype.APPLICATION_DJVU] : '.djvu',
  [HydrusFiletype.APPLICATION_RTF] : '.rtf',
  [HydrusFiletype.APPLICATION_PSD] : '.psd',
  [HydrusFiletype.APPLICATION_CLIP] : '.clip',
  [HydrusFiletype.APPLICATION_SAI2] : '.sai2',
  [HydrusFiletype.APPLICATION_KRITA]: '.kra',
  [HydrusFiletype.APPLICATION_XCF] : '.xcf',
  [HydrusFiletype.APPLICATION_PROCREATE] : '.procreate',
  [HydrusFiletype.APPLICATION_ZIP] : '.zip',
  [HydrusFiletype.APPLICATION_RAR] : '.rar',
  [HydrusFiletype.APPLICATION_7Z] : '.7z',
  [HydrusFiletype.APPLICATION_GZIP]: '.gz',
  [HydrusFiletype.APPLICATION_WINDOWS_EXE] : '.exe',
  [HydrusFiletype.APPLICATION_HYDRUS_ENCRYPTED_ZIP] : '.zip.encrypted',
  [HydrusFiletype.APPLICATION_HYDRUS_UPDATE_CONTENT] : '',
  [HydrusFiletype.APPLICATION_HYDRUS_UPDATE_DEFINITIONS] : '',
  [HydrusFiletype.AUDIO_M4A] : '.m4a',
  [HydrusFiletype.AUDIO_MP3] : '.mp3',
  [HydrusFiletype.AUDIO_MKV] : '.mkv',
  [HydrusFiletype.AUDIO_MP4] : '.mp4',
  [HydrusFiletype.AUDIO_OGG] : '.ogg',
  [HydrusFiletype.AUDIO_REALMEDIA] : '.ra',
  [HydrusFiletype.AUDIO_FLAC] : '.flac',
  [HydrusFiletype.AUDIO_WAVE] : '.wav',
  [HydrusFiletype.AUDIO_TRUEAUDIO] : '.tta',
  [HydrusFiletype.AUDIO_WMA] : '.wma',
  [HydrusFiletype.AUDIO_WAVPACK] : '.wv',
  [HydrusFiletype.TEXT_HTML] : '.html',
  [HydrusFiletype.TEXT_PLAIN] : '.txt',
  [HydrusFiletype.VIDEO_AVI] : '.avi',
  [HydrusFiletype.VIDEO_FLV] : '.flv',
  [HydrusFiletype.VIDEO_MOV] : '.mov',
  [HydrusFiletype.VIDEO_MP4] : '.mp4',
  [HydrusFiletype.VIDEO_MPEG] : '.mpeg',
  [HydrusFiletype.VIDEO_WMV] : '.wmv',
  [HydrusFiletype.VIDEO_MKV] : '.mkv',
  [HydrusFiletype.VIDEO_OGV] : '.ogv',
  [HydrusFiletype.VIDEO_REALMEDIA] : '.rm',
  [HydrusFiletype.VIDEO_WEBM] : '.webm',
  [HydrusFiletype.APPLICATION_UNKNOWN] : ''
}

const mime_enum_lookup: Record<string, HydrusFiletype> = {
  'collection' : HydrusFiletype.APPLICATION_HYDRUS_CLIENT_COLLECTION,
  'image/jpe' : HydrusFiletype.IMAGE_JPEG,
  'image/jpeg' : HydrusFiletype.IMAGE_JPEG,
  'image/jpg' : HydrusFiletype.IMAGE_JPEG,
  'image/x-png' : HydrusFiletype.IMAGE_PNG,
  'image/png' : HydrusFiletype.IMAGE_PNG,
  'image/apng' : HydrusFiletype.ANIMATION_APNG,
  'image/gif' : HydrusFiletype.ANIMATION_GIF,
  'image/bmp' : HydrusFiletype.IMAGE_BMP,
  'image/webp' : HydrusFiletype.IMAGE_WEBP,
  'image/tiff' : HydrusFiletype.IMAGE_TIFF,
  'image/qoi' : HydrusFiletype.IMAGE_QOI,
  'image/x-icon' : HydrusFiletype.IMAGE_ICON,
  'image/svg+xml': HydrusFiletype.IMAGE_SVG,
  'image/heif' : HydrusFiletype.IMAGE_HEIF,
  'image/heif-sequence' : HydrusFiletype.IMAGE_HEIF_SEQUENCE,
  'image/heic' : HydrusFiletype.IMAGE_HEIC,
  'image/heic-sequence' : HydrusFiletype.IMAGE_HEIC_SEQUENCE,
  'image/avif' : HydrusFiletype.IMAGE_AVIF,
  'image/avif-sequence' : HydrusFiletype.IMAGE_AVIF_SEQUENCE,
  'image/vnd.microsoft.icon' : HydrusFiletype.IMAGE_ICON,
  'image' : HydrusFiletype.GENERAL_IMAGE,
  'application/x-shockwave-flash' : HydrusFiletype.APPLICATION_FLASH,
  'application/x-photoshop' : HydrusFiletype.APPLICATION_PSD,
  'image/vnd.adobe.photoshop' : HydrusFiletype.APPLICATION_PSD,
  'application/vnd.adobe.photoshop' : HydrusFiletype.APPLICATION_PSD,
  'application/clip' : HydrusFiletype.APPLICATION_CLIP,
  'application/sai2': HydrusFiletype.APPLICATION_SAI2,
  'application/x-krita': HydrusFiletype.APPLICATION_KRITA,
  'application/x-procreate': HydrusFiletype.APPLICATION_PROCREATE,
  'image/x-xcf' : HydrusFiletype.APPLICATION_XCF,
  'application/octet-stream' : HydrusFiletype.APPLICATION_OCTET_STREAM,
  'application/x-yaml' : HydrusFiletype.APPLICATION_YAML,
  'PDF document' : HydrusFiletype.APPLICATION_PDF,
  'application/pdf' : HydrusFiletype.APPLICATION_PDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_DOCX,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_XLSX,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation' : HydrusFiletype.APPLICATION_MICROSOFT_OPEN_XML_PPTX,
  'application/msword' : HydrusFiletype.APPLICATION_DOC,
  'application/vnd.ms-word' : HydrusFiletype.APPLICATION_DOC,
  'application/vnd.ms-excel' : HydrusFiletype.APPLICATION_XLS,
  'application/msexcel' : HydrusFiletype.APPLICATION_XLS,
  'application/vnd.ms-powerpoint' : HydrusFiletype.APPLICATION_PPT,
  'application/powerpoint' : HydrusFiletype.APPLICATION_PPT,
  'application/mspowerpoint' : HydrusFiletype.APPLICATION_PPT,
  'application/epub+zip' : HydrusFiletype.APPLICATION_EPUB,
  'image/vnd.djvu' : HydrusFiletype.APPLICATION_DJVU,
  'image/vnd.djvu+multipage' : HydrusFiletype.APPLICATION_DJVU,
  'image/x-djvu' : HydrusFiletype.APPLICATION_DJVU,
  'text/rtf' : HydrusFiletype.APPLICATION_RTF,
  'application/rtf': HydrusFiletype.APPLICATION_RTF,
  'application/vnd.comicbook+zip': HydrusFiletype.APPLICATION_CBZ,
  'application/zip' : HydrusFiletype.APPLICATION_ZIP,
  'application/vnd.rar' : HydrusFiletype.APPLICATION_RAR,
  'application/x-7z-compressed' : HydrusFiletype.APPLICATION_7Z,
  'application/gzip': HydrusFiletype.APPLICATION_GZIP,
  'application/json' : HydrusFiletype.APPLICATION_JSON,
  'application/cbor': HydrusFiletype.APPLICATION_CBOR,
  'application/hydrus-encrypted-zip' : HydrusFiletype.APPLICATION_HYDRUS_ENCRYPTED_ZIP,
  'application/hydrus-update-content' : HydrusFiletype.APPLICATION_HYDRUS_UPDATE_CONTENT,
  'application/hydrus-update-definitions' : HydrusFiletype.APPLICATION_HYDRUS_UPDATE_DEFINITIONS,
  'application' : HydrusFiletype.GENERAL_APPLICATION,
  'audio/mp4' : HydrusFiletype.AUDIO_M4A,
  'audio/mp3' : HydrusFiletype.AUDIO_MP3,
  'audio/ogg' : HydrusFiletype.AUDIO_OGG,
  'audio/vnd.rn-realaudio' : HydrusFiletype.AUDIO_REALMEDIA,
  'audio/x-tta' : HydrusFiletype.AUDIO_TRUEAUDIO,
  'audio/flac' : HydrusFiletype.AUDIO_FLAC,
  'audio/x-wav' : HydrusFiletype.AUDIO_WAVE,
  'audio/wav' : HydrusFiletype.AUDIO_WAVE,
  'audio/wave' : HydrusFiletype.AUDIO_WAVE,
  'audio/x-ms-wma' : HydrusFiletype.AUDIO_WMA,
  'audio/wavpack' : HydrusFiletype.AUDIO_WAVPACK,
  'text/html' : HydrusFiletype.TEXT_HTML,
  'text/plain' : HydrusFiletype.TEXT_PLAIN,
  'video/x-msvideo' : HydrusFiletype.VIDEO_AVI,
  'video/x-flv' : HydrusFiletype.VIDEO_FLV,
  'video/quicktime' : HydrusFiletype.VIDEO_MOV,
  'video/mp4' : HydrusFiletype.VIDEO_MP4,
  'video/mpeg' : HydrusFiletype.VIDEO_MPEG,
  'video/x-ms-wmv' : HydrusFiletype.VIDEO_WMV,
  'video/x-matroska' : HydrusFiletype.VIDEO_MKV,
  'video/ogg' : HydrusFiletype.VIDEO_OGV,
  'video/vnd.rn-realvideo' : HydrusFiletype.VIDEO_REALMEDIA,
  'application/vnd.rn-realmedia' : HydrusFiletype.VIDEO_REALMEDIA,
  'video/webm' : HydrusFiletype.VIDEO_WEBM,
  'video' : HydrusFiletype.GENERAL_VIDEO,
  'application/x-ole-storage' : HydrusFiletype.UNDETERMINED_OLE,
  'unknown filetype' : HydrusFiletype.APPLICATION_UNKNOWN
}

const filetypeCategories: {generalFiletype: HydrusFiletype, filetypes: HydrusFiletype[]}[] = [
  {
    generalFiletype: HydrusFiletype.GENERAL_IMAGE,
    filetypes: IMAGES
  },
  {
    generalFiletype: HydrusFiletype.GENERAL_ANIMATION,
    filetypes: ANIMATIONS
  },
  {
    generalFiletype: HydrusFiletype.GENERAL_VIDEO,
    filetypes: VIDEO
  },
  {
    generalFiletype: HydrusFiletype.GENERAL_AUDIO,
    filetypes: AUDIO
  },
  {
    generalFiletype: HydrusFiletype.GENERAL_APPLICATION,
    filetypes: APPLICATIONS
  },
  {
    generalFiletype: HydrusFiletype.GENERAL_IMAGE_PROJECT,
    filetypes: IMAGE_PROJECT_FILES
  },
  {
    generalFiletype: HydrusFiletype.GENERAL_APPLICATION_ARCHIVE,
    filetypes: ARCHIVES
  },
]

export const searchFiletypeCategories = filetypeCategories.map(({generalFiletype, filetypes}) => ({
  name: mime_string_lookup[generalFiletype],
  filetypes: filetypes.map(filetype => mime_string_lookup[filetype])
}))

export const searchFiletypes = searchableFileTypes.map(ft => ({
  mime: mime_mimetype_string_lookup[ft],
  name: mime_string_lookup[ft]
}))

export function filetypeFromMime(mime: string) {
  return mime_enum_lookup[mime] ?? HydrusFiletype.APPLICATION_UNKNOWN;
}


const renderableFiletypes = [
  ...IMAGES,
  HydrusFiletype.APPLICATION_PSD
]

const renderableFiletypes548 = [
  ...IMAGES,
  HydrusFiletype.APPLICATION_PSD,
  HydrusFiletype.APPLICATION_KRITA
]

export function isFileHydrusRenderable(mime: HydrusFiletype, hydrusVersion?: number) {
  if(hydrusVersion && hydrusVersion >= 548) {
    return renderableFiletypes548.includes(mime);
  }
  return renderableFiletypes.includes(mime);
}

