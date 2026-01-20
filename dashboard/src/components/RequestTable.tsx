import { CheckCircle2, XCircle } from 'lucide-react';
import type { K6Data } from '../types/k6.types';
import { extractChecks } from '../utils/k6Parser';

interface RequestTableProps {
    data: K6Data;
}

export function RequestTable({ data }: RequestTableProps) {
    const checks = extractChecks(data);

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Request Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Endpoint
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Group
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Passed
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Failed
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Success Rate
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {checks.map((check, index) => {
                            const total = check.passes + check.fails;
                            const successRate = total > 0 ? (check.passes / total) * 100 : 0;
                            const isSuccess = successRate === 100;

                            return (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {check.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {check.path.split('::')[1] || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                                        {check.passes}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                                        {check.fails}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                        {successRate.toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {isSuccess ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500 inline" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500 inline" />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
