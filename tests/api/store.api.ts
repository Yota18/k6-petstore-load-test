import { Response } from 'k6/http';
import { BaseApi } from './base.api';
import { Logger } from '../utils/logger';

export class StoreApi extends BaseApi {
    constructor() {
        super('/store');
    }

    placeOrder(payload: any): Response {
        Logger.step(`Placing order for petId: ${payload.petId || 'Missing'}`);
        return this.post('/order', payload, { name: 'Store - Place Order' });
    }
}
