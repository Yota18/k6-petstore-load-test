import { Response } from 'k6/http';
import { BaseApi } from './base.api';
import { Logger } from '../utils/logger';

export class PetApi extends BaseApi {
    constructor() {
        super('/pet');
    }

    findByStatus(status: string): Response {
        Logger.step(`Finding pets by status: ${status}`);
        return this.get(`/findByStatus?status=${status}`, { name: 'Pet - Find By Status' });
    }

    getPetById(petId: string | number): Response {
        Logger.step(`Getting pet details for ID: ${petId}`);
        return this.get(`/${petId}`, { name: 'Pet - Get By ID' });
    }

    createPet(payload: any): Response {
        Logger.step(`Creating new pet: ${JSON.stringify(payload.name || 'Unknown')}`);
        return this.post('', payload, { name: 'Pet - Create' });
    }
}
