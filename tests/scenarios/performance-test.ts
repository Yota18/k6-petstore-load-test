import { Options } from 'k6/options';
import { config } from '../config/performance.config';
import { generateSummary } from '../utils/reporter';
import { criticalWorkflow } from '../workflows/critical.workflow';

export const options: Options = {
    vus: config.vus,
    duration: config.duration,
    thresholds: config.thresholds,
};

export default function () {
    criticalWorkflow();
}

export function handleSummary(data: any) {
    return generateSummary(data, { title: 'Functional Performance Report', filename: 'dashboard.html', jsonFilename: 'dist/tests/performance-data.json' });
}
