import { check, group, sleep } from 'k6';
import { testData } from '../data/testData';
import { AuthApi } from '../api/auth.api';
import { PetApi } from '../api/pet.api';
import { StoreApi } from '../api/store.api';
import { Logger } from '../utils/logger';

const authApi = new AuthApi();
const petApi = new PetApi();
const storeApi = new StoreApi();

export function criticalWorkflow() {
    // 1. Authentication (High Traffic Gatekeeper)
    group('🔐 Authentication', () => {
        Logger.scenario('Authentication');

        // Positive
        const loginRes = authApi.login(testData.users.validUser.username, testData.users.validUser.password);
        check(loginRes, {
            'Login Successful (200)': (r) => r.status === 200,
        });

        // Negative
        Logger.log('🧪 Testing Invalid Login...', 'warning');
        const invalidLoginRes = authApi.login(testData.users.invalidUser.username, testData.users.invalidUser.password);
        check(invalidLoginRes, {
            'Login Failed Correctly (200/400/404)': (r) => [200, 400, 404].includes(r.status),
        });
    });

    sleep(1);

    // 2. Product Discovery
    group('🔍 Product Discovery', () => {
        Logger.scenario('Product Discovery');

        // Positive
        const findRes = petApi.findByStatus(testData.pets.validPet.status);
        check(findRes, {
            'Find Available Pets (200)': (r) => r.status === 200,
        });

        // Negative
        Logger.log('🧪 Testing Invalid Status Search...', 'warning');
        const invalidFindRes = petApi.findByStatus('invalid_status_garbage');
        check(invalidFindRes, {
            'Handle Invalid Status (200/400)': (r) => r.status === 200 || r.status === 400,
        });
    });

    sleep(1);

    // 3. Product Detail
    group('📄 Product Detail', () => {
        Logger.scenario('Product Detail');

        // Positive
        const validId = testData.pets.validPet.id;
        const detailRes = petApi.getPetById(validId);
        check(detailRes, {
            'Get Pet Detail (200)': (r) => r.status === 200,
        });

        // Negative
        Logger.log('🧪 Testing Invalid Pet ID...', 'warning');
        const invalidDetailRes = petApi.getPetById(-1);
        check(invalidDetailRes, {
            'Get Invalid Pet ID (404)': (r) => r.status === 404, // Fail Fast
        });
    });

    sleep(1);

    // 5. Inventory Management (Admin)
    group('📦 Inventory Management', () => {
        Logger.scenario('Inventory Management');

        // Positive
        const createRes = petApi.createPet(testData.pets.validPet);
        check(createRes, {
            'Create Pet (200)': (r) => r.status === 200,
        });

        // Negative
        Logger.log('🧪 Testing Invalid Pet Creation...', 'warning');
        const invalidCreateRes = petApi.createPet(testData.pets.invalidPet);
        check(invalidCreateRes, {
            'Create Invalid Pet (200/400/500)': (r) => [200, 400, 405, 500].includes(r.status),
        });
    });

    sleep(1);

    // 4. Checkout/Transaction
    group('💰 Checkout', () => {
        Logger.scenario('Checkout');

        // Positive
        const orderRes = storeApi.placeOrder(testData.orders.validOrder);
        check(orderRes, {
            'Place Order (200)': (r) => r.status === 200,
        });

        // Negative
        Logger.log('🧪 Testing Invalid Checkout Payload...', 'warning');
        const invalidOrderRes = storeApi.placeOrder(testData.orders.invalidOrder);
        check(invalidOrderRes, {
            'Place Invalid Order (200/400)': (r) => [200, 400].includes(r.status),
        });
    });
}
