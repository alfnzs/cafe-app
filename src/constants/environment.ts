import { getENV } from '../utils/environment';

export const environment = {
  API_URL: getENV('API_URL'),
};
