export const requiredVersion = 500;

export function getPastHydrusWebVersion(v: HydrusVersionResponse): {name: string, hostedUrl: string, releaseUrl?: string, dockerUrl?: string} {
  if((v.hydrus_version && v.hydrus_version < requiredVersion) || (!v.hydrus_version && v.version)) {
    return {
      name: 'v0.3.2',
      hostedUrl: 'https://hydrus-web-7kcb13b74-floogulinc.vercel.app/',
      releaseUrl: 'https://github.com/floogulinc/hydrus-web/releases/tag/v0.3.2',
      dockerUrl: 'https://github.com/floogulinc/hydrus-web/pkgs/container/hydrus-web/15419563?tag=0.3.2'
    }
  } else {
    return null;
  }
}

export interface HydrusVersionResponse {
  version: number;
  hydrus_version: number;
}
