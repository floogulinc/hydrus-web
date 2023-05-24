// Some things from https://github.com/hydrusnetwork/hydrus/blob/master/hydrus/external/SystemPredicateParser.py

export enum SystemPredicate {
  EVERYTHING = 1,
  INBOX,
  ARCHIVE,
  HAS_DURATION,
  NO_DURATION,
  BEST_QUALITY_OF_GROUP,
  NOT_BEST_QUALITY_OF_GROUP,
  HAS_AUDIO,
  NO_AUDIO,
  HAS_ICC_PROFILE,
  NO_ICC_PROFILE,
  HAS_TAGS,
  UNTAGGED,
  NUM_OF_TAGS,
  NUM_OF_WORDS,
  HEIGHT,
  WIDTH,
  FILESIZE,
  SIMILAR_TO,
  LIMIT,
  FILETYPE,
  HASH,
  MOD_DATE,
  ARCHIVED_DATE,
  LAST_VIEWED_TIME,
  TIME_IMPORTED,
  DURATION,
  FILE_SERVICE,
  NUM_FILE_RELS,
  RATIO,
  NUM_PIXELS,
  MEDIA_VIEWS,
  PREVIEW_VIEWS,
  ALL_VIEWS,
  MEDIA_VIEWTIME,
  PREVIEW_VIEWTIME,
  ALL_VIEWTIME,
  URL_REGEX,
  NO_URL_REGEX,
  URL,
  NO_URL,
  DOMAIN,
  NO_DOMAIN,
  URL_CLASS,
  NO_URL_CLASS,
  TAG_AS_NUMBER,
  HAS_NOTES,
  NO_NOTES,
  NUM_NOTES,
  HAS_NOTE_NAME,
  NO_NOTE_NAME,
}


export enum Operators {
  /**  One of '=', '<', '>', '\u2248' ('≈') (takes '~=' too) */
  RELATIONAL = 1,
  /** Like RELATIONAL but without the approximately equal operator */
  RELATIONAL_EXACT,
  /** One of '=' or '!=' */
  EQUAL,
  /** One of 'is not currently in', 'is currently in', 'is not pending to', 'is pending to' */
  FILESERVICE_STATUS,
  /** A tuple of a string (a potential tag name) and a relational operator (as a string) */
  TAG_RELATIONAL,
  /** None (meaning =, since thats the only accepted operator) */
  ONLY_EQUAL,
  /** One of '=', 'wider than','taller than', '\u2248' ('≈') (takes '~=' too) */
  RATIO_OPERATORS
}

export enum Value {
  /** An int which holds a non-negative value */
  NATURAL = 1,
  /** A 2-tuple, where the first part is a set of potential hashes (as strings), the second part is a non-negative integer */
  HASHLIST_WITH_DISTANCE,
  /** A 2-tuple, where the first part is a set of potential hashes (as strings), the second part is one of 'sha256', 'md5', 'sha1', 'sha512' */
  HASHLIST_WITH_ALGORITHM,
  /** A set of file types using the enum set in InitialiseFiletypes as defined in FILETYPES */
  FILETYPE_LIST,
  /**
   * Either a tuple of 4 non-negative integers: (years, months, days, hours) where the latter is < 24 OR
   * a datetime.date object. For the latter, only the YYYY-MM-DD format is accepted.
   */
  DATE_OR_TIME_INTERVAL,
  /** A tuple of two non-negative integers: (seconds, milliseconds) where the latter is <1000 */
  TIME_SEC_MSEC,
  /** A string (accepts any string so can't use units after this since it consumes the entire remaining part of the input) */
  ANY_STRING,
  /** A tuple of 4 non-negative integers: (days, hours, minutes, seconds) where hours < 24, minutes < 60, seconds < 60 */
  TIME_INTERVAL,
  /** An integer */
  INTEGER,
  /** A tuple of 2 ints, both non-negative */
  RATIO
}

export enum Units {
  FILESIZE = 1, // One of 'B', 'KB', 'MB', 'GB'
  FILE_RELATIONSHIP_TYPE, // One of 'not related/false positive', 'duplicates', 'alternates', 'potential duplicates'
  PIXELS_OR_NONE, // Always None (meaning pixels)
  PIXELS // One of 'pixels', 'kilopixels', 'megapixels'
}

export interface Predicate {
  name: string,
  operator: Operators,
  value: Value,
  units: Units
}

