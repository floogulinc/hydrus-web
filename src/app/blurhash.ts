import { Pipe, PipeTransform } from "@angular/core";
import { decodeBlurHash, getBlurHashAverageColor } from "fast-blurhash";


@Pipe({
  name: 'blurhashcolor'
})
export class BlurHashColorPipe implements PipeTransform {

  transform(value: string) {
    const color = getBlurHashAverageColor(value);
    return `rgb(${color.join(',')})`
  }

}
