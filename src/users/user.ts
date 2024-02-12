import { User } from './constants';
import { ErrorMessages } from '../utils/constants';

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
      user ? res(user) : rej(new Error(ErrorMessages.ID_NOT_FOUND));
    });
  }
}