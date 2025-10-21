'use client';

import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';

interface StatsData {
  totalDeals: number;
  activeDeals: number;
  completedDeals: number;
  totalVolume: string;
  avgDealSize: string;
  successRate: number;
  avgClosingTime: number;
  currentPipeline: string;
}

export default function AdvisorStats() {
  // Mock data - skulle hämtas från API
  const stats: StatsData = {
    totalDeals: 23,
    activeDeals: 5,
    completedDeals: 18,
    totalVolume: "245M SEK",
    avgDealSize: "10.7M SEK",
    successRate: 78,
    avgClosingTime: 65,
    currentPipeline: "82M SEK"
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total affärer */}
      <div className="bg-white p-6 rounded-2xl shadow-card">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Totala affärer</h3>
          <Users className="h-4 w-4 text-gray-400" />
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold">{stats.totalDeals}</div>
          <div className="flex items-center space-x-2 text-xs text-gray-600 mt-2">
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.completedDeals} avslutade
            </span>
            <span className="text-blue-600 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {stats.activeDeals} aktiva
            </span>
          </div>
        </div>
      </div>

      {/* Total volym */}
      <div className="bg-white p-6 rounded-2xl shadow-card">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Total volym</h3>
          <DollarSign className="h-4 w-4 text-gray-400" />
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold">{stats.totalVolume}</div>
          <p className="text-xs text-gray-600 mt-2">
            Genomsnitt: {stats.avgDealSize}
          </p>
        </div>
      </div>

      {/* Success rate */}
      <div className="bg-white p-6 rounded-2xl shadow-card">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Genomförandegrad</h3>
          <TrendingUp className="h-4 w-4 text-gray-400" />
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-gray-600 mt-2">
            {stats.avgClosingTime} dagar i snitt
          </p>
        </div>
      </div>

      {/* Current pipeline */}
      <div className="bg-white p-6 rounded-2xl shadow-card">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Aktiv pipeline</h3>
          <Activity className="h-4 w-4 text-gray-400" />
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold">{stats.currentPipeline}</div>
          <div className="flex items-center space-x-2 text-xs text-gray-600 mt-2">
            <AlertCircle className="h-3 w-3 text-yellow-600" />
            <span>2 kräver åtgärd</span>
          </div>
        </div>
      </div>
    </div>
  );
}
