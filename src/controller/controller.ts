import { IncomingMessage, ServerResponse } from 'http';
import { UserStore } from '../users/user';
import { User } from '../users/constants';
import { getId, isUrlCorrect } from '../utils/requestData';
import { ErrorMessages, HTTPStatusCodes, responseData } from '../utils/constants';
import { sendResponse } from '../utils/response';
import ManualError from '../error/manualError';
export const controller = () => {
  const userStore = new UserStore([]);
  
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    res.setHeader("Content-Type", 'application/json');
    try {
      const { method, url} = req;
      if (!url || !isUrlCorrect(url)) {
        throw new ManualError(HTTPStatusCodes.NOT_FOUND, ErrorMessages.INVALID_URL);
      }
      switch(method) {
        case "GET":
          let id = null;
          try {
            id = getId(url);
          } catch (error) {
            const responseInfo: responseData = {
              statusCode: HTTPStatusCodes.BAD_REQUEST,
              message: ErrorMessages.INVALID_DATA,
            }
            sendResponse(res, responseInfo);
          }
          let userList: User[] | User;
          if (id) {
            userList = await userStore.getById(id);
          } else {
            userList = await userStore.getAll();
          }
          const responseInfo: responseData = {
            statusCode: HTTPStatusCodes.OK,
            data: userList,
          }
          sendResponse(res, responseInfo);
          break;
        case "POST":
          break;
        case "PUT":
          break;
        case "DELETE":
          break;
        default:
          sendResponse(res, {
            statusCode: HTTPStatusCodes.BAD_REQUEST,
            message: ErrorMessages.INVALID_METHOD
          });
      }
    } catch (error) {
      let responseInfo: responseData;
      if (error instanceof ManualError) {
        responseInfo = {
          statusCode: error.status,
          message: error.message
        }
      } else {
        responseInfo = {
          statusCode: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
          message: ErrorMessages.INTERNAL_ERROR
        }
      }
      sendResponse(res, responseInfo);
    }
  }
};