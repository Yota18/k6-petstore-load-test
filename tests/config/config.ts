export const config = {
    baseUrl: __ENV.BASE_URL || 'https://petstore.swagger.io/v2',
    vus: __ENV.VUS ? parseInt(__ENV.VUS) : 10,
    duration: __ENV.DURATION || '30s',
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        checks: ['rate<0.01'],             // Use checks (assertions) instead of raw HTTP errors to support negative testing
    },
};
