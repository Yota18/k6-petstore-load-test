import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import type { DetailedMetrics } from '../types/k6.types';
import type { TestHistory } from '../hooks/useK6Data';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface ChartsSectionProps {
    metrics: DetailedMetrics;
    history: TestHistory[];
    type: 'performance' | 'stress' | 'adaptive';
}

export function ChartsSection({ metrics, history, type }: ChartsSectionProps) {
    // Response Time Distribution
    const responseTimeData = {
        labels: ['Min', 'Avg', 'Median', 'P90', 'P95', 'Max'],
        datasets: [
            {
                label: 'Response Time (ms)',
                data: [
                    metrics.avgDuration * 0.5, // Approximate min
                    metrics.avgDuration,
                    metrics.p50Duration,
                    metrics.p90Duration,
                    metrics.p95Duration,
                    metrics.maxDuration,
                ],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
            },
        ],
    };

    // Historical Trend
    const trendData = {
        labels: history.map(run => new Date(run.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: 'P95 Latency (ms)',
                data: history.map(run => {
                    const data = type === 'performance' ? run.performance : run.stress;
                    return data?.metrics?.http_req_duration?.values?.['p(95)'] || 0;
                }),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
            },
        ],
    };

    // Pass/Fail Distribution
    const passFailData = {
        labels: ['Passed', 'Failed'],
        datasets: [
            {
                data: [metrics.checksPassRate, 100 - metrics.checksPassRate],
                backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Response Time Distribution
                </h3>
                <div className="h-64">
                    <Bar data={responseTimeData} options={chartOptions} />
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    P95 Latency Trend
                </h3>
                <div className="h-64">
                    <Line data={trendData} options={chartOptions} />
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Check Success Rate
                </h3>
                <div className="h-64 flex items-center justify-center">
                    <div className="w-48 h-48">
                        <Doughnut data={passFailData} options={{ ...chartOptions, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Test Summary
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Requests:</span>
                        <span className="text-sm font-medium text-gray-900">{metrics.httpReqs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Test Duration:</span>
                        <span className="text-sm font-medium text-gray-900">{(metrics.duration / 1000).toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Data Received:</span>
                        <span className="text-sm font-medium text-gray-900">{(metrics.dataReceived / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Data Sent:</span>
                        <span className="text-sm font-medium text-gray-900">{(metrics.dataSent / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Throughput:</span>
                        <span className="text-sm font-medium text-gray-900">{(metrics.httpReqs / (metrics.duration / 1000)).toFixed(2)} req/s</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
