import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { CompanyData } from './SalesProcessDataModal'

// Register fonts - only on client side
if (typeof window !== 'undefined') {
  try {
    Font.register({
      family: 'Helvetica',
      fonts: [
        { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 'normal' },
        { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 'bold' },
      ],
    })
  } catch (e) {
    // Font already registered or error - ignore
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
  },
  coverPage: {
    padding: 50,
    backgroundColor: '#1F3C58',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverLogo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 40,
    textAlign: 'center',
  },
  coverCompanyName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  coverDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 60,
    textAlign: 'center',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: '2 solid #1F3C58',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F3C58',
    letterSpacing: 1,
  },
  headerPageNum: {
    fontSize: 10,
    color: '#666666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: '1 solid #E5E5E5',
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 8,
    marginTop: 15,
  },
  highlightBox: {
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
    borderLeft: '4 solid #1F3C58',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
    borderLeft: '4 solid #F59E0B',
  },
  successBox: {
    backgroundColor: '#D1FAE5',
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
    borderLeft: '4 solid #10B981',
  },
  text: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 8,
    lineHeight: 1.6,
  },
  boldText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 4,
  },
  smallText: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 10,
  },
  table: {
    marginTop: 10,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E5E5E5',
    paddingVertical: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    borderBottom: '2 solid #1F3C58',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#333333',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F3C58',
  },
  checkItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  checkBox: {
    width: 14,
    height: 14,
    marginRight: 8,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxChecked: {
    backgroundColor: '#10B981',
  },
  checkBoxUnchecked: {
    backgroundColor: '#E5E5E5',
  },
  checkText: {
    fontSize: 10,
    color: '#333333',
    flex: 1,
  },
  summaryBox: {
    backgroundColor: '#F0F4F8',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.7,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  riskLabel: {
    fontSize: 10,
    color: '#666666',
    width: 120,
  },
  riskBar: {
    height: 8,
    flex: 1,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginRight: 10,
  },
  riskFill: {
    height: 8,
    borderRadius: 4,
  },
  riskValue: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    borderTop: '1 solid #E5E5E5',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#999999',
  },
  executiveBox: {
    backgroundColor: '#1F3C58',
    padding: 25,
    borderRadius: 8,
    marginBottom: 25,
  },
  executiveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  executiveText: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 1.7,
    opacity: 0.95,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  metricBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
    marginRight: '2%',
  },
  metricLabel: {
    fontSize: 9,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F3C58',
  },
  metricNote: {
    fontSize: 9,
    color: '#666666',
    marginTop: 4,
  },
  // Chart styles
  chartContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 15,
    textAlign: 'center',
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    width: 60,
    fontSize: 9,
    color: '#666666',
  },
  barContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  bar: {
    height: 20,
    borderRadius: 4,
  },
  barValue: {
    width: 50,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F3C58',
    textAlign: 'right',
  },
  // Pie chart (simplified)
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  pieSegment: {
    marginHorizontal: 5,
    alignItems: 'center',
  },
  pieBar: {
    height: 60,
    width: 40,
    borderRadius: 4,
    marginBottom: 5,
  },
  pieLegend: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
  pieValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F3C58',
    textAlign: 'center',
  },
  // Timeline
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1F3C58',
    marginRight: 12,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 2,
  },
  timelineDesc: {
    fontSize: 9,
    color: '#666666',
  },
  // KPI Card
  kpiRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
  kpiTrend: {
    fontSize: 9,
    marginTop: 4,
  },
})

interface AnalysisResult {
  executiveSummary: string
  companyOverview: string
  financialAnalysis: string
  businessRelationsAnalysis: string
  keyPersonAnalysis: string
  balanceSheetAnalysis: string
  legalAnalysis: string
  riskAssessment: {
    overall: 'low' | 'medium' | 'high'
    financialRisk: number
    operationalRisk: number
    keyPersonRisk: number
    customerRisk: number
    legalRisk: number
  }
  recommendations: string[]
  nextSteps: string[]
  strengths: string[]
  weaknesses: string[]
  valuationFactors: string
}

interface SalesProcessReportPDFProps {
  companyData: CompanyData
  analysis: AnalysisResult
  generatedAt: string
}

// Simple bar chart component
function BarChart({ data, title }: { data: { label: string; value: number; maxValue?: number }[]; title: string }) {
  const maxVal = Math.max(...data.map(d => d.maxValue || d.value))
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      {data.map((item, idx) => (
        <View key={idx} style={styles.barChartRow}>
          <Text style={styles.barLabel}>{item.label}</Text>
          <View style={styles.barContainer}>
            <View style={{ 
              ...styles.bar, 
              width: `${(item.value / maxVal) * 100}%`,
              backgroundColor: idx === 0 ? '#1F3C58' : idx === 1 ? '#3B6B8C' : '#6B9DC0'
            }} />
          </View>
          <Text style={styles.barValue}>{item.value} MSEK</Text>
        </View>
      ))}
    </View>
  )
}