// All system predicates
export const allSystemPredicates: Record<SystemPredicate, Predicate> = {
  [SystemPredicate.EVERYTHING]: { name: 'everything', operator: null, value: null, units: null },
  [SystemPredicate.INBOX]: { name: 'inbox', operator: null, value: null, units: null },
  [SystemPredicate.ARCHIVE]: { name: 'archive', operator: null, value: null, units: null },
  [SystemPredicate.HAS_DURATION]: { name: 'has duration', operator: null, value: null, units: null },
  [SystemPredicate.NO_DURATION]: { name: 'no duration', operator: null, value: null, units: null },
  [SystemPredicate.BEST_QUALITY_OF_GROUP]: { name: 'is the best quality file of its duplicate group', operator: null, value: null, units: null },
  [SystemPredicate.NOT_BEST_QUALITY_OF_GROUP]: { name: 'is not the best quality file of its duplicate group', operator: null, value: null, units: null },
  [SystemPredicate.HAS_AUDIO]: { name: 'has audio', operator: null, value: null, units: null },
  [SystemPredicate.NO_AUDIO]: { name: 'no audio', operator: null, value: null, units: null },
  [SystemPredicate.HAS_ICC_PROFILE]: { name: 'has icc profile', operator: null, value: null, units: null },
  [SystemPredicate.NO_ICC_PROFILE]: { name: 'no icc profile', operator: null, value: null, units: null },
  [SystemPredicate.HAS_TAGS]: { name: 'has tags', operator: null, value: null, units: null },
  [SystemPredicate.UNTAGGED]: { name: 'untagged', operator: null, value: null, units: null },
  [SystemPredicate.NUM_OF_TAGS]: { name: 'number of tags', operator: Operators.RELATIONAL, value: Value.NATURAL, units: null },
  [SystemPredicate.NUM_OF_WORDS]: { name: 'number of words', operator: Operators.RELATIONAL, value: Value.NATURAL, units: null },
  [SystemPredicate.HEIGHT]: { name: 'height', operator: Operators.RELATIONAL, value: Value.NATURAL, units: Units.PIXELS_OR_NONE },
  [SystemPredicate.WIDTH]: { name: 'width', operator: Operators.RELATIONAL, value: Value.NATURAL, units: Units.PIXELS_OR_NONE },
  [SystemPredicate.FILESIZE]: { name: 'filesize', operator: Operators.RELATIONAL, value: Value.NATURAL, units: Units.FILESIZE },
  [SystemPredicate.SIMILAR_TO]: { name: 'similar to', operator: null, value: Value.HASHLIST_WITH_DISTANCE, units: null },
  [SystemPredicate.LIMIT]: { name: 'limit', operator: Operators.ONLY_EQUAL, value: Value.NATURAL, units: null },
  [SystemPredicate.FILETYPE]: { name: 'filetype', operator: Operators.ONLY_EQUAL, value: Value.FILETYPE_LIST, units: null },
  [SystemPredicate.HASH]: { name: 'hash', operator: Operators.EQUAL, value: Value.HASHLIST_WITH_ALGORITHM, units: null },
  [SystemPredicate.ARCHIVED_DATE]: { name: 'archived time', operator: Operators.RELATIONAL, value: Value.DATE_OR_TIME_INTERVAL, units: null },
  [SystemPredicate.MOD_DATE]: { name: 'modified date', operator: Operators.RELATIONAL, value: Value.DATE_OR_TIME_INTERVAL, units: null },  // TODO: change to `modified time` when required hydrus version >= 525
  [SystemPredicate.LAST_VIEWED_TIME]: { name: 'last viewed time', operator: Operators.RELATIONAL, value: Value.DATE_OR_TIME_INTERVAL, units: null },
  [SystemPredicate.TIME_IMPORTED]: { name: 'import time', operator: Operators.RELATIONAL, value: Value.DATE_OR_TIME_INTERVAL, units: null },
  [SystemPredicate.DURATION]: { name: 'duration', operator: Operators.RELATIONAL, value: Value.TIME_SEC_MSEC, units: null },
  [SystemPredicate.FILE_SERVICE]: { name: 'file service', operator: Operators.FILESERVICE_STATUS, value: Value.ANY_STRING, units: null },
  [SystemPredicate.NUM_FILE_RELS]: { name: 'number of file relationships', operator: Operators.RELATIONAL, value: Value.NATURAL, units: Units.FILE_RELATIONSHIP_TYPE },
  [SystemPredicate.RATIO]: { name: 'ratio', operator: Operators.RATIO_OPERATORS, value: Value.RATIO, units: null },
  [SystemPredicate.NUM_PIXELS]: { name: 'num pixels', operator: Operators.RELATIONAL, value: Value.NATURAL, units: Units.PIXELS },
  [SystemPredicate.MEDIA_VIEWS]: { name: 'media views', operator: Operators.RELATIONAL, value: Value.NATURAL, units: null },
  [SystemPredicate.PREVIEW_VIEWS]: { name: 'preview views', operator: Operators.RELATIONAL, value: Value.NATURAL, units: null },
  [SystemPredicate.ALL_VIEWS]: { name: 'all views', operator: Operators.RELATIONAL, value: Value.NATURAL, units: null },
  [SystemPredicate.MEDIA_VIEWTIME]: { name: 'media viewtime', operator: Operators.RELATIONAL, value: Value.TIME_INTERVAL, units: null },
  [SystemPredicate.PREVIEW_VIEWTIME]: { name: 'preview viewtime', operator: Operators.RELATIONAL, value: Value.TIME_INTERVAL, units: null },
  [SystemPredicate.ALL_VIEWTIME]: { name: 'all viewtime', operator: Operators.RELATIONAL, value: Value.TIME_INTERVAL, units: null },
  [SystemPredicate.URL_REGEX]: { name: 'has a url matching regex', operator: null, value: Value.ANY_STRING, units: null },
  [SystemPredicate.NO_URL_REGEX]: { name: 'does not have a url matching regex', operator: null, value: Value.ANY_STRING, units: null },
  [SystemPredicate.URL]: { name: 'has url', operator: null, value: Value.ANY_STRING, units: null },
  [SystemPredicate.NO_URL]: { name: 'does not have url', operator: null, value: Value.ANY_STRING, units: null },
  [SystemPredicate.DOMAIN]: { name: 'has a url with domain', operator: null, value: Value.ANY_STRING, units: null },
  [SystemPredicate.NO_DOMAIN]: { name: 'does not have a url with domain', operator: null, value: Value.ANY_STRING, units: null },
  [SystemPredicate.URL_CLASS]: { name: 'has a url with url class', operator: null, value: Value.ANY_STRING, units: null },
  [SystemPredicate.NO_URL_CLASS]: { name: 'does not have a url with url class', operator: null, value: Value.ANY_STRING, units: null },
  [SystemPredicate.TAG_AS_NUMBER]: { name: 'tag as number', operator: Operators.TAG_RELATIONAL, value: Value.INTEGER, units: null },
  [SystemPredicate.HAS_NOTES]: { name: 'has notes', operator: null, value: null, units: null },
  [SystemPredicate.NO_NOTES]: { name: 'no notes', operator: null, value: null, units: null },
  [SystemPredicate.NUM_NOTES]: { name: 'number of notes', operator: Operators.RELATIONAL_EXACT, value: Value.NATURAL, units: null },
  [SystemPredicate.HAS_NOTE_NAME]: { name: 'note with name', operator: null, value: Value.ANY_STRING, units: null },
  [SystemPredicate.NO_NOTE_NAME]: { name: 'does not have note with name', operator: null, value: Value.ANY_STRING, units: null },
}

