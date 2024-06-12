import { argbFromRgb, Hct, hexFromArgb, MaterialDynamicColors } from "@material/material-color-utilities";
import { schemeFromHct, ThemeVariant, propertiesFromDynamicScheme } from "./theme";
import { SchemeTags } from "./schemes";


const materialDynamicColorsForTags = [
  // MaterialDynamicColors.background,
  // MaterialDynamicColors.onBackground,
  // MaterialDynamicColors.surface,
  // MaterialDynamicColors.surfaceDim,
  // MaterialDynamicColors.surfaceBright,
  // MaterialDynamicColors.surfaceContainerLowest,
  // MaterialDynamicColors.surfaceContainerLow,
  // MaterialDynamicColors.surfaceContainer,
  // MaterialDynamicColors.surfaceContainerHigh,
  // MaterialDynamicColors.surfaceContainerHighest,
  // MaterialDynamicColors.onSurface,
  // MaterialDynamicColors.surfaceVariant,
  MaterialDynamicColors.onSurfaceVariant,
  // MaterialDynamicColors.inverseSurface,
  // MaterialDynamicColors.inverseOnSurface,
  MaterialDynamicColors.outline,
  MaterialDynamicColors.outlineVariant,
  // MaterialDynamicColors.shadow,
  // MaterialDynamicColors.scrim,
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
  // MaterialDynamicColors.tertiary,
  // MaterialDynamicColors.onTertiary,
  // MaterialDynamicColors.tertiaryContainer,
  // MaterialDynamicColors.onTertiaryContainer,
  // MaterialDynamicColors.error,
  // MaterialDynamicColors.onError,
  // MaterialDynamicColors.errorContainer,
  // MaterialDynamicColors.onErrorContainer,
  MaterialDynamicColors.primaryFixed,
  MaterialDynamicColors.primaryFixedDim,
  MaterialDynamicColors.onPrimaryFixed,
  MaterialDynamicColors.onPrimaryFixedVariant,
  MaterialDynamicColors.secondaryFixed,
  MaterialDynamicColors.secondaryFixedDim,
  MaterialDynamicColors.onSecondaryFixed,
  MaterialDynamicColors.onSecondaryFixedVariant,
  // MaterialDynamicColors.tertiaryFixed,
  // MaterialDynamicColors.tertiaryFixedDim,
  // MaterialDynamicColors.onTertiaryFixed,
  // MaterialDynamicColors.onTertiaryFixedVariant,
];

function namespaceColorToStyles(namespace: string, color: [number, number, number], isDark: boolean) {
  const argb = argbFromRgb(...color)
  const hct = Hct.fromInt(argb);
  //const scheme = schemeFromHct(ThemeVariant.CONTENT, hct, isDark, 0.0);
  const scheme = new SchemeTags(hct, isDark, 0.0)
  const properties = propertiesFromDynamicScheme(scheme, materialDynamicColorsForTags);
  //const palette = CorePalette.contentOf(argbFromRgb(...color));
  //console.log(palette)

  return [...properties, `--raw-namespace-color: ${hexFromArgb(argb)};`];
}

const tagSelectorPrefix = '.tag-color'

function getStylesForNamespace(namespace: string, color: [number, number, number], isDark: boolean, selector = `${tagSelectorPrefix}[data-tag-namespace="${namespace}"]` ) {
  return `${selector} {
    ${namespaceColorToStyles(namespace, color, isDark).join('\n')}
  }`
}

function getStylesForNamespaces(namespaceColors: {[namespace: string]: [number, number, number]}, isDark: boolean ) {
  const initialNamespaceStyles = 'null' in namespaceColors ? [getStylesForNamespace('null', namespaceColors['null'], isDark, `${tagSelectorPrefix}[data-tag-namespace]`)] : [];
  return [...initialNamespaceStyles, ...Object.entries(namespaceColors)
    .filter(([namespace]) => namespace !== 'null')
    .map(nsc => getStylesForNamespace(...nsc, isDark))]
}

export function getStyleSheetForNamespaces(namespaceColors: {[namespace: string]: [number, number, number]} ) {
  const light = getStylesForNamespaces(namespaceColors, false);
  const dark = getStylesForNamespaces(namespaceColors, true);
  return `${light.join('\n')}
  @media (prefers-color-scheme: dark) {
    ${dark.join('\n')}
  }`
}
