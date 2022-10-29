import {API} from '../api/GlobalAPI';

export const resolveResourceUrl = (pathname: string) =>
  API.getResourceUrl(pathname);
