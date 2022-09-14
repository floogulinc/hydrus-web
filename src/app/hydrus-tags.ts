
export interface HydrusTagSearchTag {
  value: string,
  count: number
}

export type HydrusSearchTags = (string | HydrusSearchTags)[];
