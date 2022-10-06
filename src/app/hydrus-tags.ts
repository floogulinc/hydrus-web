
export interface HydrusTagSearchTag {
  value: string,
  count: number
}

export type HydrusSearchTags = (string | HydrusSearchTags)[];

export type TagDisplayType = 'storage' | 'display';
