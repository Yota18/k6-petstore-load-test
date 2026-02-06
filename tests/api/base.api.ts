import http, { Response } from 'k6/http';
import { config } from '../config/performance.config';

export class BaseApi {
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    protected get(path: string = '', tags: { name: string }): Response {
        const url = `${config.baseUrl}${this.endpoint}${path}`;
        return http.get(url, { tags });
    }

    protected post(path: string = '', payload: any, tags: { name: string }): Response {
        const url = `${config.baseUrl}${this.endpoint}${path}`;
        const headers = { 'Content-Type': 'application/json' };
        return http.post(url, JSON.stringify(payload), { headers, tags });
    }
}
