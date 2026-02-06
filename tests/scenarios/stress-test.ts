import { criticalWorkflow } from '../workflows/critical.workflow';
import { stressOptions } from '../config/stress.config';
import { generateSummary } from '../utils/reporter';

// 1. Export Stress Options
export const options = stressOptions;

// 2. Custom Summary Handler for Stress Test
export function handleSummary(data: any) {
    return generateSummary(data, {
        title: 'Wave Stress Test (Recovery Pattern) 🌊',
        filename: 'stress-report.html',  // Consistent with performance test naming
        jsonFilename: 'dist/tests/adaptive-stress-data.json'  // Changed from stress-data.json
    });
}

// 3. Main Function
export default function () {
    // Custom Logger for Wave Stress Mode
    if (__VU === 1 && __ITER === 0) {
        console.log("🌊 WAVE STRESS MODE - Testing Recovery (0 → 250 → 500 → 250 → 0) 🌊");
    }

    // Reuse the critical workflow logic
    criticalWorkflow();
}
