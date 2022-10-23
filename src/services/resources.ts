import {resourcesAPIUrl} from '../api/base';

export const resolveResourceUrl = (pathname: string) =>
  resourcesAPIUrl + pathname;
