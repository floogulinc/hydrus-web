import { HydrusServiceSimple, HydrusServiceType, HydrusServices } from "./hydrus-services";
import { SystemPredicate } from "./hydrus-system-predicates";

export type HydrusRatingStarType = 'circle' | 'square' | 'fat star' | 'pentagram star';

export const ratingIcons: Record<HydrusRatingStarType, string> = {
  'fat star': 'rating:star',
  'pentagram star': 'rating:star',
  'circle': 'rating:circle',
  'square': 'rating:square'
}

export const ratingIconsOutline: Record<HydrusRatingStarType, string> = {
  'fat star': 'rating:star_outline',
  'pentagram star': 'rating:star_outline',
  'circle': 'rating:circle_outline',
  'square': 'rating:square_outline'
}

export interface HydrusNumericalRatingService extends HydrusServiceSimple {
  min_stars: number;
  max_stars: number;
  star_shape: HydrusRatingStarType;
  type: HydrusServiceType.LOCAL_RATING_NUMERICAL | HydrusServiceType.RATING_NUMERICAL_REPOSITORY;
}

export interface HydrusIncDecRatingService extends HydrusServiceSimple {
  type: HydrusServiceType.LOCAL_RATING_INCDEC
}

export function isNumericalRatingService(service: HydrusServiceSimple | HydrusNumericalRatingService): service is HydrusNumericalRatingService {
  return service.type === HydrusServiceType.LOCAL_RATING_NUMERICAL || service.type === HydrusServiceType.RATING_NUMERICAL_REPOSITORY;
}

export interface HydrusLikeRatingService extends HydrusServiceSimple {
  star_shape: HydrusRatingStarType;
  type: HydrusServiceType.LOCAL_RATING_LIKE | HydrusServiceType.RATING_LIKE_REPOSITORY;
}

export function isLikeRatingService(service: HydrusServiceSimple | HydrusLikeRatingService): service is HydrusLikeRatingService {
  return service.type === HydrusServiceType.LOCAL_RATING_LIKE || service.type === HydrusServiceType.RATING_LIKE_REPOSITORY;
}

export function isIncDecRatingService(service: HydrusServiceSimple): service is HydrusIncDecRatingService {
  return service.type === HydrusServiceType.LOCAL_RATING_INCDEC
}

export type HydrusNumericalRatingValue = number | null;
export type HydrusLikeRatingValue = boolean | null;
export type HydrusIncDecRatingValue = number;
export type HydrusRatingValue = HydrusNumericalRatingValue | HydrusLikeRatingValue | HydrusIncDecRatingValue;

export type HydrusNumericalRating = HydrusNumericalRatingService & {value: HydrusNumericalRatingValue};
export type HydrusLikeRating = HydrusLikeRatingService & {value: HydrusLikeRatingValue};
export type HydrusIncDecRating = HydrusIncDecRatingService & {value: HydrusIncDecRatingValue};

export type HydrusRating = {service_key: string} & (HydrusNumericalRating | HydrusLikeRating | HydrusIncDecRating)

export function ratingsServiceToRatingPredicate(service: HydrusServiceSimple) {
  if(isNumericalRatingService(service)) {
    return SystemPredicate.RATING_SPECIFIC_NUMERICAL
  } else if(isLikeRatingService(service)) {
    return SystemPredicate.RATING_SPECIFIC_LIKE_DISLIKE
  }else if(isIncDecRatingService(service)) {
    return SystemPredicate.RATING_SPECIFIC_INCDEC
  }
}

export function isRatingService(service: HydrusServiceSimple) {
  return isIncDecRatingService(service) || isLikeRatingService(service) || isNumericalRatingService(service);
}
