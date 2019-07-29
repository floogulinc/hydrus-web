export class TagUtils {
    public static getNamespace(tag: string) : string {
        if (!tag.includes(":")) return "";
        return tag.split(':')[0].replace(/\s+/g, '-').toLowerCase();
    }
}