import {
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  SchemeContent,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
  argbFromHex,
  argbFromRgb,
  hexFromArgb
} from "@material/material-color-utilities";

const SYS_TOKEN_PREFIX = 'sys'

export const materialDynamicColors = [
  MaterialDynamicColors.background,
  MaterialDynamicColors.onBackground,
  MaterialDynamicColors.surface,
  MaterialDynamicColors.surfaceDim,
  MaterialDynamicColors.surfaceBright,
  MaterialDynamicColors.surfaceContainerLowest,
  MaterialDynamicColors.surfaceContainerLow,
  MaterialDynamicColors.surfaceContainer,
  MaterialDynamicColors.surfaceContainerHigh,
  MaterialDynamicColors.surfaceContainerHighest,
  MaterialDynamicColors.onSurface,
  MaterialDynamicColors.surfaceVariant,
  MaterialDynamicColors.onSurfaceVariant,
  MaterialDynamicColors.inverseSurface,
  MaterialDynamicColors.inverseOnSurface,
  MaterialDynamicColors.outline,
  MaterialDynamicColors.outlineVariant,
  MaterialDynamicColors.shadow,
  MaterialDynamicColors.scrim,
  MaterialDynamicColors.surfaceTint,
  MaterialDynamicColors.primary,
  MaterialDynamicColors.onPrimary,
  MaterialDynamicColors.primaryContainer,
  MaterialDynamicColors.onPrimaryContainer,
  MaterialDynamicColors.inversePrimary,
  MaterialDynamicColors.secondary,
  MaterialDynamicColors.onSecondary,
  MaterialDynamicColors.secondaryContainer,
  MaterialDynamicColors.onSecondaryContainer,
  MaterialDynamicColors.tertiary,
  MaterialDynamicColors.onTertiary,
  MaterialDynamicColors.tertiaryContainer,
  MaterialDynamicColors.onTertiaryContainer,
  MaterialDynamicColors.error,
  MaterialDynamicColors.onError,
  MaterialDynamicColors.errorContainer,
  MaterialDynamicColors.onErrorContainer,
  MaterialDynamicColors.primaryFixed,
  MaterialDynamicColors.primaryFixedDim,
  MaterialDynamicColors.onPrimaryFixed,
  MaterialDynamicColors.onPrimaryFixedVariant,
  MaterialDynamicColors.secondaryFixed,
  MaterialDynamicColors.secondaryFixedDim,
  MaterialDynamicColors.onSecondaryFixed,
  MaterialDynamicColors.onSecondaryFixedVariant,
  MaterialDynamicColors.tertiaryFixed,
  MaterialDynamicColors.tertiaryFixedDim,
  MaterialDynamicColors.onTertiaryFixed,
  MaterialDynamicColors.onTertiaryFixedVariant,
];


export function generateThemeFromHex(hex: string, variant?: Variant, contrast?: number) {
  return newThemeFromHct(Hct.fromInt(argbFromHex(hex)), variant, contrast);
}

export function generateThemeFromRGB(rgb: [number, number, number]) {
  return newThemeFromHct(Hct.fromInt(argbFromRgb(...rgb)));
}

export enum Variant {
  MONOCHROME = 0,
  NEUTRAL = 1,
  TONAL_SPOT = 2,
  VIBRANT = 3,
  FIDELITY = 5,
  CONTENT = 6
}


const variantsToSchemes = {
  [Variant.MONOCHROME]: SchemeMonochrome,
  [Variant.NEUTRAL]: SchemeNeutral,
  [Variant.TONAL_SPOT]: SchemeTonalSpot,
  [Variant.VIBRANT]: SchemeVibrant,
  [Variant.FIDELITY]: SchemeFidelity,
  [Variant.CONTENT]: SchemeContent
}

function schemeFromHct(variant: Variant, sourceColorHct: Hct, isDark: boolean, contrastLevel: number) {
  return new variantsToSchemes[variant](sourceColorHct, isDark, contrastLevel);
}

function newThemeFromHct(hct: Hct, variant = Variant.TONAL_SPOT, contrast = 0.0 ) {
  const light = schemeFromHct(variant, hct, false, contrast);
  const dark = schemeFromHct(variant, hct, true, contrast);
  return {light, dark}
}

function propertiesFromDynamicScheme(scheme: DynamicScheme) {
  return materialDynamicColors.map(schemeColor => {
    const token = schemeColor.name.replaceAll('_', '-');
    const color = hexFromArgb(schemeColor.getArgb(scheme));
    return `--${SYS_TOKEN_PREFIX}-${token}: ${color};`
  })
}

export function styleSheetFromTheme(theme: {light: DynamicScheme, dark: DynamicScheme}, selector: string) {
  const light = propertiesFromDynamicScheme(theme.light);
  const dark = propertiesFromDynamicScheme(theme.dark);
  return `${selector} {
    ${light.join('\n')}
  }
  @media (prefers-color-scheme: dark) {
    ${selector} {
      ${dark.join('\n')}
    }
  }`
}
