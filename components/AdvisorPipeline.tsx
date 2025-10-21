'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  Building2,
  TrendingUp,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface PipelineStage {
  name: string;
  count: number;
  value: string;
  deals: {
    id: string;
    company: string;
    value: string;
    daysInStage: number;
    risk?: 'low' | 'medium' | 'high';
  }[];
}

export default function AdvisorPipeline() {
  const stages: PipelineStage[] = [
    {
      name: 'Initial kontakt',
      count: 3,
      value: '28M SEK',
      deals: [
        { id: '1', company: 'FoodTech AB', value: '15M', daysInStage: 5 },
        { id: '2', company: 'CleanTech Solutions', value: '8M', daysInStage: 12, risk: 'medium' },
        { id: '3', company: 'Digital Agency Pro', value: '5M', daysInStage: 3 }
      ]
    },
    {
      name: 'LOI',
      count: 2,
      value: '37M SEK',
      deals: [
        { id: '4', company: 'AI Solutions AB', value: '12M', daysInStage: 8 },
        { id: '5', company: 'TechStart AB', value: '25M', daysInStage: 15, risk: 'low' }
      ]
    },
    {
      name: 'Due Diligence',
      count: 1,
      value: '25M SEK',
      deals: [
        { id: '6', company: 'TechStart AB', value: '25M', daysInStage: 22, risk: 'medium' }
      ]
    },
    {
      name: 'SPA Förhandling',
      count: 1,
      value: '45M SEK',
      deals: [
        { id: '7', company: 'Green Energy Solutions', value: '45M', daysInStage: 10 }
      ]
    },
    {
      name: 'Closing',
      count: 0,
      value: '0 SEK',
      deals: []
    }
  ];

  const totalValue = stages.reduce((sum, stage) => {
    const value = parseInt(stage.value.replace(/[^0-9]/g, ''));
    return sum + value;
  }, 0);

  const getRiskColor = (risk?: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pipeline Översikt</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalValue}M SEK</p>
            <p className="text-sm text-muted-foreground">Total pipeline-värde</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Pipeline stages */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {stages.map((stage, index) => (
            <div key={stage.name} className="relative">
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-3 mb-2">
                  <p className="text-2xl font-bold">{stage.count}</p>
                  <p className="text-xs text-gray-600">{stage.value}</p>
                </div>
                <p className="text-sm font-medium">{stage.name}</p>
              </div>
              {index < stages.length - 1 && (
                <ArrowRight className="absolute top-6 -right-2 h-4 w-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* Deal details by stage */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700">Detaljerad vy</h4>
          {stages.map((stage) => (
            stage.deals.length > 0 && (
              <div key={stage.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium">{stage.name}</h5>
                  <Badge variant="secondary">{stage.count} affärer</Badge>
                </div>
                <div className="space-y-2">
                  {stage.deals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-sm">{deal.company}</span>
                        <span className="text-sm text-gray-500">{deal.value} SEK</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {deal.daysInStage} dagar
                        </span>
                        {deal.risk && (
                          <Badge variant="outline" className={`text-xs ${getRiskColor(deal.risk)} border-0`}>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {deal.risk === 'high' ? 'Hög risk' : 
                             deal.risk === 'medium' ? 'Medium risk' : 'Låg risk'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Conversion metrics */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-3">Konverteringsgrad</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Initial → LOI</span>
              <div className="flex items-center gap-2">
                <Progress value={67} className="w-24" />
                <span className="font-medium">67%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>LOI → DD</span>
              <div className="flex items-center gap-2">
                <Progress value={85} className="w-24" />
                <span className="font-medium">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>DD → Closing</span>
              <div className="flex items-center gap-2">
                <Progress value={92} className="w-24" />
                <span className="font-medium">92%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
