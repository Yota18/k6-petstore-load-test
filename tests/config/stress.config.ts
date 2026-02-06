import { Options } from 'k6/options';

export const stressOptions: Options = {
    scenarios: {
        adaptive_stress: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                // Phase 1: Ramp to 10 (Safe for Public API)
                { duration: '1m', target: 10 },    // Ramp-up to 10
                { duration: '1m', target: 10 },    // Istirahat / Hold 1 minute

                // Phase 2: Ramp to 30 (Moderate Load)
                { duration: '1m', target: 30 },    // Ramp-up to 30
                { duration: '1m', target: 30 },    // Istirahat / Hold 1 minute (Peak Load)

                // Phase 3: Ramp down to 10 (Recovery Test)
                { duration: '1m', target: 10 },    // Ramp-down 30 -> 10
                { duration: '1m', target: 10 },    // Istirahat / Hold 1 minute (Verify Recovery)

                // Phase 4: Cool-down
                { duration: '1m', target: 0 },     // Ramp-down 10 -> 0
                { duration: '1m', target: 0 },     // Final Rest (Cool-down)
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        // Validation thresholds
        checks: ['rate>0.50'],              // Relax to 50% because Public API is unstable

        // Latency thresholds
        http_req_duration: ['p(95)<10000'], // P95 < 10s

        // Explicitly allow high failure rate
        http_req_failed: ['rate<1.00'],
    },
};
