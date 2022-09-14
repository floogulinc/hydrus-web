import { HydrusFile, ServiceNamesToStatusesToTags } from '../hydrus-file';

export class TagUtils {
  public static getNamespace(tag: string): string {
    if (!tag?.includes(':')) { return ''; }
    if (tag.startsWith('-')) {
      tag = tag.substring(1);
    }
    return tag.split(':')[0].toLowerCase();
  }

  public static getNamespaceNoSpace(tag: string): string {
    if (!tag?.includes(':')) { return ''; }
    if (tag.startsWith('-')) {
      tag = tag.substring(1);
    }
    return tag.split(':')[0].replace(/\s+/g, '-').toLowerCase();
  }

  public static tagsObjectFromFile(file: HydrusFile): ServiceNamesToStatusesToTags {
    return file.service_names_to_statuses_to_display_tags ?? file.service_names_to_statuses_to_tags;
  }


  public static AllTagsFromFile(file: HydrusFile): string[] {
    return this.allKnownTags(this.tagsObjectFromFile(file));
  }

  static allKnownTags(serviceNamesTostatusesToTags: ServiceNamesToStatusesToTags) {
    if (serviceNamesTostatusesToTags
      && 'all known tags' in serviceNamesTostatusesToTags
      && '0' in serviceNamesTostatusesToTags['all known tags']) {
      return serviceNamesTostatusesToTags['all known tags']['0'];
    } else {
      return [];
    }
  }

  public static namespaceTagFromFile(file: HydrusFile, namespace: string): string {
    return TagUtils.AllTagsFromFile(file).find(a => TagUtils.getNamespace(a) === namespace);
  }

  public static getTagValue(tag: string) {
    if (!tag) {
      return tag;
    }
    if (tag.startsWith('-')) {
      tag = tag.substring(1);
    }
    if (!tag.includes(':')) { return tag; }
    return tag.split(':')[1].toLowerCase();
  }

}
