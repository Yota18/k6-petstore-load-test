import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function generateSummary(data: any, options: { title: string, filename: string, jsonFilename?: string } = { title: 'Petstore Risk Report', filename: 'dashboard.html' }) {
    const reportList: any = {
        'stdout': textSummary(data, { indent: " ", enableColors: true }),
    };

    // Add JSON data file if requested
    if (options.jsonFilename) {
        reportList[options.jsonFilename] = JSON.stringify(data);
    }

    return reportList;
}