export const operatorOptions: Record<Operators, string[]> = {
  [Operators.RELATIONAL]: ['<', '≈', '=', '≠', '>'],
  [Operators.RELATIONAL_EXACT]: ['<', '=', '>'],
  [Operators.EQUAL]: ['is', 'is not'],
  [Operators.FILESERVICE_STATUS]: [
    'is currently in',
    'is not currently in',
    'is pending to',
    'is not pending to',
  ],
  [Operators.TAG_RELATIONAL]: ['<', '≈', '=', '≠', '>'],
  [Operators.ONLY_EQUAL]: ['is'],
  [Operators.RATIO_OPERATORS]: ['=', 'wider than', 'taller than', '≈', '≠'],
};

export const operatorDefaults: Record<Operators, string> = {
  [Operators.RELATIONAL]: '=',
  [Operators.RELATIONAL_EXACT]: '=',
  [Operators.EQUAL]: 'is',
  [Operators.FILESERVICE_STATUS]: 'is currently in',
  [Operators.TAG_RELATIONAL]: '=',
  [Operators.ONLY_EQUAL]: 'is',
  [Operators.RATIO_OPERATORS]: '='
}

export const unitsOptions: Record<Units, string[]> = {
  [Units.FILESIZE]: ['B', 'KB', 'MB', 'GB'],
  [Units.FILE_RELATIONSHIP_TYPE]: [
    'duplicates',
    'alternates',
    'not related',
    'potential duplicates',
  ],
  [Units.PIXELS_OR_NONE]: ['pixels'],
  [Units.PIXELS]: ['pixels', 'kilopixels', 'megapixels'],
};

