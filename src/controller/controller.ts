import { IncomingMessage, ServerResponse } from 'http';
import { UserStore } from '../users/user';
import { User, UserInfo } from '../users/constants';
import { getBody, getId, isUrlCorrect } from '../utils/requestData';
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
      const id = getId(url);
      let user = null;
      switch(method) {
        case "GET":
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
          if (isUrlCorrect(url) && id !== null) {
            throw new ManualError(HTTPStatusCodes.NOT_FOUND, ErrorMessages.INVALID_URL);
          }
          user = await getBody(req);
          const newUser = await userStore.create(user);
          sendResponse(res, {
            statusCode: HTTPStatusCodes.CREATED,
            data: newUser,
          });
          break;
        case "PUT":
          if (isUrlCorrect(url) && id === null) {
            throw new ManualError(HTTPStatusCodes.NOT_FOUND, ErrorMessages.INVALID_URL);
          }
          if (id) {
            user = await getBody(req);
            const updatedUser = await userStore.update(id, user);
            sendResponse(res, {
              statusCode: HTTPStatusCodes.OK,
              data: updatedUser,
            });
          } else {
            sendResponse(res, {
              statusCode: HTTPStatusCodes.BAD_REQUEST,
              message: ErrorMessages.INVALID_DATA
            });
          }
          break;
        case "DELETE":
          if (isUrlCorrect(url) && id === null) {
            throw new ManualError(HTTPStatusCodes.NOT_FOUND, ErrorMessages.INVALID_URL);
          }
          if (id) {
            const result = await userStore.delete(id);
            sendResponse(res, {
              statusCode: HTTPStatusCodes.NO_CONTENT,
              message: result,
            });
          } else {
            sendResponse(res, {
              statusCode: HTTPStatusCodes.BAD_REQUEST,
              message: ErrorMessages.INVALID_DATA
            });
          }
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