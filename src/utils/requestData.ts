import { IncomingMessage } from 'http';
import { UserInfo } from '../users/constants';
import { ErrorMessages } from './constants';

const BASE_URL = '/api/users';
const URL_WITH_ID = /^\/api\/users\/[\w-]*$/g;
const UUID_MATCH = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/;

export const isUrlCorrect = (url: string): boolean => {
  const urlMatch = url.match(URL_WITH_ID);

  return url === BASE_URL || urlMatch !== null;
}

export const getId = (url: string): string | null => {
  if (url === BASE_URL) {
    return null;
  }
 
  const id = url.replace(`${BASE_URL}/`, '');
 
  if (id.match(UUID_MATCH)) {
    return id ;
  }

  throw new Error(ErrorMessages.INVALID_DATA);
}

export const getBody = async (req: IncomingMessage): Promise<UserInfo> => {
  return new Promise((res, rej) => {
    let rawData = '';
    req.on('data', (chunk) => { rawData += chunk; })
      .on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          res(parsedData);
        } catch {
          rej();
        }
      });
  });
}