'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Calendar, 
  ChevronRight,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Deal {
  id: string;
  companyName: string;
  buyer: string;
  seller: string;
  status: 'active' | 'completed' | 'on-hold';
  stage: string;
  dealSize: string;
  closingDate: string;
  requiresAction: boolean;
  lastActivity: string;
  completionRate: number;
}

export default function AdvisorDeals() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');

  // Mock data
  const deals: Deal[] = [
    {
      id: 'demo-transaction-001',
      companyName: 'TechStart AB',
      buyer: 'Nordic Capital AB',
      seller: 'Andersson Holding',
      status: 'active',
      stage: 'DD - Pågående',
      dealSize: '25M SEK',
      closingDate: '2024-03-15',
      requiresAction: true,
      lastActivity: '2 timmar sedan',
      completionRate: 65
    },
    {
      id: 'deal-002',
      companyName: 'Green Energy Solutions',
      buyer: 'EQT Partners',
      seller: 'Sustainable Ventures',
      status: 'active',
      stage: 'SPA - Förhandling',
      dealSize: '45M SEK',
      closingDate: '2024-04-01',
      requiresAction: false,
      lastActivity: '1 dag sedan',
      completionRate: 75
    },
    {
      id: 'deal-003',
      companyName: 'HealthTech Nordic',
      buyer: 'Investor AB',
      seller: 'MedTech Holding',
      status: 'completed',
      stage: 'Avslutad',
      dealSize: '32M SEK',
      closingDate: '2024-01-20',
      requiresAction: false,
      lastActivity: '2 månader sedan',
      completionRate: 100
    },
    {
      id: 'deal-004',
      companyName: 'E-commerce Pro',
      buyer: 'Kinnevik',
      seller: 'Digital Commerce AB',
      status: 'on-hold',
      stage: 'LOI - Pausad',
      dealSize: '18M SEK',
      closingDate: '2024-05-01',
      requiresAction: true,
      lastActivity: '5 dagar sedan',
      completionRate: 35
    },
    {
      id: 'deal-005',
      companyName: 'AI Solutions AB',
      buyer: 'Atomico',
      seller: 'Tech Innovations',
      status: 'active',
      stage: 'LOI - Signerad',
      dealSize: '12M SEK',
      closingDate: '2024-03-30',
      requiresAction: false,
      lastActivity: '4 timmar sedan',
      completionRate: 45
    }
  ];

  const filteredDeals = deals.filter(deal => {
    if (filter === 'all') return true;
    return deal.status === filter;
  });

  const getStatusColor = (status: Deal['status']) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'on-hold': return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status: Deal['status']) => {
    switch (status) {
      case 'active': return <Clock className="h-3 w-3" />;
      case 'completed': return <CheckCircle2 className="h-3 w-3" />;
      case 'on-hold': return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mina Transaktioner</CardTitle>
            <CardDescription>Översikt över alla dina pågående och avslutade affärer</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrera
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Alla ({deals.length})</TabsTrigger>
            <TabsTrigger value="active">Aktiva ({deals.filter(d => d.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="completed">Avslutade ({deals.filter(d => d.status === 'completed').length})</TabsTrigger>
            <TabsTrigger value="on-hold">Pausade ({deals.filter(d => d.status === 'on-hold').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4 mt-6">
            {filteredDeals.map((deal) => (
              <div 
                key={deal.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <h4 className="font-semibold">{deal.companyName}</h4>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(deal.status)} border-0 flex items-center gap-1`}
                        >
                          {getStatusIcon(deal.status)}
                          {deal.status === 'active' ? 'Aktiv' : 
                           deal.status === 'completed' ? 'Avslutad' : 'Pausad'}
                        </Badge>
                        {deal.requiresAction && (
                          <Badge variant="destructive" className="animate-pulse">
                            Kräver åtgärd
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Köpare:</span> {deal.buyer} | 
                          <span className="font-medium ml-2">Säljare:</span> {deal.seller}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {deal.dealSize}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Stängning: {new Date(deal.closingDate).toLocaleDateString('sv-SE')}
                          </span>
                          <span>{deal.stage}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-500 mb-2">
                        Senast uppdaterad: {deal.lastActivity}
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{deal.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${deal.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href={`/transaktion/${deal.id}`}>
                  <Button variant="ghost" size="sm" className="ml-4">
                    Visa detaljer
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
