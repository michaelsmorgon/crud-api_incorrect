import { IncomingMessage } from 'http';
import { UserInfo } from '../users/constants';
import { ErrorMessages, HTTPStatusCodes } from './constants';
import ManualError from '../error/manualError';

const BASE_URL = '/api/users';
const URL_WITH_ID = /^\/api\/users\/[\w-]*$/g;
const UUID_MATCH = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

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

  throw new ManualError(HTTPStatusCodes.BAD_REQUEST, ErrorMessages.INVALID_USER_ID);
}

export const getBody = async (req: IncomingMessage): Promise<UserInfo> => {
  return new Promise((res, rej) => {
    let rawData = '';
    req.on('data', (chunk) => { rawData += chunk; })
      .on('end', () => {
        try {
          const parsedData = JSON.parse(rawData) as UserInfo;
          if (parsedData.hasOwnProperty('age')
            || !parsedData.hasOwnProperty('username')
            || !parsedData.hasOwnProperty('hobbies')) {
            throw new ManualError(HTTPStatusCodes.BAD_REQUEST, ErrorMessages.INVALID_DATA);
          }
          res(parsedData);
        } catch (error) {
          rej(new ManualError(HTTPStatusCodes.BAD_REQUEST, ErrorMessages.INVALID_DATA));
        }
      });
  });
}