export const requiredVersion = 500;

export const secureVersion = 692;

export function getPastHydrusWebVersion(v: HydrusVersionResponse): {name: string, hostedUrl: string, releaseUrl?: string, dockerUrl?: string} {
  return null;
}

export interface HydrusVersionResponse {
  version: number;
  hydrus_version: number;
  is_idhan_instance?: boolean;
}
