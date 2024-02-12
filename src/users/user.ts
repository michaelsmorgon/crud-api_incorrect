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
      console.log(1111);
      const userForDeletion = this.userList.find((user) => user.id === id);
      console.log(userForDeletion, this.userList);
      if (userForDeletion) {
        this.userList = this.userList.filter((data) => data.id === id);
        console.log(this.userList);
        res('Successfully deleted');
      }
      rej(new ManualError(HTTPStatusCodes.NOT_FOUND, ErrorMessages.ID_NOT_FOUND));
    });
  }
}