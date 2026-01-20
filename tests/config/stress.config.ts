import { Options } from 'k6/options';

export const stressOptions: Options = {
    scenarios: {
        adaptive_stress: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                // Phase 1: Baseline Stress Test (Original)
                { duration: '1m', target: 10 },   // 1. Warm-up
                { duration: '2m', target: 200 },  // 2. Ramp-up to baseline
                { duration: '2m', target: 200 },  // 3. Hold baseline (verify stability)

                // Phase 2: Adaptive Incremental Testing (Breaking Point Discovery)
                // Increment 1 - 250 VUs (+50)
                { duration: '30s', target: 250 },
                { duration: '1m', target: 250 },  // Hold

                // Increment 2 - 300 VUs (+50)
                { duration: '30s', target: 300 },
                { duration: '1m', target: 300 },  // Hold

                // Increment 3 - 350 VUs (+50)
                { duration: '30s', target: 350 },
                { duration: '1m', target: 350 },  // Hold

                // Increment 4 - 400 VUs (+50)
                { duration: '30s', target: 400 },
                { duration: '1m', target: 400 },  // Hold

                // Increment 5 - 450 VUs (+50)
                { duration: '30s', target: 450 },
                { duration: '1m', target: 450 },  // Hold

                // Increment 6 - 500 VUs (+50)
                { duration: '30s', target: 500 },
                { duration: '1m', target: 500 },  // Hold

                // Cool-down
                { duration: '1m', target: 0 },
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        // Warning thresholds for monitoring (won't fail the test)
        checks: ['rate>0.90'],              // 90% pass rate minimum
        http_req_duration: ['p(95)<5000'],  // P95 should be under 5s
        http_req_failed: ['rate<0.10'],     // Less than 10% failed requests
    },
};
