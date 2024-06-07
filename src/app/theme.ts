import { DynamicScheme, Hct, MaterialDynamicColors, Scheme, SchemeContent, SchemeExpressive, SchemeFidelity, SchemeMonochrome, SchemeNeutral, SchemeTonalSpot, SchemeVibrant, Theme, argbFromHex, argbFromRgb, hexFromArgb, themeFromSourceColor } from "@material/material-color-utilities";

const SYS_TOKEN_PREFIX = 'sys'

// export function generateThemeFromHex(hex: string) {
//   return generateTokensFromColor(argbFromHex(hex));
// }

// export function generateThemeFromRGB(rgb: [number, number, number]) {
//   return generateTokensFromColor(argbFromRgb(...rgb));
// }

function generateTokensFromColor(color: number) {
  const theme = themeFromSourceColor(color);
  console.log(JSON.stringify(theme, null, 2));
  return theme;
}

export function applyTheme(theme: Theme, options?: {
  dark?: boolean,
  target?: HTMLElement,
}) {
  const target = options?.target || document.body;
  const isDark = options?.dark ?? false;
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
  setSchemeProperties(target, scheme);
}

function setSchemeProperties(
    target: HTMLElement,
    scheme: Scheme,
    suffix: string = '',
) {
  for (const [key, value] of Object.entries(scheme.toJSON())) {
    const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const color = hexFromArgb(value);
    target.style.setProperty(`--${SYS_TOKEN_PREFIX}-${token}${suffix}`, color);
  }
}

function getSchemeProperties(
  scheme: Scheme,
  suffix: string = '',
) {
  const list = Object.entries(scheme.toJSON()).map(([key, value]) => {
    const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const color = hexFromArgb(value);
    return `--${SYS_TOKEN_PREFIX}-${token}${suffix}: ${color};`
  })
  return list
}

// export function styleSheetFromTheme(theme: Theme, selector: string) {
//   const light = getSchemeProperties(theme.schemes.light).concat(getSurfaceStyles(theme, false));
//   const dark = getSchemeProperties(theme.schemes.dark).concat(getSurfaceStyles(theme, true));
//   return `${selector} {
//     ${light.join('\n')}
//   }
//   @media (prefers-color-scheme: dark) {
//     ${selector} {
//       ${dark.join('\n')}
//     }
//   }`
// }


export function getSurfaceStyles(theme: Theme, dark: boolean,) {
  if (dark) {
    const elevationProps = {
      "surface-dim": theme.palettes.neutral.tone(6),
      "surface-bright": theme.palettes.neutral.tone(24),
      "surface-container-lowest": theme.palettes.neutral.tone(4),
      "surface-container-low": theme.palettes.neutral.tone(10),
      "surface-container": theme.palettes.neutral.tone(12),
      "surface-container-high": theme.palettes.neutral.tone(17),
      "surface-container-highest": theme.palettes.neutral.tone(22),
    };

    return Object.entries(elevationProps).map(([property, value]) => {
      const color = hexFromArgb(value);
      return `--${SYS_TOKEN_PREFIX}-${property}: ${color};`
    })
  } else {
    const elevationProps = {
      "surface-dim": theme.palettes.neutral.tone(87),
      "surface-bright": theme.palettes.neutral.tone(98),
      "surface-container-lowest": theme.palettes.neutral.tone(100),
      "surface-container-low": theme.palettes.neutral.tone(96),
      "surface-container": theme.palettes.neutral.tone(94),
      "surface-container-high": theme.palettes.neutral.tone(92),
      "surface-container-highest": theme.palettes.neutral.tone(90),
    };

    return Object.entries(elevationProps).map(([property, value]) => {
      const color = hexFromArgb(value);
      return `--${SYS_TOKEN_PREFIX}-${property}: ${color};`
    })
  }
}



const colors = [
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


function schemeFromHct(variant: Variant, sourceColorHct: Hct, isDark: boolean, contrastLevel: number) {
  switch (variant) {
    case Variant.MONOCHROME:
      return new SchemeMonochrome(sourceColorHct, isDark, contrastLevel);
    case Variant.NEUTRAL:
      return new SchemeNeutral(sourceColorHct, isDark, contrastLevel);
    case Variant.TONAL_SPOT:
      return new SchemeTonalSpot(sourceColorHct, isDark, contrastLevel);
    case Variant.VIBRANT:
      return new SchemeVibrant(sourceColorHct, isDark, contrastLevel);
    case Variant.FIDELITY:
      return new SchemeFidelity(sourceColorHct, isDark, contrastLevel);
    case Variant.CONTENT:
      return new SchemeContent(sourceColorHct, isDark, contrastLevel);
  }
}

function newThemeFromHct(hct: Hct, variant = Variant.TONAL_SPOT, contrast = 0.0 ) {
  const light = schemeFromHct(variant, hct, false, contrast);
  const dark = schemeFromHct(variant, hct, true, contrast);
  return {light, dark}
}

function propertiesFromDynamicScheme(scheme: DynamicScheme) {
  return colors.map(schemeColor => {
    const token = schemeColor.name.replace('_', '-');
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
