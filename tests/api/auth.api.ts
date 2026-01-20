import { Response } from 'k6/http';
import { BaseApi } from './base.api';
import { Logger } from '../utils/logger';

export class AuthApi extends BaseApi {
    constructor() {
        super('/user');
    }

    login(username: string, password: string): Response {
        Logger.step(`Logging in with user: ${username}`);
        return this.get(`/login?username=${username}&password=${password}`, { name: 'Auth - Login' });
    }
}
