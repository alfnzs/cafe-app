import { environment } from '../constants/environment';
import fetchAPI from '../utils/fetch';

export const login = async (payload: { email: string; password: string }) => {
  const result = await fetchAPI(`${environment.API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return result;
};
