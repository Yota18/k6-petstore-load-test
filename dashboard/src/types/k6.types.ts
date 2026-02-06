// K6 Metric Value Structure
export interface K6MetricValues {
    avg?: number;
    min?: number;
    med?: number;
    max?: number;
    'p(90)'?: number;
    'p(95)'?: number;
    'p(99)'?: number;
    count?: number;
    rate?: number;
    value?: number;
    passes?: number;
    fails?: number;
}

// K6 Metric
export interface K6Metric {
    type: 'counter' | 'gauge' | 'rate' | 'trend';
    contains: 'default' | 'time' | 'data';
    values: K6MetricValues;
    thresholds?: Record<string, { ok: boolean }>;
}

// K6 Check
export interface K6Check {
    name: string;
    path: string;
    id: string;
    passes: number;
    fails: number;
}

// K6 Group
export interface K6Group {
    name: string;
    path: string;
    id: string;
    groups: K6Group[];
    checks: K6Check[];
}

// Full K6 Export Structure
export interface K6Data {
    root_group: K6Group;
    metrics: Record<string, K6Metric>;
    state: {
        isStdOutTTY: boolean;
        isStdErrTTY: boolean;
        testRunDurationMs: number;
    };
    options: {
        summaryTrendStats: string[];
        summaryTimeUnit: string;
        noColor: boolean;
    };
}

// Processed Data for Dashboard
export interface ProcessedTestRun {
    id: number;
    timestamp: string;
    performance: PerformanceMetrics | null;
    stress: StressMetrics | null;
}

export interface PerformanceMetrics {
    totalRequests: number;
    p95: number;
    vus: number;
    passRate: number;
    health: 'Healthy' | 'Degraded';
}

export interface StressMetrics {
    maxVus: number;
    p95: number;
    status: 'Stable' | 'Breaking Point Reached';
}

// Enhanced metrics for detailed view
export interface DetailedMetrics {
    httpReqs: number;
    avgDuration: number;
    p50Duration: number;
    p90Duration: number;
    p95Duration: number;
    maxDuration: number;
    failureRate: number;
    checksPassRate: number;
    vus: number;
    maxVus: number;
    duration: number;
    dataReceived: number;
    dataSent: number;
}
