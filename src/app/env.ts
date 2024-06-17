import { environment } from 'src/environments/environment';

interface Environment {
  production: boolean;
  localStoragePrefix: string;
  versionInfo: {
    vercel?: {
      VERCEL_URL: string
    };
    version: string;
    branch: string;
    hash: string;
  }
}

export const env: Environment = environment;