// Horizontal stacked bar for customer concentration
function CustomerConcentrationChart({ customers }: { customers: { name: string; percentage: string }[] }) {
  const colors = ['#1F3C58', '#3B6B8C', '#6B9DC0', '#9BC4DE', '#CBD5E1']
  const total = customers.reduce((sum, c) => sum + parseFloat(c.percentage || '0'), 0)
  const otherPct = 100 - total
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Kundkoncentration (% av omsättning)</Text>
      <View style={{ flexDirection: 'row', height: 30, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
        {customers.map((c, idx) => (
          <View key={idx} style={{ 
            width: `${parseFloat(c.percentage || '0')}%`, 
            backgroundColor: colors[idx % colors.length],
            height: 30 
          }} />
        ))}
        {otherPct > 0 && (
          <View style={{ width: `${otherPct}%`, backgroundColor: '#E5E5E5', height: 30 }} />
        )}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {customers.map((c, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 5 }}>
            <View style={{ width: 10, height: 10, backgroundColor: colors[idx % colors.length], marginRight: 5, borderRadius: 2 }} />
            <Text style={{ fontSize: 8, color: '#666666' }}>{c.name}: {c.percentage}%</Text>
          </View>
        ))}
        {otherPct > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 5 }}>
            <View style={{ width: 10, height: 10, backgroundColor: '#E5E5E5', marginRight: 5, borderRadius: 2 }} />
            <Text style={{ fontSize: 8, color: '#666666' }}>Övriga: {otherPct.toFixed(0)}%</Text>
          </View>
        )}
      </View>
    </View>
  )
}

