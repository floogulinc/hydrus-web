// From https://github.com/DeepLcom/deepl-node

export type Formality = 'less' | 'more' | 'default' | 'prefer_less' | 'prefer_more';
export type SentenceSplittingMode = 'off' | 'on' | 'nonewlines' | 'default';
export type TagHandlingMode = 'html' | 'xml';
export type GlossaryId = string;
export type TagList = string | string[];

/**
 * Information about a glossary, excluding the entry list.
 */
export interface GlossaryInfo {
  /** Unique ID assigned to the glossary. */
  readonly glossaryId: GlossaryId;
  /** User-defined name assigned to the glossary. */
  readonly name: string;
  /** Indicates whether the glossary may be used for translations. */
  readonly ready: boolean;
  /** Language code of the glossary source terms. */
  readonly sourceLang: SourceGlossaryLanguageCode;
  /** Language code of the glossary target terms. */
  readonly targetLang: TargetGlossaryLanguageCode;
  /** Time when the glossary was created. */
  readonly creationTime: Date;
  /** The number of entries contained in the glossary. */
  readonly entryCount: number;
}

/**
 * Language codes that may be used as a source or target language.
 * Note: although the language code type definitions are case-sensitive, this package and the DeepL
 * API accept case-insensitive language codes.
 */
export type CommonLanguageCode =
    | 'bg'
    | 'cs'
    | 'da'
    | 'de'
    | 'el'
    | 'es'
    | 'et'
    | 'fi'
    | 'fr'
    | 'hu'
    | 'id'
    | 'it'
    | 'ja'
    | 'ko'
    | 'lt'
    | 'lv'
    | 'nb'
    | 'nl'
    | 'pl'
    | 'ro'
    | 'ru'
    | 'sk'
    | 'sl'
    | 'sv'
    | 'tr'
    | 'uk'
    | 'zh';

/**
 * Language codes that may be used as a source language.
 * Note: although the language code type definitions are case-sensitive, this package and the DeepL
 * API accept case-insensitive language codes.
 */
export type SourceLanguageCode = CommonLanguageCode | 'en' | 'pt';

/**
 * Language codes that may be used as a target language.
 * Note: although the language code type definitions are case-sensitive, this package and the DeepL
 * API accept case-insensitive language codes.
 */
export type TargetLanguageCode = CommonLanguageCode | 'en-GB' | 'en-US' | 'pt-BR' | 'pt-PT';



/**
 * All language codes, including source-only and target-only language codes.
 * Note: although the language code type definitions are case-sensitive, this package and the DeepL
 * API accept case-insensitive language codes.
 */
export type LanguageCode = SourceLanguageCode | TargetLanguageCode;

/**
 * Language codes that do not include a regional variant, for example 'en' is included, but 'en-US'
 * is not.
 */
export type NonRegionalLanguageCode = CommonLanguageCode | 'en' | 'pt';

/**
 * Language codes that may be used as a source language for glossaries.
 * Note: although the language code type definitions are case-sensitive, this package and the DeepL
 * API accept case-insensitive language codes.
 */
export type SourceGlossaryLanguageCode = 'de' | 'en' | 'es' | 'fr' | 'ja';

/**
 * Language codes that may be used as a target language for glossaries.
 * Note: although the language code type definitions are case-sensitive, this package and the DeepL
 * API accept case-insensitive language codes.
 */
export type TargetGlossaryLanguageCode = SourceGlossaryLanguageCode;

/**
 * Options that can be specified when translating text.
 */
export interface TranslateTextOptions {
  /**
   * Specifies how input translation text should be split into sentences.
   * - 'on': Input translation text will be split into sentences using both newlines and
   *   punctuation, this is the default behaviour.
   * - 'off': Input translation text will not be split into sentences. This is advisable for
   *   applications where each input translation text is only one sentence.
   * - 'nonewlines': Input translation text will be split into sentences using only punctuation
   *   but not newlines.
   */
  splitSentences?: SentenceSplittingMode;

  /** Set to true to prevent the translation engine from correcting some formatting aspects, and
   * instead leave the formatting unchanged, default is false. */
  preserveFormatting?: boolean;

  /** Controls whether translations should lean toward formal or informal language. */
  formality?: Formality;

  /** Specifies the ID of a glossary to use with translation. */
  glossary?: GlossaryId | GlossaryInfo;

  /** Type of tags to parse before translation, options are 'html' and 'xml'. */
  tagHandling?: TagHandlingMode;

