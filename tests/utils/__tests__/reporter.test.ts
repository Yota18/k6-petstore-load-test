import { generateSummary } from '../reporter';

// Mock the K6 library
jest.mock('https://jslib.k6.io/k6-summary/0.0.1/index.js', () => ({
    textSummary: jest.fn((data) => 'Mocked K6 Summary Text'),
}));

describe('generateSummary', () => {
    const mockData = {
        metrics: {
            http_req_duration: { values: { avg: 100, p95: 200 } },
            http_reqs: { values: { count: 1000 } },
        },
        root_group: {
            checks: { passes: 95, fails: 5 },
        },
    };

    it('should generate basic summary without JSON', () => {
        const result = generateSummary(mockData, {
            title: 'Test Report',
            filename: 'test.html',
        });

        expect(result).toHaveProperty('stdout');
        expect(result.stdout).toBe('Mocked K6 Summary Text');
        expect(result).not.toHaveProperty('test.json');
    });

    it('should include JSON file when jsonFilename is provided', () => {
        const result = generateSummary(mockData, {
            title: 'Test Report',
            filename: 'test.html',
            jsonFilename: 'dist/test-data.json',
        });

        expect(result).toHaveProperty('stdout');
        expect(result).toHaveProperty('dist/test-data.json');
        expect(typeof result['dist/test-data.json']).toBe('string');
    });

    it('should serialize data to JSON correctly', () => {
        const result = generateSummary(mockData, {
            title: 'Test Report',
            filename: 'test.html',
            jsonFilename: 'data.json',
        });

        const parsedData = JSON.parse(result['data.json']);
        expect(parsedData).toEqual(mockData);
        expect(parsedData.metrics.http_reqs.values.count).toBe(1000);
    });

    it('should use default options when not provided', () => {
        const result = generateSummary(mockData);

        expect(result).toHaveProperty('stdout');
        expect(result.stdout).toBe('Mocked K6 Summary Text');
    });
});