export const unitDefaults: Record<Units, string> = {
  [Units.FILESIZE]: 'KB',
  [Units.FILE_RELATIONSHIP_TYPE]: 'duplicates',
  [Units.PIXELS_OR_NONE]: 'pixels',
  [Units.PIXELS]: 'megapixels',
}

export const hashAlgorithms = ['sha256', 'md5', 'sha1', 'sha512'];

export const valueLabels: Partial<Record<SystemPredicate, string>> = {
  [SystemPredicate.FILE_SERVICE]: 'File service',
  [SystemPredicate.URL_REGEX]: 'URL Regex',
  [SystemPredicate.NO_URL_REGEX]: 'URL Regex',
  [SystemPredicate.URL]: 'URL',
  [SystemPredicate.NO_URL]: 'URL',
  [SystemPredicate.DOMAIN]: 'Domain',
  [SystemPredicate.NO_DOMAIN]: 'Domain',
  [SystemPredicate.URL_CLASS]: 'URL Class',
  [SystemPredicate.NO_URL_CLASS]: 'Url Class',
  [SystemPredicate.HAS_NOTE_NAME]: 'Note Name',
  [SystemPredicate.NO_NOTE_NAME]: 'Note Name',
}

export const predicateGroups: ({ name: string, predicates: SystemPredicate[] } | { predicate: SystemPredicate })[] = [
  { predicate: SystemPredicate.EVERYTHING },
  { predicate: SystemPredicate.INBOX },
  { predicate: SystemPredicate.ARCHIVE },
  {
    name: 'dimensions',
    predicates: [
      SystemPredicate.HEIGHT,
      SystemPredicate.WIDTH,
      SystemPredicate.RATIO,
      SystemPredicate.NUM_PIXELS
    ]
  },
  {
    name: 'duration',
    predicates: [
      SystemPredicate.HAS_DURATION,
      SystemPredicate.NO_DURATION,
      SystemPredicate.DURATION
    ]
  },
  {
    name: 'file relationships',
    predicates: [
      SystemPredicate.NOT_BEST_QUALITY_OF_GROUP,
      SystemPredicate.BEST_QUALITY_OF_GROUP,
      SystemPredicate.NUM_FILE_RELS
    ]
  },
  { predicate: SystemPredicate.FILE_SERVICE },
  {
    name: 'file viewing statistics',
    predicates: [
      SystemPredicate.ALL_VIEWS,
      SystemPredicate.MEDIA_VIEWS,
      SystemPredicate.PREVIEW_VIEWS,
      SystemPredicate.ALL_VIEWTIME,
      SystemPredicate.MEDIA_VIEWTIME,
      SystemPredicate.PREVIEW_VIEWTIME
    ]
  },
  { predicate: SystemPredicate.FILESIZE },
  { predicate: SystemPredicate.FILETYPE },
  {
    name: 'has audio',
    predicates: [
      SystemPredicate.HAS_AUDIO,
      SystemPredicate.NO_AUDIO
    ]
  },
  {
    name: 'has icc profile',
    predicates: [
      SystemPredicate.HAS_ICC_PROFILE,
      SystemPredicate.NO_ICC_PROFILE
    ]
  },
  { predicate: SystemPredicate.HASH },
  {
    name: 'known url',
    predicates: [
      SystemPredicate.URL,
      SystemPredicate.NO_URL,
      SystemPredicate.DOMAIN,
      SystemPredicate.NO_DOMAIN,
      SystemPredicate.URL_REGEX,
      SystemPredicate.NO_URL_REGEX,
      SystemPredicate.URL_CLASS,
      SystemPredicate.NO_URL_CLASS
    ]
  },
  { predicate: SystemPredicate.LIMIT },
  {
    name: 'notes',
    predicates: [
      SystemPredicate.HAS_NOTES,
      SystemPredicate.NO_NOTES,
      SystemPredicate.NUM_NOTES,
      SystemPredicate.HAS_NOTE_NAME,
      SystemPredicate.NO_NOTE_NAME
    ]
  },
  {
    name: 'number of tags',
    predicates: [
      SystemPredicate.HAS_TAGS,
      SystemPredicate.UNTAGGED,
      SystemPredicate.NUM_OF_TAGS
    ]
  },
  { predicate: SystemPredicate.NUM_OF_WORDS },
  { predicate: SystemPredicate.SIMILAR_TO },
  { predicate: SystemPredicate.TAG_AS_NUMBER },
  {
    name: 'time',
    predicates: [
      SystemPredicate.TIME_IMPORTED,
      SystemPredicate.MOD_DATE,
      SystemPredicate.LAST_VIEWED_TIME,
      SystemPredicate.ARCHIVED_DATE
    ]
  }
];