  /** Set to false to disable automatic tag detection, default is true. */
  outlineDetection?: boolean;

  /** List of XML tags that should be used to split text into sentences. */
  splittingTags?: TagList;

  /** List of XML tags that should not be used to split text into sentences. */
  nonSplittingTags?: TagList;

  /** List of XML tags containing content that should not be translated. */
  ignoreTags?: TagList;
}

/**
 * Holds the result of a text translation request.
 */
export interface TextResult {
  /**
   * String containing the translated text.
   */
  readonly text: string;

  /**
   * Language code of the detected source language.
   */
  readonly detectedSourceLang: SourceLanguageCode;
}

/**
 * Returns true if the given argument is a string.
 * @param arg Argument to check.
 */
export function isString(arg: any): arg is string {
  return typeof arg === 'string';
}


/**
 * Changes the upper- and lower-casing of the given language code to match ISO 639-1 with an
 * optional regional code from ISO 3166-1.
 * For example, input 'EN-US' returns 'en-US'.
 * @param langCode String containing language code to standardize.
 * @return Standardized language code.
 */
export function standardizeLanguageCode(langCode: string): LanguageCode {
  if (!isString(langCode) || langCode.length === 0) {
      throw new Error('langCode must be a non-empty string');
  }
  const [lang, region] = langCode.split('-', 2);
  return (
      region === undefined ? lang.toLowerCase() : `${lang.toLowerCase()}-${region.toUpperCase()}`
  ) as LanguageCode;
}

/**
* Removes the regional variant from a language, for example inputs 'en' and 'en-US' both return
* 'en'.
* @param langCode String containing language code to convert.
* @return Language code with regional variant removed.
*/
export function nonRegionalLanguageCode(langCode: string): NonRegionalLanguageCode {
  if (!isString(langCode) || langCode.length === 0) {
      throw new Error('langCode must be a non-empty string');
  }
  return langCode.split('-', 2)[0].toLowerCase() as NonRegionalLanguageCode;
}

/**
 * Validates and prepares URLSearchParams for arguments common to text and document translation.
 * @private
 */
export function buildURLSearchParams(
  sourceLang: LanguageCode | null,
  targetLang: LanguageCode,
  formality: Formality | undefined,
  glossary: GlossaryId | GlossaryInfo | undefined,
): URLSearchParams {
  targetLang = standardizeLanguageCode(targetLang);
  if (sourceLang !== null) {
      sourceLang = standardizeLanguageCode(sourceLang);
  }

  if (glossary !== undefined && sourceLang === null) {
      throw new Error('sourceLang is required if using a glossary');
  }

  if (glossary !== undefined && !isString(glossary)) {
      if (
          nonRegionalLanguageCode(targetLang) !== glossary.targetLang ||
          sourceLang !== glossary.sourceLang
      ) {
          throw new Error('sourceLang and targetLang must match glossary');
      }
  }

  if (targetLang === 'en') {
      throw new Error(
          "targetLang='en' is deprecated, please use 'en-GB' or 'en-US' instead.",
      );
  } else if (targetLang === 'pt') {
      throw new Error(
          "targetLang='pt' is deprecated, please use 'pt-PT' or 'pt-BR' instead.",
      );
  }

  const searchParams = new URLSearchParams({
      target_lang: targetLang,
  });
  if (sourceLang !== null) {
      searchParams.append('source_lang', sourceLang);
  }
  if (formality !== undefined) {
      const formalityStr = String(formality).toLowerCase();
      searchParams.append('formality', formalityStr);
  }
  if (glossary !== undefined) {
      if (!isString(glossary)) {
          if (glossary.glossaryId === undefined) {
              throw new Error(
                  'glossary option should be a string containing the Glossary ID or a GlossaryInfo object.',
              );
          }
          glossary = glossary.glossaryId;
      }
      searchParams.append('glossary_id', glossary);
  }
  return searchParams;
}


/**
 * Validates and appends texts to HTTP request parameters, and returns whether a single text
 * argument was provided.
 * @param data Parameters for HTTP request.
 * @param texts User-supplied texts to be checked.
 * @return True if only a single text was provided.
 * @private
 */
