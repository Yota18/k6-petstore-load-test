import type { K6Data, DetailedMetrics, K6Check } from '../types/k6.types';

export function parseK6Data(data: K6Data): DetailedMetrics {
    const metrics = data.metrics;

    return {
        httpReqs: metrics.http_reqs?.values?.count || 0,
        avgDuration: metrics.http_req_duration?.values?.avg || 0,
        p50Duration: metrics.http_req_duration?.values?.med || 0,
        p90Duration: metrics.http_req_duration?.values?.['p(90)'] || 0,
        p95Duration: metrics.http_req_duration?.values?.['p(95)'] || 0,
        maxDuration: metrics.http_req_duration?.values?.max || 0,
        failureRate: (metrics.http_req_failed?.values?.rate || 0) * 100,
        checksPassRate: (metrics.checks?.values?.rate || 0) * 100,
        vus: metrics.vus?.values?.value || 0,
        maxVus: metrics.vus_max?.values?.value || 0,
        duration: data.state?.testRunDurationMs || 0,
        dataReceived: metrics.data_received?.values?.count || 0,
        dataSent: metrics.data_sent?.values?.count || 0,
    };
}

export function extractChecks(data: K6Data): K6Check[] {
    const checks: K6Check[] = [];

    function collectChecks(group: any) {
        if (group.checks) {
            checks.push(...group.checks);
        }
        if (group.groups) {
            group.groups.forEach(collectChecks);
        }
    }

    collectChecks(data.root_group);
    return checks;
}

export function extractGroups(data: K6Data) {
    return data.root_group.groups || [];
}
