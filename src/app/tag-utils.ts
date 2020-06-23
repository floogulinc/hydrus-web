import { HydrusFile } from './hydrus-file';

export class TagUtils {
    public static getNamespace(tag: string) : string {
        if (!tag?.includes(":")) return "";
        return tag.split(':')[0].toLowerCase();
    }

    public static getNamespaceNoSpace(tag: string) : string {
      if (!tag?.includes(":")) return "";
      return tag.split(':')[0].replace(/\s+/g, '-').toLowerCase();
  }

    public static tagsFromFile(file: HydrusFile): string[] {
      return '0' in file.service_names_to_statuses_to_tags['all known tags'] ? file.service_names_to_statuses_to_tags['all known tags']['0'] : [];
    }

    public static namespaceTagFromFile(file: HydrusFile, namespace: string): string {
      return TagUtils.tagsFromFile(file).find(a => TagUtils.getNamespace(a) === namespace)
    }

    public static getTagValue(tag: string) {
      if (!tag?.includes(":")) return tag;
      return tag.split(':')[1].toLowerCase();
    }

}
