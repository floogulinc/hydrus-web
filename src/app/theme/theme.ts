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
import { SchemeTonalSpotCustom, SchemeVibrantCustom } from "./schemes";

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


export function generateThemeFromHex(hex: string, variant?: ThemeVariant, contrast?: number) {
  return schemesFromHct(Hct.fromInt(argbFromHex(hex)), variant, contrast);
}

export function generateThemeFromRGB(rgb: [number, number, number], variant?: ThemeVariant, contrast?: number) {
  return schemesFromHct(Hct.fromInt(argbFromRgb(...rgb)), variant, contrast);
}

export enum ThemeVariant {
  MONOCHROME = 0,
  NEUTRAL = 1,
  TONAL_SPOT = 2,
  VIBRANT = 3,
  FIDELITY = 5,
  CONTENT = 6,
  TONAL_SPOT_CUSTOM = 7,
  VIBRANT_CUSTOM = 8
}

export enum SettingsThemeVariant {
  DEFAULT = 0,
  MONOCHROME = 1,
  NEUTRAL = 2,
  VIBRANT = 3,
}


export const settingsThemeVariantToThemeVariant: Record<SettingsThemeVariant, ThemeVariant> = {
  [SettingsThemeVariant.DEFAULT]: ThemeVariant.TONAL_SPOT_CUSTOM,
  [SettingsThemeVariant.MONOCHROME]: ThemeVariant.MONOCHROME,
  [SettingsThemeVariant.NEUTRAL]: ThemeVariant.NEUTRAL,
  [SettingsThemeVariant.VIBRANT]: ThemeVariant.VIBRANT_CUSTOM
}

export const settingsThemeVariants = [
  {id: SettingsThemeVariant.DEFAULT, name : 'Default'},
  {id: SettingsThemeVariant.MONOCHROME, name : 'Monochrome'},
  {id: SettingsThemeVariant.NEUTRAL, name : 'Neutral'},
  {id: SettingsThemeVariant.VIBRANT, name : 'Vibrant'}
]


const variantsToSchemes = {
  [ThemeVariant.MONOCHROME]: SchemeMonochrome,
  [ThemeVariant.NEUTRAL]: SchemeNeutral,
  [ThemeVariant.TONAL_SPOT]: SchemeTonalSpot,
  [ThemeVariant.VIBRANT]: SchemeVibrantCustom,
  [ThemeVariant.FIDELITY]: SchemeFidelity,
  [ThemeVariant.CONTENT]: SchemeContent,
  [ThemeVariant.TONAL_SPOT_CUSTOM]: SchemeTonalSpotCustom,
  [ThemeVariant.VIBRANT_CUSTOM]: SchemeVibrantCustom,
}

export function schemeFromHct(variant: ThemeVariant, sourceColorHct: Hct, isDark: boolean, contrastLevel = 0.0) {
  return new variantsToSchemes[variant](sourceColorHct, isDark, contrastLevel);
}

function schemesFromHct(hct: Hct, variant = ThemeVariant.TONAL_SPOT, contrast = 0.0 ) {
  const light = schemeFromHct(variant, hct, false, contrast);
  const dark = schemeFromHct(variant, hct, true, contrast);
  return {light, dark}
}

export function propertiesFromDynamicScheme(scheme: DynamicScheme, colors = materialDynamicColors) {
  return colors.map(schemeColor => {
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

export function getPrimaryColorFromScheme(scheme: DynamicScheme) {
  return MaterialDynamicColors.primary.getArgb(scheme)
}


export function getMetaThemeColorsFromTheme(theme: {light: DynamicScheme, dark: DynamicScheme}) {
  return {
    light: hexFromArgb(MaterialDynamicColors.surface.getArgb(theme.light)),
    dark: hexFromArgb(MaterialDynamicColors.surface.getArgb(theme.dark))
  }
}
