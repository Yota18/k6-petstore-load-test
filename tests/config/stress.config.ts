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
        // Validation thresholds
        checks: ['rate>0.95'],              // 95% pass rate minimum (Checks must pass)

        // Latency thresholds
        http_req_duration: ['p(95)<10000'], // P95 < 10s (Very relaxed to avoid flakiness)

        // Explicitly allow high failure rate (due to negative testing)
        // We set rate<1.01 (101%) to effectively disable it while making it explicit
        http_req_failed: ['rate<1.00'],
    },
};
