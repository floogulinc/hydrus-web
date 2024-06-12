import { DislikeAnalyzer, DynamicScheme, Hct, TemperatureCache, TonalPalette } from "@material/material-color-utilities";

enum Variant {
  MONOCHROME = 0,
  NEUTRAL = 1,
  TONAL_SPOT = 2,
  VIBRANT = 3,
  EXPRESSIVE = 4,
  FIDELITY = 5,
  CONTENT = 6,
  RAINBOW = 7,
  FRUIT_SALAD = 8
}


export class SchemeTonalSpotCustom extends DynamicScheme {
  constructor(sourceColorHct: Hct, isDark: boolean, contrastLevel: number) {
    const primaryPalette = TonalPalette.fromHueAndChroma(sourceColorHct.hue, 36.0);
    super({
      sourceColorArgb: sourceColorHct.toInt(),
      variant: Variant.TONAL_SPOT,
      contrastLevel,
      isDark,
      primaryPalette,
      secondaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 16.0),
      tertiaryPalette: primaryPalette,
      neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 6.0),
      neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 8.0),
    });
  }
}

export class SchemeVibrantCustom extends DynamicScheme {
  /**
   * Hues (in degrees) used at breakpoints such that designers can specify a
   * hue rotation that occurs at a given break point.
   */
  private static readonly hues = [
    0.0,
    41.0,
    61.0,
    101.0,
    131.0,
    181.0,
    251.0,
    301.0,
    360.0,
  ];

  /**
   * Hue rotations (in degrees) of the Secondary [TonalPalette],
   * corresponding to the breakpoints in [hues].
   */
  private static readonly secondaryRotations = [
    18.0,
    15.0,
    10.0,
    12.0,
    15.0,
    18.0,
    15.0,
    12.0,
    12.0,
  ];

  /**
   * Hue rotations (in degrees) of the Tertiary [TonalPalette],
   * corresponding to the breakpoints in [hues].
   */
  private static readonly tertiaryRotations = [
    35.0,
    30.0,
    20.0,
    25.0,
    30.0,
    35.0,
    30.0,
    25.0,
    25.0,
  ];

  constructor(sourceColorHct: Hct, isDark: boolean, contrastLevel: number) {
    const primaryPalette = TonalPalette.fromHueAndChroma(sourceColorHct.hue, 200.0);
    super({
      sourceColorArgb: sourceColorHct.toInt(),
      variant: Variant.VIBRANT,
      contrastLevel,
      isDark,
      primaryPalette,
      secondaryPalette: TonalPalette.fromHueAndChroma(
          DynamicScheme.getRotatedHue(
              sourceColorHct, SchemeVibrantCustom.hues,
              SchemeVibrantCustom.secondaryRotations),
          24.0),
      tertiaryPalette: primaryPalette,
      neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 10.0),
      neutralVariantPalette:
          TonalPalette.fromHueAndChroma(sourceColorHct.hue, 12.0),
    });
  }
}

export class SchemeTags extends DynamicScheme {
  constructor(sourceColorHct: Hct, isDark: boolean, contrastLevel: number) {
    const primaryPalette = TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma);
    super({
      sourceColorArgb: sourceColorHct.toInt(),
      variant: Variant.CONTENT,
      contrastLevel,
      isDark,
      primaryPalette: primaryPalette,
      secondaryPalette: TonalPalette.fromHueAndChroma(
          sourceColorHct.hue,
          Math.max(sourceColorHct.chroma - 32.0, sourceColorHct.chroma * 0.5)),
      tertiaryPalette: primaryPalette,
      neutralPalette: primaryPalette,
      neutralVariantPalette: primaryPalette,
    });
  }
}
