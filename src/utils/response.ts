import { ServerResponse } from 'http';
import { responseData } from './constants';

export const sendResponse = (res: ServerResponse, responseInfo: responseData) => {
  res.statusCode = responseInfo.statusCode;
  if (responseInfo.data) {
    res.write(JSON.stringify(responseInfo.data));
  }
  responseInfo.message ? res.end(JSON.stringify({ message: responseInfo.message })) : res.end();
}