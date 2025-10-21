'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Totala affärer</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDeals}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.completedDeals} avslutade
            </span>
            <span className="text-blue-600 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {stats.activeDeals} aktiva
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Total volym */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total volym</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVolume}</div>
          <p className="text-xs text-muted-foreground">
            Genomsnitt: {stats.avgDealSize}
          </p>
        </CardContent>
      </Card>

      {/* Success rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Genomförandegrad</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.avgClosingTime} dagar i snitt
          </p>
        </CardContent>
      </Card>

      {/* Current pipeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aktiv pipeline</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentPipeline}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3 text-yellow-600" />
            <span>2 kräver åtgärd</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
