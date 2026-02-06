import { useState, useEffect } from 'react';
import type { K6Data, DetailedMetrics } from '../types/k6.types';
import { parseK6Data } from '../utils/k6Parser';

export interface TestHistory {
    id: number;
    timestamp: string;
    performance: K6Data | null;
    stress: K6Data | null;
}

export function useK6Data() {
    const [performanceData, setPerformanceData] = useState<K6Data | null>(null);
    const [stressData, setStressData] = useState<K6Data | null>(null);
    const [history, setHistory] = useState<TestHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch current K6 raw data using correct base path
                const basePath = import.meta.env.BASE_URL;
                const [perfRes, stressRes, historyRes] = await Promise.all([
                    fetch(`${basePath}data/performance-data.json`).catch(() => null),
                    fetch(`${basePath}data/stress-data.json`).catch(() => null),
                    fetch(`${basePath}data/history.json`).catch(() => null),
                ]);

                if (perfRes?.ok) {
                    const data = await perfRes.json();
                    setPerformanceData(data);
                }

                if (stressRes?.ok) {
                    const data = await stressRes.json();
                    setStressData(data);
                }

                if (historyRes?.ok) {
                    const data = await historyRes.json();
                    setHistory(data);
                }

                if (!perfRes?.ok && !stressRes?.ok) {
                    setError('No test data found. Please run tests first.');
                }
            } catch (e) {
                console.error('Failed to load test data:', e);
                setError('Failed to load test data');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Compute derived metrics
    const performanceMetrics: DetailedMetrics | null = performanceData
        ? parseK6Data(performanceData)
        : null;

    const stressMetrics: DetailedMetrics | null = stressData
        ? parseK6Data(stressData)
        : null;

    return {
        performanceData,
        stressData,
        performanceMetrics,
        stressMetrics,
        history,
        loading,
        error,
    };
}
