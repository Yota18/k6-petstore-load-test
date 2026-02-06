import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DIST_DIR = path.join(__dirname, '../../dist/tests');
const DASHBOARD_DATA_DIR = path.join(__dirname, '../../dashboard/public/data');
const HISTORY_FILE = path.join(DASHBOARD_DATA_DIR, 'history.json');
const LATEST_FILE = path.join(DASHBOARD_DATA_DIR, 'latest.json');

// Ensure output dir exists
if (!fs.existsSync(DASHBOARD_DATA_DIR)) {
    fs.mkdirSync(DASHBOARD_DATA_DIR, { recursive: true });
}

// Helper to read JSON
function readJson(filename) {
    const filePath = path.join(DIST_DIR, filename);
    if (fs.existsSync(filePath)) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error(`Error reading ${filename}:`, e.message);
        }
    }
    return null;
}

// 1. Read Raw Data
const perfData = readJson('performance-data.json');
const stressData = readJson('stress-data.json');
const adaptiveStressData = readJson('adaptive-stress-data.json');

if (!perfData && !stressData && !adaptiveStressData) {
    console.error('❌ No test data found. Please run tests first.');
    process.exit(1);
}

// 2. Transform Logic
const timestamp = new Date().toISOString();
const runId = Date.now();

const processedResult = {
    id: runId,
    timestamp: timestamp,
    performance: null,
    stress: null,
    adaptiveStress: null
};

if (perfData) {
    const checks = perfData.root_group.checks;
    const metrics = perfData.metrics;

    processedResult.performance = {
        totalRequests: metrics.http_reqs.values.count,
        p95: metrics.http_req_duration.values['p(95)'],
        vus: metrics.vus ? metrics.vus.values.value : 0,
        passRate: checks.passes + checks.fails > 0
            ? (checks.passes / (checks.passes + checks.fails)) * 100
            : 0,
        health: checks.fails > 0 ? 'Degraded' : 'Healthy'
    };
}

if (stressData) {
    const checks = stressData.root_group.checks;
    const metrics = stressData.metrics;

    processedResult.stress = {
        maxVus: 200, // Hardcoded config value or metrics.vus_max.values.value
        p95: metrics.http_req_duration.values['p(95)'],
        status: checks.fails > 0 ? 'Breaking Point Reached' : 'Stable'
    };
}

if (adaptiveStressData) {
    const checks = adaptiveStressData.root_group.checks;
    const metrics = adaptiveStressData.metrics;

    // Calculate error rate
    const totalRequests = metrics.http_reqs.values.count;
    const failedRequests = metrics.http_req_failed ? metrics.http_req_failed.values.passes : 0;
    const errorRate = totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;

    // Get P95 latency
    const p95 = metrics.http_req_duration.values['p(95)'];

    // Get max VUs reached
    const maxVus = metrics.vus_max ? metrics.vus_max.values.value : 500;

    // Breaking point detection logic
    // Breaking point is when error rate > 10% OR P95 > 5000ms
    const ERROR_THRESHOLD = 10; // 10%
    const LATENCY_THRESHOLD = 5000; // 5 seconds

    let breakingPoint = null;
    let maxStableVUs = maxVus;

    if (errorRate > ERROR_THRESHOLD || p95 > LATENCY_THRESHOLD) {
        breakingPoint = {
            detected: true,
            reason: errorRate > ERROR_THRESHOLD ? 'High Error Rate' : 'High Latency',
            vus: maxVus,
            errorRate: errorRate,
            p95: p95
        };
        // Estimate stable VUs (assume previous increment was stable)
        maxStableVUs = Math.max(200, maxVus - 50);
    } else {
        breakingPoint = {
            detected: false,
            reason: 'System Stable',
            vus: maxVus,
            errorRate: errorRate,
            p95: p95
        };
        maxStableVUs = maxVus;
    }

    processedResult.adaptiveStress = {
        maxVus: maxVus,
        maxStableVUs: maxStableVUs,
        breakingPoint: breakingPoint,
        p95: p95,
        errorRate: errorRate,
        totalRequests: totalRequests,
        failedRequests: failedRequests,
        passRate: checks.passes + checks.fails > 0
            ? (checks.passes / (checks.passes + checks.fails)) * 100
            : 0,
        status: breakingPoint.detected ? 'Breaking Point Found' : 'System Stable at Max Load'
    };
}

// 3. Save "Latest" (For Dashboard Current View)
fs.writeFileSync(LATEST_FILE, JSON.stringify(processedResult, null, 2));
console.log('✅ Latest results saved to dashboard/public/data/latest.json');

// 4. Update History (For Charts)
let history = [];
if (fs.existsSync(HISTORY_FILE)) {
    try {
        history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) {
        console.warn('⚠️ Could not parse existing history, starting fresh.');
    }
}

// Keep last 50 runs to avoid file getting too huge
history.push(processedResult);
if (history.length > 50) {
    history = history.slice(-50);
}

fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
console.log(`📈 History updated. Total records: ${history.length}`);

// 5. Copy raw K6 data to dashboard public folder for detailed view
const dashboardPublicData = path.join(__dirname, '../../dashboard/public/data');
if (perfData) {
    fs.copyFileSync(
        path.join(DIST_DIR, 'performance-data.json'),
        path.join(dashboardPublicData, 'performance-data.json')
    );
}
if (stressData) {
    fs.copyFileSync(
        path.join(DIST_DIR, 'stress-data.json'),
        path.join(dashboardPublicData, 'stress-data.json')
    );
}
if (adaptiveStressData) {
    fs.copyFileSync(
        path.join(DIST_DIR, 'adaptive-stress-data.json'),
        path.join(dashboardPublicData, 'adaptive-stress-data.json')
    );
}
console.log('📁 Raw K6 data copied to dashboard');

