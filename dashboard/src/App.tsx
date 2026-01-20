import { useState } from 'react';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { useK6Data } from './hooks/useK6Data';
import { SummaryCards } from './components/SummaryCards';
import { ChartsSection } from './components/ChartsSection';
import { RequestTable } from './components/RequestTable';

function App() {
    const { performanceData, stressData, adaptiveStressData, performanceMetrics, stressMetrics, adaptiveStressMetrics, history, loading, error } = useK6Data();
    const [activeTab, setActiveTab] = useState<'performance' | 'stress' | 'adaptive'>('performance');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Activity className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || (!performanceData && !stressData && !adaptiveStressData)) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-2">No Test Data Found</p>
                    <p className="text-gray-600 text-sm">Run tests first using: <code className="bg-gray-100 px-2 py-1 rounded">npm run test:all</code></p>
                </div>
            </div>
        );
    }

    const currentData = activeTab === 'performance' ? performanceData : activeTab === 'stress' ? stressData : adaptiveStressData;
    const currentMetrics = activeTab === 'performance' ? performanceMetrics : activeTab === 'stress' ? stressMetrics : adaptiveStressMetrics;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Activity className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                K6 Performance Dashboard
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                {history.length > 0 && (
                                    <>
                                        <span className="font-medium text-gray-700">{history.length}</span> test runs
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('performance')}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === 'performance'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                            disabled={!performanceData}
                        >
                            <TrendingUp className="inline h-5 w-5 mr-2" />
                            Functional Performance
                        </button>
                        <button
                            onClick={() => setActiveTab('stress')}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === 'stress'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                            disabled={!stressData}
                        >
                            <AlertTriangle className="inline h-5 w-5 mr-2" />
                            Stress Test
                        </button>
                        <button
                            onClick={() => setActiveTab('adaptive')}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === 'adaptive'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                            disabled={!adaptiveStressData}
                        >
                            <Activity className="inline h-5 w-5 mr-2" />
                            Adaptive Stress (Breaking Point)
                        </button>
                    </nav>
                </div>

                {/* Content */}
                {currentData && currentMetrics && (
                    <>
                        {/* Summary Cards */}
                        <SummaryCards metrics={currentMetrics} type={activeTab} />

                        {/* Charts */}
                        <ChartsSection metrics={currentMetrics} history={history} type={activeTab} />

                        {/* Request Breakdown Table */}
                        <RequestTable data={currentData} />
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
