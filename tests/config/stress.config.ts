import { Options } from 'k6/options';

export const stressOptions: Options = {
    scenarios: {
        adaptive_stress: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                // Phase 1: Ramp to 200 (Modified to 250 as per request)
                { duration: '1m', target: 250 },   // Ramp-up to 250
                { duration: '1m', target: 250 },   // Istirahat / Hold 1 minute

                // Phase 2: Ramp to 500
                { duration: '1m', target: 500 },   // Ramp-up to 500
                { duration: '1m', target: 500 },   // Istirahat / Hold 1 minute (Peak Load)

                // Phase 3: Ramp down to 250 (Recovery Test)
                { duration: '1m', target: 250 },   // Ramp-down 500 -> 250
                { duration: '1m', target: 250 },   // Istirahat / Hold 1 minute (Verify Recovery)

                // Phase 4: Cool-down
                { duration: '1m', target: 0 },     // Ramp-down 250 -> 0
                { duration: '1m', target: 0 },     // Final Rest (Cool-down)
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        // Warning thresholds for monitoring (won't fail the test)
        checks: ['rate>0.90'],              // 90% pass rate minimum
        http_req_duration: ['p(95)<5000'],  // P95 should be under 5s
    },
};
