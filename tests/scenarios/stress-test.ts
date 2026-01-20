import { criticalWorkflow } from '../workflows/critical.workflow';
import { stressOptions } from '../config/stress.config';
import { generateSummary } from '../utils/reporter';

// 1. Export Stress Options
export const options = stressOptions;

// 2. Custom Summary Handler for Stress Test
export function handleSummary(data: any) {
    return generateSummary(data, {
        title: 'Adaptive Stress Test - Breaking Point Discovery 🔥',
        filename: 'stress-report.html',  // Consistent with performance test naming
        jsonFilename: 'dist/adaptive-stress-data.json'  // Changed from stress-data.json
    });
}

// 3. Main Function
export default function () {
    // Custom Logger for Adaptive Stress Mode
    if (__VU === 1 && __ITER === 0) {
        console.log("🔥 ADAPTIVE STRESS MODE - Baseline 200 VUs → Breaking Point Discovery (500 VUs)! 🔥");
    }

    // Reuse the critical workflow logic
    criticalWorkflow();
}
