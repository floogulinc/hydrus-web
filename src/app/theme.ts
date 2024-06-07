import { Scheme, Theme, argbFromHex, argbFromRgb, hexFromArgb, themeFromSourceColor } from "@material/material-color-utilities";

const SYS_TOKEN_PREFIX = 'sys'

export function generateThemeFromHex(hex: string) {
  return generateTokensFromColor(argbFromHex(hex));
}

export function generateThemeFromRGB(rgb: [number, number, number]) {
  return generateTokensFromColor(argbFromRgb(...rgb));
}

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

export function styleSheetFromTheme(theme: Theme, selector: string) {
  const light = getSchemeProperties(theme.schemes.light).concat(getSurfaceStyles(theme, false));
  const dark = getSchemeProperties(theme.schemes.dark).concat(getSurfaceStyles(theme, true));
  return `${selector} {
    ${light.join('\n')}
  }
  @media (prefers-color-scheme: dark) {
    ${selector} {
      ${dark.join('\n')}
    }
  }`
}


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
