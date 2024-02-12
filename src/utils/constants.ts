import { User } from '../users/constants';

export const enum HTTPStatusCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorMessages {
  INVALID_METHOD = 'Invalid Method',
  INVALID_URL = 'Invalid URL',
  INTERNAL_ERROR = 'Internal server error',
  INVALID_DATA = 'Invalid user data',
  INVALID_USER_ID = 'Invalid user id (is not UUID format)',
  ID_NOT_FOUND = 'User was not found with this id',
}

export interface responseData {
  statusCode: number,
  data?: User[] | User,
  message?: string,
};