export function appendTextsAndReturnIsSingular(data: URLSearchParams, texts: string | string[]): boolean {
  const singular = !Array.isArray(texts);
  if (singular) {
      if (!isString(texts) || texts.length === 0) {
          throw new Error(
              'texts parameter must be a non-empty string or array of non-empty strings',
          );
      }
      data.append('text', texts);
  } else {
      for (const text of texts) {
          if (!isString(text) || text.length === 0) {
              throw new Error(
                  'texts parameter must be a non-empty string or array of non-empty strings',
              );
          }
          data.append('text', text);
      }
  }
  return singular;
}

/**
 * Returns '1' if the given arg is truthy, '0' otherwise.
 * @param arg Argument to check.
 */
export function toBoolString(arg: any): string {
  return arg ? '1' : '0';
}

/**
 * Joins given TagList with commas to form a single comma-delimited string.
 * @private
 */
function joinTagList(tagList: TagList): string {
  if (isString(tagList)) {
      return tagList;
  } else {
      return tagList.join(',');
  }
}

/**
* Validates and appends text options to HTTP request parameters.
* @param data Parameters for HTTP request.
* @param options Options for translate text request.
* Note the formality and glossaryId options are handled separately, because these options
* overlap with the translateDocument function.
* @private
*/
export function validateAndAppendTextOptions(data: URLSearchParams, options?: TranslateTextOptions) {
  if (!options) {
      return;
  }
  if (options.splitSentences !== undefined) {
      options.splitSentences = options.splitSentences.toLowerCase() as SentenceSplittingMode;
      if (options.splitSentences === 'on' || options.splitSentences === 'default') {
          data.append('split_sentences', '1');
      } else if (options.splitSentences === 'off') {
          data.append('split_sentences', '0');
      } else {
          data.append('split_sentences', options.splitSentences);
      }
  }
  if (options.preserveFormatting !== undefined) {
      data.append('preserve_formatting', toBoolString(options.preserveFormatting));
  }
  if (options.tagHandling !== undefined) {
      data.append('tag_handling', options.tagHandling);
  }
  if (options.outlineDetection !== undefined) {
      data.append('outline_detection', toBoolString(options.outlineDetection));
  }
  if (options.nonSplittingTags !== undefined) {
      data.append('non_splitting_tags', joinTagList(options.nonSplittingTags));
  }
  if (options.splittingTags !== undefined) {
      data.append('splitting_tags', joinTagList(options.splittingTags));
  }
  if (options.ignoreTags !== undefined) {
      data.append('ignore_tags', joinTagList(options.ignoreTags));
  }
}

/**
 * Type used during JSON parsing of API response for text translation results.
 * @private
 */
interface TextResultApiResponse {
  text: string;
  detected_source_language: string;
}

/**
 * Type used during JSON parsing of API response for lists of text translation results.
 * @private
 */
interface TextResultArrayApiResponse {
  translations: TextResultApiResponse[];
}

/**
 * Parses the given JSON string to an array of TextResult objects.
 * @private
 */
export function parseTextResultArray(json: string): TextResult[] {
  try {
      const obj = JSON.parse(json) as TextResultArrayApiResponse;
      return obj.translations.map((translation: TextResultApiResponse) => {
          return {
              text: translation.text,
              detectedSourceLang: standardizeLanguageCode(
                  translation.detected_source_language,
              ) as SourceLanguageCode,
          };
      });
  } catch (error) {
      throw new Error(`Error parsing response JSON: ${error}`);
  }
}

export interface Language {
  /** Name of the language in English. */
  readonly name: string;
  /**
   * Language code according to ISO 639-1, for example 'en'. Some target languages also include
   * the regional variant according to ISO 3166-1, for example 'en-US'.
   */
  readonly code: LanguageCode;
  /**
   * Only defined for target languages. If defined, specifies whether the formality option is
   * available for this target language.
   */
  readonly supportsFormality?: boolean;
}

/**
 * Type used during JSON parsing of API response for languages.
 * @private
 */
export interface LanguageApiResponse {
  language: string;
  name: string;
  supports_formality?: boolean;
}

/**
 * Parses the given language API response to a Language object.
 * @private
 */
function parseLanguage(lang: LanguageApiResponse): Language {
  try {
      const result = {
          name: lang.name,
          code: standardizeLanguageCode(lang.language),
          supportsFormality: lang.supports_formality,
      };
      if (result.supportsFormality === undefined) {
          delete result.supportsFormality;
      }
      return result;
  } catch (error) {
      throw new Error(`Error parsing response JSON: ${error}`);
  }
}

export function parseLanguageArray(obj: LanguageApiResponse[]): Language[] {
  return obj.map((lang: LanguageApiResponse) => parseLanguage(lang));
}

