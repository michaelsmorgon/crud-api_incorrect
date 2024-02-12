import { v4 } from 'uuid';
import { User, UserInfo } from './constants';
import { ErrorMessages, HTTPStatusCodes } from '../utils/constants';
import ManualError from '../error/manualError';

export class UserStore {
  constructor(private userList: User[]) {}

  async getAll(): Promise<User[]> {
    console.log('Request method: GET.');
    return new Promise((res) => {
      res(this.userList);
    });
  }

  async getById(id: string): Promise<User> {
    console.log(`Request method: GET. Id: ${id}`);
    return new Promise((res, rej) => {
      const user = this.userList.find((user) => user.id === id);
      user ? res(user) : rej(new ManualError(HTTPStatusCodes.NOT_FOUND, ErrorMessages.ID_NOT_FOUND));
    });
  }

  async create(user: UserInfo): Promise<User> {
    console.log(`Request method: POST. INFO: ${JSON.stringify(user)}`);
    return new Promise((res) => {
      const newUser = { ...user, id: v4() };
      this.userList.push(newUser);
      res(newUser);
    });
  }

  async delete(id: string): Promise<string> {
    console.log(`Request method: DELETE. Id: ${id}`);
    return new Promise((res, rej) => {
      const userForDeletion = this.userList.find((user) => user.id === id);
      if (userForDeletion) {
        this.userList = this.userList.filter((data) => data.id !== id);
        res('Successfully deleted');
      }
      rej(new ManualError(HTTPStatusCodes.NOT_FOUND, ErrorMessages.ID_NOT_FOUND));
    });
  }

  async update(id: string, user: UserInfo): Promise<User> {
    console.log(`Request method: PUT. Id: ${id}. INFO: ${JSON.stringify(user)}`);
    return new Promise((res, rej) => {
      const userForUpdating = this.userList.find((user) => user.id === id);
      if (!userForUpdating) {
        rej(new ManualError(HTTPStatusCodes.NOT_FOUND, ErrorMessages.ID_NOT_FOUND));
      }
      const updatedUser = { ...user, id };
      this.userList.splice(this.userList.indexOf(userForUpdating!), 1, updatedUser);
      res(updatedUser);
    });
  }
}