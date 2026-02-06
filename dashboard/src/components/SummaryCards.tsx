import { Activity, AlertCircle, CheckCircle2, Clock, Users, Zap } from 'lucide-react';
import type { DetailedMetrics } from '../types/k6.types';
import { formatDuration, formatPercentage, formatNumber } from '../utils/formatters';

interface SummaryCardsProps {
    metrics: DetailedMetrics;
    type: 'performance' | 'stress';
}

export function SummaryCards({ metrics, type }: SummaryCardsProps) {
    const cards = [
        {
            title: 'Total Requests',
            value: formatNumber(metrics.httpReqs),
            icon: Activity,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Avg Response Time',
            value: formatDuration(metrics.avgDuration),
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'P95 Latency',
            value: formatDuration(metrics.p95Duration),
            icon: Zap,
            color: metrics.p95Duration > 500 ? 'text-orange-600' : 'text-green-600',
            bgColor: metrics.p95Duration > 500 ? 'bg-orange-50' : 'bg-green-50',
        },
        {
            title: 'Failure Rate',
            value: formatPercentage(metrics.failureRate),
            icon: metrics.failureRate > 5 ? AlertCircle : CheckCircle2,
            color: metrics.failureRate > 5 ? 'text-red-600' : 'text-green-600',
            bgColor: metrics.failureRate > 5 ? 'bg-red-50' : 'bg-green-50',
        },
        {
            title: 'Check Pass Rate',
            value: formatPercentage(metrics.checksPassRate),
            icon: CheckCircle2,
            color: metrics.checksPassRate > 95 ? 'text-green-600' : 'text-orange-600',
            bgColor: metrics.checksPassRate > 95 ? 'bg-green-50' : 'bg-orange-50',
        },
        {
            title: type === 'stress' ? 'Max VUs' : 'Virtual Users',
            value: formatNumber(type === 'stress' ? metrics.maxVus : metrics.vus),
            icon: Users,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 ${card.bgColor} p-3 rounded-md`}>
                                    <Icon className={`h-6 w-6 ${card.color}`} />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {card.title}
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {card.value}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