// Risk radar (simplified as horizontal bars)
function RiskRadar({ risks }: { risks: { label: string; value: number }[] }) {
  const getRiskColor = (value: number) => {
    if (value <= 30) return '#10B981'
    if (value <= 60) return '#F59E0B'
    return '#EF4444'
  }
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Riskprofil per kategori</Text>
      {risks.map((risk, idx) => (
        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ width: 100, fontSize: 9, color: '#666666' }}>{risk.label}</Text>
          <View style={{ flex: 1, height: 12, backgroundColor: '#E5E5E5', borderRadius: 6, marginHorizontal: 8 }}>
            <View style={{ 
              height: 12, 
              width: `${risk.value}%`, 
              backgroundColor: getRiskColor(risk.value),
              borderRadius: 6 
            }} />
          </View>
          <View style={{ 
            width: 50, 
            backgroundColor: getRiskColor(risk.value),
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 4,
          }}>
            <Text style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>
              {risk.value <= 30 ? 'Låg' : risk.value <= 60 ? 'Medel' : 'Hög'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

export default function SalesProcessReportPDF({ 
  companyData, 
  analysis, 
  generatedAt 
}: SalesProcessReportPDFProps) {
  const getRiskColor = (value: number) => {
    if (value <= 30) return '#10B981'
    if (value <= 60) return '#F59E0B'
    return '#EF4444'
  }

  const companyName = companyData.companyName || companyData.scrapedData?.title || 'Företaget'
  
  // Parse revenue data for charts
  const revenueData = companyData.financialDocs.revenueByYear ? [
    { label: `${new Date().getFullYear()}`, value: parseFloat(companyData.financialDocs.revenueByYear.year1) || 0 },
    { label: `${new Date().getFullYear() - 1}`, value: parseFloat(companyData.financialDocs.revenueByYear.year2) || 0 },
    { label: `${new Date().getFullYear() - 2}`, value: parseFloat(companyData.financialDocs.revenueByYear.year3) || 0 },
  ] : []
  
  const profitData = companyData.financialDocs.profitByYear ? [
    { label: `${new Date().getFullYear()}`, value: parseFloat(companyData.financialDocs.profitByYear.year1) || 0 },
    { label: `${new Date().getFullYear() - 1}`, value: parseFloat(companyData.financialDocs.profitByYear.year2) || 0 },
    { label: `${new Date().getFullYear() - 2}`, value: parseFloat(companyData.financialDocs.profitByYear.year3) || 0 },
  ] : []

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverLogo}>BOLAXO</Text>
        <Text style={styles.coverTitle}>Försäljningsförberedande</Text>
        <Text style={styles.coverTitle}>Analys & Rapport</Text>
        <Text style={styles.coverSubtitle}>En komplett genomgång av ditt företag</Text>
        <View style={{ marginTop: 40 }}>
          <Text style={styles.coverCompanyName}>{companyName}</Text>
          {companyData.orgNumber && (
            <Text style={{ ...styles.coverSubtitle, fontSize: 14 }}>
              Org.nr: {companyData.orgNumber}
            </Text>
          )}
        </View>
        <Text style={styles.coverDate}>Genererad: {generatedAt}</Text>
        <Text style={{ ...styles.coverDate, marginTop: 10, fontSize: 10 }}>
          KONFIDENTIELLT DOKUMENT
        </Text>
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>Innehållsförteckning</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Innehållsförteckning</Text>
          
          <View style={{ marginTop: 20 }}>
            {[
              { title: 'Sammanfattning för ledningen', page: 3 },
              { title: 'Nyckeltal & KPI:er', page: 4 },
              { title: 'Företagsöversikt', page: 5 },
              { title: 'Finansiell analys & trender', page: 6 },
              { title: 'Affärsrelationer & kundbas', page: 7 },
              { title: 'Organisation & nyckelpersoner', page: 8 },
              { title: 'Balansräkning & tillgångar', page: 9 },
              { title: 'Juridisk dokumentation', page: 10 },
              { title: 'Riskbedömning & analys', page: 11 },
              { title: 'Styrkor & svagheter (SWOT)', page: 12 },
              { title: 'Värdering & marknadsjämförelse', page: 13 },
              { title: 'Rekommendationer & nästa steg', page: 14 },
            ].map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center' }}>
                <Text style={{ ...styles.text, flex: 1, marginBottom: 0 }}>{item.title}</Text>
                <View style={{ borderBottom: '1 dotted #CCCCCC', flex: 1, marginHorizontal: 10, marginBottom: 4 }} />
                <Text style={{ ...styles.text, marginBottom: 0, width: 20, textAlign: 'right' }}>{item.page}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 2</Text>
        </View>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sammanfattning för ledningen</Text>
          
          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Övergripande bedömning</Text>
            <Text style={styles.executiveText}>{analysis.executiveSummary}</Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Riskprofil</Text>
              <Text style={{ 
                ...styles.metricValue, 
                color: analysis.riskAssessment.overall === 'low' ? '#10B981' : 
                       analysis.riskAssessment.overall === 'medium' ? '#F59E0B' : '#EF4444' 
              }}>
                {analysis.riskAssessment.overall === 'low' ? 'Låg' : 
                 analysis.riskAssessment.overall === 'medium' ? 'Medel' : 'Hög'}
              </Text>
              <Text style={styles.metricNote}>Baserat på 5 riskfaktorer</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Styrkor identifierade</Text>
              <Text style={styles.metricValue}>{analysis.strengths.length}</Text>
              <Text style={styles.metricNote}>Positiva faktorer</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Förbättringsområden</Text>
              <Text style={styles.metricValue}>{analysis.weaknesses.length}</Text>
              <Text style={styles.metricNote}>Att åtgärda</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Rekommendationer</Text>
              <Text style={styles.metricValue}>{analysis.recommendations.length}</Text>
              <Text style={styles.metricNote}>Åtgärdsförslag</Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Snabbsammanfattning av styrkor</Text>
          {analysis.strengths.slice(0, 4).map((strength, idx) => (
            <View key={idx} style={styles.checkItem}>
              <View style={{ ...styles.checkBox, ...styles.checkBoxChecked }}>
                <Text style={{ fontSize: 10, color: '#FFFFFF' }}>✓</Text>
              </View>
              <Text style={styles.checkText}>{strength}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 3</Text>
        </View>
      </Page>

      {/* Key Metrics Dashboard - NEW PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nyckeltal & KPI:er</Text>
          
          {/* KPI Cards */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>
                {revenueData[0]?.value || '-'} MSEK
              </Text>
              <Text style={styles.kpiLabel}>Omsättning {new Date().getFullYear()}</Text>
              {revenueData[0]?.value && revenueData[1]?.value && (
                <Text style={{ 
                  ...styles.kpiTrend, 
                  color: revenueData[0].value >= revenueData[1].value ? '#10B981' : '#EF4444' 
                }}>
                  {revenueData[0].value >= revenueData[1].value ? '↑' : '↓'} {Math.abs(((revenueData[0].value - revenueData[1].value) / revenueData[1].value) * 100).toFixed(0)}% YoY
                </Text>
              )}
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>
                {profitData[0]?.value || '-'} MSEK
              </Text>
              <Text style={styles.kpiLabel}>Resultat {new Date().getFullYear()}</Text>
              {profitData[0]?.value && revenueData[0]?.value && (
                <Text style={styles.kpiTrend}>
                  {((profitData[0].value / revenueData[0].value) * 100).toFixed(1)}% marginal
                </Text>
              )}
            </View>
            <View style={{ ...styles.kpiCard, marginRight: 0 }}>
              <Text style={styles.kpiValue}>
                {companyData.businessRelations.topCustomers.length}
              </Text>
              <Text style={styles.kpiLabel}>Huvudkunder</Text>
              <Text style={styles.kpiTrend}>Dokumenterade</Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={{ ...styles.kpiValue, color: '#10B981' }}>
                {companyData.financialDocs.hasAuditedReports ? '✓' : '✗'}
              </Text>
              <Text style={styles.kpiLabel}>Reviderade bokslut</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={{ ...styles.kpiValue, color: companyData.keyPerson.documentedProcesses ? '#10B981' : '#F59E0B' }}>
                {companyData.keyPerson.documentedProcesses ? '✓' : '✗'}
              </Text>
              <Text style={styles.kpiLabel}>Dokumenterade processer</Text>
            </View>
            <View style={{ ...styles.kpiCard, marginRight: 0 }}>
              <Text style={{ ...styles.kpiValue, color: '#10B981' }}>5/5</Text>
              <Text style={styles.kpiLabel}>Juridiska dokument</Text>
            </View>
          </View>

          {/* Revenue Trend Chart */}
          {revenueData.length > 0 && revenueData.some(d => d.value > 0) && (
            <BarChart 
              data={revenueData.reverse()} 
              title="Omsättningsutveckling (MSEK)" 
            />
          )}

          {/* Profit Trend Chart */}
          {profitData.length > 0 && profitData.some(d => d.value > 0) && (
            <BarChart 
              data={profitData.reverse()} 
              title="Resultatutveckling (MSEK)" 
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 4</Text>
        </View>
      </Page>

      {/* Company Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Företagsöversikt</Text>
          
          {companyData.scrapedData && (
            <View style={styles.highlightBox}>
              <Text style={styles.label}>Företagsinformation</Text>
              {companyData.scrapedData.title && (
                <Text style={styles.value}>{companyData.scrapedData.title}</Text>
              )}
              {companyData.scrapedData.description && (
                <Text style={styles.text}>{companyData.scrapedData.description}</Text>
              )}
              {companyData.websiteUrl && (
                <Text style={styles.smallText}>Webbplats: {companyData.websiteUrl}</Text>
              )}
            </View>
          )}

          <Text style={styles.text}>{analysis.companyOverview}</Text>

          {companyData.scrapedData?.highlights && companyData.scrapedData.highlights.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Nyckelområden från hemsidan</Text>
              {companyData.scrapedData.highlights.map((highlight, idx) => (
                <View key={idx} style={styles.checkItem}>
                  <View style={{ ...styles.checkBox, ...styles.checkBoxChecked }}>
                    <Text style={{ fontSize: 8, color: '#FFFFFF' }}>•</Text>
                  </View>
                  <Text style={styles.checkText}>{highlight}</Text>
                </View>
              ))}
            </>
          )}

          {/* Company Timeline */}
          <Text style={styles.subsectionTitle}>Företagets milstolpar</Text>
          <View style={{ marginTop: 10 }}>
            {[
              { title: 'Grundat', desc: 'Företaget etablerades' },
              { title: 'Tillväxtfas', desc: 'Expanderade verksamheten' },
              { title: 'Mognadsfas', desc: 'Stabil lönsamhet uppnådd' },
              { title: 'Nuläge', desc: 'Redo för nästa steg' },
            ].map((item, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 5</Text>
        </View>
      </Page>

      {/* Financial Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finansiell Analys & Trender</Text>
          
          {companyData.generatedSummaries.financialDocs && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>AI-genererad sammanfattning</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.financialDocs}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.financialAnalysis}</Text>

          {/* Financial data table */}
          <Text style={styles.subsectionTitle}>Finansiell dokumentation</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Dokumenttyp</Text>
              <Text style={styles.tableHeaderCell}>Status</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Reviderade årsredovisningar</Text>
              <Text style={{ ...styles.tableCell, color: companyData.financialDocs.hasAuditedReports ? '#10B981' : '#EF4444' }}>
                {companyData.financialDocs.hasAuditedReports ? '✓ Tillgängliga' : '✗ Saknas'}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Månadsrapporter</Text>
              <Text style={{ ...styles.tableCell, color: companyData.financialDocs.hasMonthlyReports ? '#10B981' : '#F59E0B' }}>
                {companyData.financialDocs.hasMonthlyReports ? '✓ Tillgängliga' : '○ Ej tillgängliga'}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Budget & prognoser</Text>
              <Text style={{ ...styles.tableCell, color: companyData.financialDocs.budgetAvailable ? '#10B981' : '#F59E0B' }}>
                {companyData.financialDocs.budgetAvailable ? '✓ Tillgängliga' : '○ Ej tillgängliga'}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Prognoshorisont</Text>
              <Text style={styles.tableCell}>{companyData.financialDocs.forecastYears || '-'} år</Text>
            </View>
          </View>

          {companyData.financialDocs.ebitdaNotes && (
            <>
              <Text style={styles.subsectionTitle}>EBITDA-justeringar & engångsposter</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.text}>{companyData.financialDocs.ebitdaNotes}</Text>
              </View>
            </>
          )}

          {companyData.financialDocs.oneTimeItems && (
            <View style={styles.warningBox}>
              <Text style={styles.boldText}>Engångsposter att beakta</Text>
              <Text style={styles.text}>{companyData.financialDocs.oneTimeItems}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 6</Text>
        </View>
      </Page>

      {/* Business Relations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affärsrelationer & Kundbas</Text>
          
          {companyData.generatedSummaries.businessRelations && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>AI-genererad sammanfattning</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.businessRelations}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.businessRelationsAnalysis}</Text>

          {/* Customer Concentration Chart */}
          {companyData.businessRelations.topCustomers.some(c => c.name) && (
            <CustomerConcentrationChart customers={companyData.businessRelations.topCustomers.filter(c => c.name)} />
          )}

          {/* Customer table */}
          {companyData.businessRelations.topCustomers.some(c => c.name) && (
            <>
              <Text style={styles.subsectionTitle}>Kundöversikt</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderCell}>Kund</Text>
                  <Text style={styles.tableHeaderCell}>Andel</Text>
                  <Text style={styles.tableHeaderCell}>Riskbedömning</Text>
                </View>
                {companyData.businessRelations.topCustomers
                  .filter(c => c.name)
                  .map((customer, idx) => (
                    <View key={idx} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{customer.name}</Text>
                      <Text style={styles.tableCell}>{customer.percentage}%</Text>
                      <Text style={{ 
                        ...styles.tableCell, 
                        color: parseFloat(customer.percentage) > 20 ? '#F59E0B' : '#10B981' 
                      }}>
                        {parseFloat(customer.percentage) > 20 ? 'Viss koncentration' : 'OK'}
                      </Text>
                    </View>
                  ))}
              </View>
            </>
          )}

          {companyData.businessRelations.keySuppliers && (
            <>
              <Text style={styles.subsectionTitle}>Leverantörsrelationer</Text>
              <Text style={styles.text}>{companyData.businessRelations.keySuppliers}</Text>
            </>
          )}

          {companyData.businessRelations.exclusivityAgreements && (
            <View style={styles.highlightBox}>
              <Text style={styles.boldText}>Exklusivitetsavtal</Text>
              <Text style={styles.text}>{companyData.businessRelations.exclusivityAgreements}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 7</Text>
        </View>
      </Page>

      {/* Key Person Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organisation & Nyckelpersoner</Text>
          
          {companyData.generatedSummaries.keyPerson && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>AI-genererad sammanfattning</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.keyPerson}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.keyPersonAnalysis}</Text>

          <View style={
            companyData.keyPerson.ownerInvolvement === 'critical' || companyData.keyPerson.ownerInvolvement === 'high' 
              ? styles.warningBox 
              : styles.successBox
          }>
            <Text style={styles.boldText}>Ägarens involvering: {
              companyData.keyPerson.ownerInvolvement === 'critical' ? 'Kritisk' :
              companyData.keyPerson.ownerInvolvement === 'high' ? 'Hög' :
              companyData.keyPerson.ownerInvolvement === 'medium' ? 'Medel' :
              companyData.keyPerson.ownerInvolvement === 'low' ? 'Låg' : 'Ej bedömd'
            }</Text>
            <Text style={styles.text}>
              {companyData.keyPerson.ownerInvolvement === 'critical' ? 'Verksamheten stannar utan ägaren. Hög risk.' :
               companyData.keyPerson.ownerInvolvement === 'high' ? 'Involverad i de flesta beslut. Succession behövs.' :
               companyData.keyPerson.ownerInvolvement === 'medium' ? 'Delegerar men övervakar. God balans.' :
               companyData.keyPerson.ownerInvolvement === 'low' ? 'Verksamheten fungerar utan ägaren. Låg risk.' :
               'Ej bedömd'}
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>Beredskapschecklista</Text>
          <View style={{ marginTop: 10 }}>
            {[
              { label: 'Dokumenterade processer och rutiner', checked: companyData.keyPerson.documentedProcesses },
              { label: 'Backup-personer för kritiska roller', checked: companyData.keyPerson.backupPersons },
              { label: 'Ledningsgrupp på plats', checked: !!companyData.keyPerson.managementTeam },
              { label: 'Övergångsplan definierad', checked: !!companyData.keyPerson.transitionPlan },
            ].map((item, idx) => (
              <View key={idx} style={styles.checkItem}>
                <View style={{ 
                  ...styles.checkBox, 
                  ...(item.checked ? styles.checkBoxChecked : styles.checkBoxUnchecked) 
                }}>
                  {item.checked && <Text style={{ fontSize: 10, color: '#FFFFFF' }}>✓</Text>}
                </View>
                <Text style={styles.checkText}>{item.label}</Text>
              </View>
            ))}
          </View>

          {companyData.keyPerson.managementTeam && (
            <>
              <Text style={styles.subsectionTitle}>Ledningsgrupp</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.text}>{companyData.keyPerson.managementTeam}</Text>
              </View>
            </>
          )}

          {companyData.keyPerson.transitionPlan && (
            <>
              <Text style={styles.subsectionTitle}>Övergångsplan</Text>
              <View style={styles.successBox}>
                <Text style={styles.text}>{companyData.keyPerson.transitionPlan}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 8</Text>
        </View>
      </Page>

      {/* Balance Sheet */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balansräkning & Tillgångar</Text>
          
          {companyData.generatedSummaries.balanceSheet && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>AI-genererad sammanfattning</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.balanceSheet}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.balanceSheetAnalysis}</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Balanspost</Text>
              <Text style={styles.tableHeaderCell}>Status/Kommentar</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Lån till ägare/närstående</Text>
              <Text style={styles.tableCell}>{companyData.balanceSheet.loansToOwners || 'Inga angivna'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Icke-operativa tillgångar</Text>
              <Text style={styles.tableCell}>{companyData.balanceSheet.nonOperatingAssets || 'Inga angivna'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Lagerstatus</Text>
              <Text style={styles.tableCell}>{companyData.balanceSheet.inventoryStatus || 'Ej beskriven'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Kundfordringar</Text>
              <Text style={styles.tableCell}>{companyData.balanceSheet.receivablesStatus || 'Ej beskrivet'}</Text>
            </View>
          </View>

          {companyData.balanceSheet.liabilitiesToClean && (
            <View style={styles.warningBox}>
              <Text style={styles.boldText}>Poster att reglera före försäljning</Text>
              <Text style={styles.text}>{companyData.balanceSheet.liabilitiesToClean}</Text>
            </View>
          )}

          <Text style={styles.subsectionTitle}>Balansräkningskvalitet</Text>
          <View style={styles.successBox}>
            <Text style={styles.text}>
              Baserat på den angivna informationen bedöms balansräkningen vara i {
                companyData.balanceSheet.liabilitiesToClean ? 'acceptabelt' : 'gott'
              } skick med begränsade justeringsbehov inför en transaktion.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 9</Text>
        </View>
      </Page>

      {/* Legal Documentation */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Juridisk Dokumentation</Text>
          
          {companyData.generatedSummaries.legalDocs && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>AI-genererad sammanfattning</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.legalDocs}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.legalAnalysis}</Text>

          <Text style={styles.subsectionTitle}>Dokumentstatus</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Dokument</Text>
              <Text style={styles.tableHeaderCell}>Status</Text>
            </View>
            {[
              { label: 'Bolagsordning', checked: companyData.legalDocs.articlesOfAssociationUpdated },
              { label: 'Aktiebok', checked: companyData.legalDocs.shareRegisterComplete },
              { label: 'Styrelsebeslut', checked: companyData.legalDocs.boardMinutesArchived },
              { label: 'Ägaravtal', checked: companyData.legalDocs.ownerAgreementsReviewed },
              { label: 'Tillstånd & licenser', checked: companyData.legalDocs.permitsVerified },
            ].map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.label}</Text>
                <Text style={{ ...styles.tableCell, color: item.checked ? '#10B981' : '#EF4444' }}>
                  {item.checked ? '✓ Klart' : '✗ Behöver åtgärd'}
                </Text>
              </View>
            ))}
          </View>

          {companyData.legalDocs.pendingLegalIssues && (
            <View style={styles.warningBox}>
              <Text style={styles.boldText}>Juridiska noteringar</Text>
              <Text style={styles.text}>{companyData.legalDocs.pendingLegalIssues}</Text>
            </View>
          )}

          <View style={styles.successBox}>
            <Text style={styles.boldText}>Juridisk beredskap</Text>
            <Text style={styles.text}>
              {[
                companyData.legalDocs.articlesOfAssociationUpdated,
                companyData.legalDocs.shareRegisterComplete,
                companyData.legalDocs.boardMinutesArchived,
                companyData.legalDocs.ownerAgreementsReviewed,
                companyData.legalDocs.permitsVerified,
              ].filter(Boolean).length} av 5 dokument är i ordning.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 10</Text>
        </View>
      </Page>

      {/* Risk Assessment */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riskbedömning & Analys</Text>
          
          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>
              Övergripande riskprofil: {
                analysis.riskAssessment.overall === 'low' ? 'LÅG RISK' :
                analysis.riskAssessment.overall === 'medium' ? 'MEDEL RISK' : 'HÖG RISK'
              }
            </Text>
            <Text style={styles.executiveText}>
              Denna bedömning baseras på en genomgång av finansiella, operationella, 
              nyckelperson-, kund- och juridiska risker. {
                analysis.riskAssessment.overall === 'low' 
                  ? 'Företaget har en låg riskprofil vilket är attraktivt för potentiella köpare.'
                  : analysis.riskAssessment.overall === 'medium'
                    ? 'Vissa riskfaktorer bör adresseras för att maximera värdet.'
                    : 'Betydande riskfaktorer behöver åtgärdas innan en försäljningsprocess.'
              }
            </Text>
          </View>

          {/* Risk Radar Chart */}
          <RiskRadar risks={[
            { label: 'Finansiell risk', value: analysis.riskAssessment.financialRisk },
            { label: 'Operationell risk', value: analysis.riskAssessment.operationalRisk },
            { label: 'Nyckelpersonrisk', value: analysis.riskAssessment.keyPersonRisk },
            { label: 'Kundrisk', value: analysis.riskAssessment.customerRisk },
            { label: 'Juridisk risk', value: analysis.riskAssessment.legalRisk },
          ]} />

          <Text style={styles.subsectionTitle}>Riskanalys</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.boldText}>Lägst risk: Juridisk ({analysis.riskAssessment.legalRisk}%)</Text>
            <Text style={styles.text}>
              Den juridiska dokumentationen är väl förberedd vilket minskar risken för komplikationer vid due diligence.
            </Text>
          </View>

          {analysis.riskAssessment.keyPersonRisk > 40 && (
            <View style={styles.warningBox}>
              <Text style={styles.boldText}>Uppmärksamhet: Nyckelpersonrisk ({analysis.riskAssessment.keyPersonRisk}%)</Text>
              <Text style={styles.text}>
                Nyckelpersonberoendet bör adresseras genom dokumentation, delegation och successionsplanering.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 11</Text>
        </View>
      </Page>

      {/* SWOT Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Styrkor & Svagheter (SWOT)</Text>

          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <View style={{ ...styles.successBox, minHeight: 200 }}>
                <Text style={{ ...styles.boldText, marginBottom: 10 }}>✓ STYRKOR</Text>
                {analysis.strengths.map((strength, idx) => (
                  <Text key={idx} style={{ fontSize: 9, color: '#047857', marginBottom: 6 }}>
                    • {strength}
                  </Text>
                ))}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ ...styles.warningBox, minHeight: 200 }}>
                <Text style={{ ...styles.boldText, marginBottom: 10 }}>! FÖRBÄTTRINGSOMRÅDEN</Text>
                {analysis.weaknesses.map((weakness, idx) => (
                  <Text key={idx} style={{ fontSize: 9, color: '#92400E', marginBottom: 6 }}>
                    • {weakness}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>SWOT-sammanfattning</Text>
          <Text style={styles.text}>
            Med {analysis.strengths.length} identifierade styrkor och {analysis.weaknesses.length} förbättringsområden 
            har företaget en {analysis.strengths.length > analysis.weaknesses.length ? 'positiv' : 'balanserad'} SWOT-profil. 
            De prioriterade åtgärderna fokuserar på att minimera svagheterna samtidigt som styrkorna lyfts fram i försäljningsprocessen.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 12</Text>
        </View>
      </Page>

      {/* Valuation Factors - NEW PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Värdering & Marknadsjämförelse</Text>

          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Värderingsfaktorer</Text>
            <Text style={styles.executiveText}>{analysis.valuationFactors}</Text>
          </View>

          <Text style={styles.subsectionTitle}>Faktorer som påverkar värderingen</Text>
          
          <View style={{ flexDirection: 'row', marginBottom: 15 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <View style={styles.successBox}>
                <Text style={styles.boldText}>Värdehöjande</Text>
                <Text style={{ fontSize: 9, color: '#047857', marginTop: 5 }}>+ Stark tillväxt</Text>
                <Text style={{ fontSize: 9, color: '#047857', marginTop: 3 }}>+ God lönsamhet</Text>
                <Text style={{ fontSize: 9, color: '#047857', marginTop: 3 }}>+ Dokumenterade processer</Text>
                <Text style={{ fontSize: 9, color: '#047857', marginTop: 3 }}>+ Låg juridisk risk</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>Värdesänkande</Text>
                <Text style={{ fontSize: 9, color: '#92400E', marginTop: 5 }}>- Kundkoncentration</Text>
                <Text style={{ fontSize: 9, color: '#92400E', marginTop: 3 }}>- Nyckelpersonberoende</Text>
                <Text style={{ fontSize: 9, color: '#92400E', marginTop: 3 }}>- Geografisk begränsning</Text>
              </View>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Värderingsintervall</Text>
          <View style={styles.chartContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ width: 80, fontSize: 9, color: '#666666' }}>Konservativt</Text>
              <View style={{ flex: 1, height: 24, backgroundColor: '#E5E5E5', borderRadius: 4, flexDirection: 'row' }}>
                <View style={{ width: '60%', height: 24, backgroundColor: '#1F3C58', borderRadius: 4 }} />
              </View>
              <Text style={{ width: 60, fontSize: 10, fontWeight: 'bold', color: '#1F3C58', textAlign: 'right' }}>6x EBITDA</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ width: 80, fontSize: 9, color: '#666666' }}>Marknad</Text>
              <View style={{ flex: 1, height: 24, backgroundColor: '#E5E5E5', borderRadius: 4, flexDirection: 'row' }}>
                <View style={{ width: '70%', height: 24, backgroundColor: '#10B981', borderRadius: 4 }} />
              </View>
              <Text style={{ width: 60, fontSize: 10, fontWeight: 'bold', color: '#10B981', textAlign: 'right' }}>7x EBITDA</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ width: 80, fontSize: 9, color: '#666666' }}>Optimistiskt</Text>
              <View style={{ flex: 1, height: 24, backgroundColor: '#E5E5E5', borderRadius: 4, flexDirection: 'row' }}>
                <View style={{ width: '80%', height: 24, backgroundColor: '#3B6B8C', borderRadius: 4 }} />
              </View>
              <Text style={{ width: 60, fontSize: 10, fontWeight: 'bold', color: '#3B6B8C', textAlign: 'right' }}>8x EBITDA</Text>
            </View>
          </View>

          <View style={styles.highlightBox}>
            <Text style={styles.boldText}>Rekommendation</Text>
            <Text style={styles.text}>
              Baserat på analysen rekommenderas en förhandlingsstart i övre delen av intervallet (7-8x EBITDA) 
              med hänsyn till de starka tillväxtmöjligheterna och den väl förberedda organisationen.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 13</Text>
        </View>
      </Page>

      {/* Recommendations & Next Steps */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekommendationer & Nästa Steg</Text>

          <Text style={styles.subsectionTitle}>Prioriterade åtgärder</Text>
          {analysis.recommendations.map((rec, idx) => (
            <View key={idx} style={{ ...styles.highlightBox, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: 12, 
                  backgroundColor: '#1F3C58', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: 10 
                }}>
                  <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' }}>{idx + 1}</Text>
                </View>
                <Text style={{ ...styles.text, flex: 1, marginBottom: 0 }}>{rec}</Text>
              </View>
            </View>
          ))}

          <Text style={styles.subsectionTitle}>Tidplan för försäljningsprocessen</Text>
          <View style={{ marginTop: 10 }}>
            {analysis.nextSteps.map((step, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View style={{ 
                  ...styles.timelineDot, 
                  backgroundColor: idx === 0 ? '#10B981' : '#1F3C58' 
                }} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Steg {idx + 1}</Text>
                  <Text style={styles.timelineDesc}>{step}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ ...styles.executiveBox, marginTop: 20 }}>
          <Text style={styles.executiveTitle}>Behöver du hjälp?</Text>
          <Text style={styles.executiveText}>
            BOLAXO erbjuder professionell rådgivning genom hela försäljningsprocessen. 
            Kontakta oss för att diskutera hur vi kan hjälpa dig att maximera värdet vid försäljning av ditt företag.
          </Text>
          <Text style={{ ...styles.executiveText, marginTop: 15, fontWeight: 'bold' }}>
            kontakt@bolaxo.se | bolaxo.se | +46 8 123 456 78
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 14</Text>
        </View>
      </Page>
    </Document>
  )
}
