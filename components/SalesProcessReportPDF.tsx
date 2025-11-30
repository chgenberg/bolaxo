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
    padding: 35,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.4,
  },
  coverPage: {
    padding: 0,
    backgroundColor: '#1F3C58',
  },
  coverContent: {
    padding: 50,
    height: '100%',
    justifyContent: 'space-between',
  },
  coverTopSection: {
    marginTop: 40,
  },
  coverLogo: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 10,
  },
  coverSubBrand: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.6,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 30,
  },
  coverDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#10B981',
    marginBottom: 30,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 40,
  },
  coverCompanySection: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 25,
    borderRadius: 8,
    marginBottom: 30,
  },
  coverCompanyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  coverCompanyInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  coverInfoItem: {
    marginRight: 25,
  },
  coverInfoLabel: {
    fontSize: 9,
    color: '#FFFFFF',
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  coverInfoValue: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  coverBottomSection: {
    borderTop: '1 solid rgba(255,255,255,0.2)',
    paddingTop: 20,
  },
  coverDate: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  coverConfidential: {
    fontSize: 9,
    color: '#FFFFFF',
    opacity: 0.5,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  header: {
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '2 solid #1F3C58',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLogo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F3C58',
    letterSpacing: 1,
  },
  headerPageNum: {
    fontSize: 8,
    color: '#666666',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1 solid #E5E5E5',
  },
  subsectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 5,
    marginTop: 8,
  },
  highlightBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    borderLeft: '3 solid #1F3C58',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    borderLeft: '3 solid #F59E0B',
  },
  successBox: {
    backgroundColor: '#D1FAE5',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    borderLeft: '3 solid #10B981',
  },
  text: {
    fontSize: 8,
    color: '#333333',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  boldText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 2,
  },
  smallText: {
    fontSize: 7,
    color: '#666666',
    marginBottom: 3,
    lineHeight: 1.4,
  },
  table: {
    marginTop: 4,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E5E5E5',
    paddingVertical: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 5,
    borderBottom: '1 solid #1F3C58',
  },
  tableCell: {
    flex: 1,
    fontSize: 7,
    color: '#333333',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1F3C58',
  },
  checkItem: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  checkBox: {
    width: 10,
    height: 10,
    marginRight: 5,
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
    fontSize: 7,
    color: '#333333',
    flex: 1,
  },
  summaryBox: {
    backgroundColor: '#F0F4F8',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 35,
    right: 35,
    textAlign: 'center',
    borderTop: '1 solid #E5E5E5',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 6,
    color: '#999999',
  },
  executiveBox: {
    backgroundColor: '#1F3C58',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
  },
  executiveTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  executiveText: {
    fontSize: 8,
    color: '#FFFFFF',
    lineHeight: 1.5,
    opacity: 0.95,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  metricBox: {
    width: '24%',
    backgroundColor: '#F8FAFC',
    padding: 6,
    borderRadius: 3,
    marginBottom: 4,
    marginRight: '1%',
  },
  metricLabel: {
    fontSize: 6,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F3C58',
  },
  metricNote: {
    fontSize: 6,
    color: '#666666',
    marginTop: 1,
  },
  chartContainer: {
    marginVertical: 6,
    padding: 8,
    backgroundColor: '#FAFAFA',
    borderRadius: 3,
  },
  chartTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 6,
    textAlign: 'center',
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  barLabel: {
    width: 40,
    fontSize: 7,
    color: '#666666',
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginHorizontal: 5,
  },
  bar: {
    height: 12,
    borderRadius: 2,
  },
  barValue: {
    width: 40,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1F3C58',
    textAlign: 'right',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 12,
  },
  threeColumn: {
    flexDirection: 'row',
    gap: 8,
  },
  column: {
    flex: 1,
  },
  columnThird: {
    flex: 1,
  },
  tocItem: {
    flexDirection: 'row',
    borderBottom: '1 dotted #E5E5E5',
    paddingVertical: 5,
  },
  tocPage: {
    width: 25,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F3C58',
  },
  tocTitle: {
    flex: 1,
    fontSize: 9,
    color: '#333333',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1F3C58',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 8,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 7,
    color: '#666666',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 9,
    color: '#1F3C58',
    fontWeight: 'bold',
  },
  kpiCard: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
    borderLeft: '3 solid #1F3C58',
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F3C58',
  },
  kpiLabel: {
    fontSize: 7,
    color: '#666666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    fontWeight: 'bold',
  },
  statusGreen: {
    backgroundColor: '#D1FAE5',
    color: '#047857',
  },
  statusYellow: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  statusRed: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
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
  industrySpecific?: {
    typicalMultiples?: string
    keyValueDrivers?: string[]
    commonRisks?: string[]
    buyerTypes?: string
    dueDiligenceFocus?: string[]
  }
}

interface SalesProcessReportPDFProps {
  companyData: CompanyData
  analysis: AnalysisResult
  generatedAt: string
}

// Simple bar chart component
function BarChart({ data, title }: { data: { label: string; value: number }[]; title: string }) {
  const maxVal = Math.max(...data.map(d => d.value), 1)
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      {data.map((item, idx) => (
        <View key={idx} style={styles.barChartRow}>
          <Text style={styles.barLabel}>{item.label}</Text>
          <View style={styles.barContainer}>
            <View style={{ 
              ...styles.bar, 
              width: `${Math.max((item.value / maxVal) * 100, 5)}%`,
              backgroundColor: idx === 0 ? '#1F3C58' : idx === 1 ? '#3B6B8C' : '#6B9DC0'
            }} />
          </View>
          <Text style={styles.barValue}>{item.value} MSEK</Text>
        </View>
      ))}
    </View>
  )
}

// Risk bar component
function RiskBar({ label, value }: { label: string; value: number }) {
  const getRiskColor = (v: number) => v <= 30 ? '#10B981' : v <= 60 ? '#F59E0B' : '#EF4444'
  const getRiskLabel = (v: number) => v <= 30 ? 'Låg' : v <= 60 ? 'Medel' : 'Hög'
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
      <Text style={{ width: 70, fontSize: 7, color: '#666666' }}>{label}</Text>
      <View style={{ flex: 1, height: 8, backgroundColor: '#E5E5E5', borderRadius: 4, marginHorizontal: 5 }}>
        <View style={{ height: 8, width: `${value}%`, backgroundColor: getRiskColor(value), borderRadius: 4 }} />
      </View>
      <Text style={{ width: 30, fontSize: 7, fontWeight: 'bold', color: getRiskColor(value), textAlign: 'right' }}>
        {getRiskLabel(value)}
      </Text>
    </View>
  )
}

// Status indicator
function StatusIndicator({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
      <View style={{ 
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        backgroundColor: ok ? '#10B981' : '#EF4444',
        marginRight: 5 
      }} />
      <Text style={{ fontSize: 7, color: '#333333' }}>{label}</Text>
    </View>
  )
}

export default function SalesProcessReportPDF({ 
  companyData, 
  analysis, 
  generatedAt 
}: SalesProcessReportPDFProps) {
  const companyName = companyData.companyName || companyData.scrapedData?.title || 'Företaget'
  
  const revenueData = companyData.financialDocs.revenueByYear ? [
    { label: `${new Date().getFullYear()}`, value: parseFloat(companyData.financialDocs.revenueByYear.year1) || 0 },
    { label: `${new Date().getFullYear() - 1}`, value: parseFloat(companyData.financialDocs.revenueByYear.year2) || 0 },
    { label: `${new Date().getFullYear() - 2}`, value: parseFloat(companyData.financialDocs.revenueByYear.year3) || 0 },
  ].reverse() : []
  
  const profitData = companyData.financialDocs.profitByYear ? [
    { label: `${new Date().getFullYear()}`, value: parseFloat(companyData.financialDocs.profitByYear.year1) || 0 },
    { label: `${new Date().getFullYear() - 1}`, value: parseFloat(companyData.financialDocs.profitByYear.year2) || 0 },
    { label: `${new Date().getFullYear() - 2}`, value: parseFloat(companyData.financialDocs.profitByYear.year3) || 0 },
  ].reverse() : []

  // Calculate some derived metrics
  const totalCustomerConcentration = companyData.businessRelations.topCustomers
    .filter(c => c.percentage)
    .reduce((sum, c) => sum + parseInt(c.percentage || '0'), 0)

  const currentRevenue = revenueData.length > 0 ? revenueData[revenueData.length - 1].value : 0
  const previousRevenue = revenueData.length > 1 ? revenueData[revenueData.length - 2].value : 0
  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : '0'

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <View style={styles.coverTopSection}>
            <Text style={styles.coverLogo}>BOLAXO</Text>
            <Text style={styles.coverSubBrand}>Företagsanalys & Värdering</Text>
            <View style={styles.coverDivider} />
            <Text style={styles.coverTitle}>Försäljningsförberedande</Text>
            <Text style={styles.coverTitle}>Analys & Rapport</Text>
            <Text style={styles.coverSubtitle}>En komplett genomlysning inför företagsförsäljning</Text>
          </View>

          <View style={styles.coverCompanySection}>
            <Text style={styles.coverCompanyName}>{companyName}</Text>
            <View style={styles.coverCompanyInfo}>
              {companyData.orgNumber && (
                <View style={styles.coverInfoItem}>
                  <Text style={styles.coverInfoLabel}>Organisationsnummer</Text>
                  <Text style={styles.coverInfoValue}>{companyData.orgNumber}</Text>
                </View>
              )}
              {companyData.industry && (
                <View style={styles.coverInfoItem}>
                  <Text style={styles.coverInfoLabel}>Bransch</Text>
                  <Text style={styles.coverInfoValue}>{companyData.industry.label}</Text>
                </View>
              )}
              {currentRevenue > 0 && (
                <View style={styles.coverInfoItem}>
                  <Text style={styles.coverInfoLabel}>Omsättning</Text>
                  <Text style={styles.coverInfoValue}>{currentRevenue} MSEK</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.coverBottomSection}>
            <Text style={styles.coverDate}>Rapport genererad: {generatedAt}</Text>
            <Text style={styles.coverConfidential}>⚠ Konfidentiellt dokument</Text>
          </View>
        </View>
      </Page>

      {/* Page 2: Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 2</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verkställande Sammanfattning</Text>
          
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>
                {analysis.riskAssessment.overall === 'low' ? 'A' : analysis.riskAssessment.overall === 'medium' ? 'B' : 'C'}
              </Text>
              <Text style={styles.scoreLabel}>Betyg</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.executiveBox}>
                <Text style={styles.executiveTitle}>Övergripande Bedömning</Text>
                <Text style={styles.executiveText}>{analysis.executiveSummary}</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Riskprofil</Text>
              <Text style={{ ...styles.metricValue, color: analysis.riskAssessment.overall === 'low' ? '#10B981' : analysis.riskAssessment.overall === 'medium' ? '#F59E0B' : '#EF4444' }}>
                {analysis.riskAssessment.overall === 'low' ? 'Låg' : analysis.riskAssessment.overall === 'medium' ? 'Medel' : 'Hög'}
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Styrkor</Text>
              <Text style={styles.metricValue}>{analysis.strengths.length} st</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Tillväxt</Text>
              <Text style={{ ...styles.metricValue, color: parseFloat(revenueGrowth) > 0 ? '#10B981' : '#EF4444' }}>
                {revenueGrowth}%
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Åtgärder</Text>
              <Text style={styles.metricValue}>{analysis.recommendations.length} st</Text>
            </View>
          </View>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Nyckelstyrkor</Text>
              <View style={styles.successBox}>
                {analysis.strengths.slice(0, 4).map((s, idx) => (
                  <Text key={idx} style={{ fontSize: 7, color: '#047857', marginBottom: 2 }}>✓ {s}</Text>
                ))}
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Förbättringsområden</Text>
              <View style={styles.warningBox}>
                {analysis.weaknesses.slice(0, 4).map((w, idx) => (
                  <Text key={idx} style={{ fontSize: 7, color: '#92400E', marginBottom: 2 }}>! {w}</Text>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Riskprofil per kategori</Text>
          <View style={{ marginBottom: 8 }}>
            <RiskBar label="Finansiell" value={analysis.riskAssessment.financialRisk} />
            <RiskBar label="Operationell" value={analysis.riskAssessment.operationalRisk} />
            <RiskBar label="Nyckelperson" value={analysis.riskAssessment.keyPersonRisk} />
            <RiskBar label="Kundrisk" value={analysis.riskAssessment.customerRisk} />
            <RiskBar label="Juridisk" value={analysis.riskAssessment.legalRisk} />
          </View>

          <View style={styles.highlightBox}>
            <Text style={styles.boldText}>Värderingsintervall & Multiplar</Text>
            <Text style={styles.smallText}>{analysis.valuationFactors}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 3: Company Overview & Financial Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 3</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Företagsöversikt</Text>
          
          {companyData.scrapedData && (
            <View style={styles.highlightBox}>
              {companyData.scrapedData.title && <Text style={styles.boldText}>{companyData.scrapedData.title}</Text>}
              {companyData.scrapedData.description && <Text style={styles.smallText}>{companyData.scrapedData.description}</Text>}
              {companyData.scrapedData.highlights && companyData.scrapedData.highlights.length > 0 && (
                <View style={{ marginTop: 6, flexDirection: 'row', flexWrap: 'wrap' }}>
                  {companyData.scrapedData.highlights.slice(0, 6).map((h, idx) => (
                    <Text key={idx} style={{ fontSize: 6, color: '#1F3C58', marginRight: 8, marginBottom: 2 }}>• {h}</Text>
                  ))}
                </View>
              )}
            </View>
          )}

          <Text style={styles.text}>{analysis.companyOverview}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finansiell Utveckling</Text>
          
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {revenueData.some(d => d.value > 0) && <BarChart data={revenueData} title="Omsättning (MSEK)" />}
              
              {companyData.generatedSummaries.financialDocs && (
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryTitle}>Finansiell sammanfattning</Text>
                  <Text style={{ fontSize: 7, color: '#333333', lineHeight: 1.4 }}>
                    {companyData.generatedSummaries.financialDocs.substring(0, 400)}...
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.column}>
              {profitData.some(d => d.value > 0) && <BarChart data={profitData} title="Resultat (MSEK)" />}
              
              <Text style={styles.subsectionTitle}>Dokumentation</Text>
              <View style={{ marginBottom: 6 }}>
                <StatusIndicator ok={companyData.financialDocs.hasAuditedReports} label="Reviderade årsredovisningar" />
                <StatusIndicator ok={companyData.financialDocs.hasMonthlyReports} label="Månadsrapporter" />
                <StatusIndicator ok={companyData.financialDocs.budgetAvailable} label="Budget & prognoser" />
              </View>

              {companyData.financialDocs.ebitdaNotes && (
                <View style={styles.highlightBox}>
                  <Text style={styles.boldText}>EBITDA-noteringar</Text>
                  <Text style={{ fontSize: 6, color: '#333333' }}>{companyData.financialDocs.ebitdaNotes.substring(0, 200)}...</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.text}>{analysis.financialAnalysis}</Text>

          {companyData.financialDocs.oneTimeItems && (
            <View style={styles.warningBox}>
              <Text style={styles.boldText}>Engångsposter att beakta</Text>
              <Text style={styles.smallText}>{companyData.financialDocs.oneTimeItems}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 4: Business Relations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 4</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affärsrelationer & Kundanalys</Text>
          
          {companyData.generatedSummaries.businessRelations && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.businessRelations}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.businessRelationsAnalysis}</Text>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {companyData.businessRelations.topCustomers.some(c => c.name) && (
                <>
                  <Text style={styles.subsectionTitle}>Topp 5 Kunder - Koncentration</Text>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={{ ...styles.tableHeaderCell, width: '45%' }}>Kund</Text>
                      <Text style={{ ...styles.tableHeaderCell, width: '25%' }}>Andel</Text>
                      <Text style={{ ...styles.tableHeaderCell, width: '30%' }}>Risk</Text>
                    </View>
                    {companyData.businessRelations.topCustomers.filter(c => c.name).map((c, idx) => (
                      <View key={idx} style={styles.tableRow}>
                        <Text style={{ ...styles.tableCell, width: '45%' }}>{c.name}</Text>
                        <Text style={{ ...styles.tableCell, width: '25%' }}>{c.percentage}%</Text>
                        <Text style={{ ...styles.tableCell, width: '30%', color: parseInt(c.percentage) > 20 ? '#EF4444' : parseInt(c.percentage) > 10 ? '#F59E0B' : '#10B981' }}>
                          {parseInt(c.percentage) > 20 ? 'Hög' : parseInt(c.percentage) > 10 ? 'Medel' : 'Låg'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <View style={{ ...styles.kpiCard, marginTop: 8 }}>
                <Text style={styles.kpiValue}>{totalCustomerConcentration}%</Text>
                <Text style={styles.kpiLabel}>Total koncentration (Topp 5)</Text>
              </View>
            </View>

            <View style={styles.column}>
              {companyData.businessRelations.keySuppliers && (
                <>
                  <Text style={styles.subsectionTitle}>Nyckelleverantörer</Text>
                  <View style={styles.highlightBox}>
                    <Text style={styles.smallText}>{companyData.businessRelations.keySuppliers}</Text>
                  </View>
                </>
              )}

              {companyData.businessRelations.exclusivityAgreements && (
                <>
                  <Text style={styles.subsectionTitle}>Exklusivitetsavtal</Text>
                  <View style={styles.warningBox}>
                    <Text style={styles.smallText}>{companyData.businessRelations.exclusivityAgreements}</Text>
                  </View>
                </>
              )}

              {companyData.businessRelations.informalAgreements && (
                <>
                  <Text style={styles.subsectionTitle}>Informella överenskommelser</Text>
                  <View style={{ ...styles.warningBox, backgroundColor: '#FEE2E2', borderLeft: '3 solid #EF4444' }}>
                    <Text style={styles.boldText}>! Kräver formalisering</Text>
                    <Text style={styles.smallText}>{companyData.businessRelations.informalAgreements}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <View style={styles.successBox}>
            <Text style={styles.boldText}>Rekommendationer för affärsrelationer</Text>
            <Text style={styles.smallText}>• Säkerställ skriftliga avtal med alla nyckelleverantörer</Text>
            <Text style={styles.smallText}>• Dokumentera alla informella överenskommelser</Text>
            <Text style={styles.smallText}>• Granska förnyelsedatum för viktiga avtal</Text>
            <Text style={styles.smallText}>• Identifiera change-of-control-klausuler i alla väsentliga avtal</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 5: Organization & Key Persons */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 5</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organisation & Nyckelpersoner</Text>
          
          {companyData.generatedSummaries.keyPerson && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.keyPerson}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.keyPersonAnalysis}</Text>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {companyData.keyPerson.managementTeam && (
                <>
                  <Text style={styles.subsectionTitle}>Ledningsgrupp</Text>
                  <View style={styles.highlightBox}>
                    <Text style={styles.smallText}>{companyData.keyPerson.managementTeam}</Text>
                  </View>
                </>
              )}

              <View style={companyData.keyPerson.ownerInvolvement === 'critical' || companyData.keyPerson.ownerInvolvement === 'high' ? styles.warningBox : styles.successBox}>
                <Text style={styles.boldText}>Ägarinvolvering: {
                  companyData.keyPerson.ownerInvolvement === 'critical' ? 'Kritisk - Hög risk' :
                  companyData.keyPerson.ownerInvolvement === 'high' ? 'Hög - Kräver succession' :
                  companyData.keyPerson.ownerInvolvement === 'medium' ? 'Medel - Hanterbar' :
                  companyData.keyPerson.ownerInvolvement === 'low' ? 'Låg - Positivt' : 'Ej bedömd'
                }</Text>
                <Text style={styles.smallText}>
                  {companyData.keyPerson.ownerInvolvement === 'critical' || companyData.keyPerson.ownerInvolvement === 'high'
                    ? 'Betydande nyckelpersonberoende som behöver adresseras före transaktion.'
                    : 'Organisationen har god självständighet från ägare/grundare.'}
                </Text>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Organisatorisk Beredskap</Text>
              <View style={styles.table}>
                {[
                  { label: 'Dokumenterade processer', ok: companyData.keyPerson.documentedProcesses },
                  { label: 'Backup-personer finns', ok: companyData.keyPerson.backupPersons },
                  { label: 'Ledningsgrupp etablerad', ok: !!companyData.keyPerson.managementTeam },
                  { label: 'Övergångsplan finns', ok: !!companyData.keyPerson.transitionPlan },
                ].map((item, idx) => (
                  <View key={idx} style={{ ...styles.tableRow, paddingVertical: 5 }}>
                    <Text style={{ ...styles.tableCell, flex: 3 }}>{item.label}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <View style={{ ...styles.statusBadge, ...(item.ok ? styles.statusGreen : styles.statusRed) }}>
                        <Text style={{ fontSize: 6 }}>{item.ok ? '✓ Ja' : '✗ Nej'}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {companyData.keyPerson.transitionPlan && (
                <>
                  <Text style={styles.subsectionTitle}>Successionsplan</Text>
                  <View style={styles.highlightBox}>
                    <Text style={styles.smallText}>{companyData.keyPerson.transitionPlan}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 6: Balance Sheet & Legal */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 6</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balansräkning & Juridisk Status</Text>
          
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Tillgångsanalys</Text>
              {companyData.generatedSummaries.balanceSheet && (
                <View style={styles.summaryBox}>
                  <Text style={{ fontSize: 7, color: '#333333', lineHeight: 1.4 }}>
                    {companyData.generatedSummaries.balanceSheet.substring(0, 300)}...
                  </Text>
                </View>
              )}

              <View style={styles.table}>
                {[
                  { label: 'Kundfordringar', value: companyData.balanceSheet.receivablesStatus || 'Ej specificerat' },
                  { label: 'Lager', value: companyData.balanceSheet.inventoryStatus || 'Ej specificerat' },
                  { label: 'Icke-operativa tillgångar', value: companyData.balanceSheet.nonOperatingAssets || 'Inga identifierade' },
                ].map((item, idx) => (
                  <View key={idx} style={{ ...styles.tableRow, flexDirection: 'column' }}>
                    <Text style={{ ...styles.tableCell, fontWeight: 'bold', marginBottom: 1 }}>{item.label}</Text>
                    <Text style={{ fontSize: 6, color: '#666666' }}>{item.value.substring(0, 100)}...</Text>
                  </View>
                ))}
              </View>

              {companyData.balanceSheet.loansToOwners && (
                <View style={styles.warningBox}>
                  <Text style={styles.boldText}>Lån till/från ägare</Text>
                  <Text style={styles.smallText}>{companyData.balanceSheet.loansToOwners}</Text>
                </View>
              )}

              {companyData.balanceSheet.liabilitiesToClean && (
                <View style={{ ...styles.warningBox, backgroundColor: '#FEE2E2', borderLeft: '3 solid #EF4444' }}>
                  <Text style={styles.boldText}>! Skulder att reglera</Text>
                  <Text style={styles.smallText}>{companyData.balanceSheet.liabilitiesToClean}</Text>
                </View>
              )}
            </View>

            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Juridisk Dokumentation</Text>
              {companyData.generatedSummaries.legalDocs && (
                <View style={styles.summaryBox}>
                  <Text style={{ fontSize: 7, color: '#333333', lineHeight: 1.4 }}>
                    {companyData.generatedSummaries.legalDocs.substring(0, 300)}...
                  </Text>
                </View>
              )}

              <View style={styles.table}>
                {[
                  { label: 'Bolagsordning (uppdaterad)', ok: companyData.legalDocs.articlesOfAssociationUpdated },
                  { label: 'Aktiebok (komplett)', ok: companyData.legalDocs.shareRegisterComplete },
                  { label: 'Styrelseprotokoll (arkiverade)', ok: companyData.legalDocs.boardMinutesArchived },
                  { label: 'Ägaravtal (granskade)', ok: companyData.legalDocs.ownerAgreementsReviewed },
                  { label: 'Tillstånd (verifierade)', ok: companyData.legalDocs.permitsVerified },
                ].map((item, idx) => (
                  <View key={idx} style={{ ...styles.tableRow, paddingVertical: 4 }}>
                    <Text style={{ ...styles.tableCell, flex: 3 }}>{item.label}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <View style={{ ...styles.statusBadge, ...(item.ok ? styles.statusGreen : styles.statusRed) }}>
                        <Text style={{ fontSize: 6 }}>{item.ok ? '✓' : '✗'}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {companyData.legalDocs.pendingLegalIssues && (
                <View style={styles.highlightBox}>
                  <Text style={styles.boldText}>Juridiska noteringar</Text>
                  <Text style={styles.smallText}>{companyData.legalDocs.pendingLegalIssues}</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.text}>{analysis.balanceSheetAnalysis}</Text>
          <Text style={styles.text}>{analysis.legalAnalysis}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 7: Risk Assessment & SWOT */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 7</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riskbedömning & SWOT-analys</Text>
          
          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>
              Övergripande riskprofil: {analysis.riskAssessment.overall === 'low' ? 'LÅG' : analysis.riskAssessment.overall === 'medium' ? 'MEDEL' : 'HÖG'} RISK
            </Text>
            <Text style={styles.executiveText}>
              {analysis.riskAssessment.overall === 'low' 
                ? 'Företaget har en attraktiv riskprofil för potentiella köpare. Inga väsentliga risker har identifierats som skulle kunna påverka en transaktion negativt.'
                : analysis.riskAssessment.overall === 'medium'
                  ? 'Vissa riskfaktorer har identifierats som bör adresseras för att maximera värdet vid en transaktion. Med rätt åtgärder kan dessa hanteras.'
                  : 'Betydande riskfaktorer har identifierats som behöver åtgärdas innan bolaget är redo för en transaktion.'}
            </Text>
          </View>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Detaljerad Riskbedömning</Text>
              <View style={{ marginBottom: 8 }}>
                <RiskBar label="Finansiell" value={analysis.riskAssessment.financialRisk} />
                <Text style={{ fontSize: 6, color: '#666666', marginBottom: 4, marginLeft: 75 }}>
                  {analysis.riskAssessment.financialRisk <= 30 
                    ? 'Stabil finansiell ställning'
                    : analysis.riskAssessment.financialRisk <= 60
                      ? 'Vissa finansiella osäkerheter'
                      : 'Betydande finansiella risker'}
                </Text>
                
                <RiskBar label="Operationell" value={analysis.riskAssessment.operationalRisk} />
                <Text style={{ fontSize: 6, color: '#666666', marginBottom: 4, marginLeft: 75 }}>
                  {analysis.riskAssessment.operationalRisk <= 30 
                    ? 'Väl dokumenterade processer'
                    : analysis.riskAssessment.operationalRisk <= 60
                      ? 'Processer kan förbättras'
                      : 'Bristande processer'}
                </Text>
                
                <RiskBar label="Nyckelperson" value={analysis.riskAssessment.keyPersonRisk} />
                <Text style={{ fontSize: 6, color: '#666666', marginBottom: 4, marginLeft: 75 }}>
                  {analysis.riskAssessment.keyPersonRisk <= 30 
                    ? 'God successionsplan'
                    : analysis.riskAssessment.keyPersonRisk <= 60
                      ? 'Visst beroende finns'
                      : 'Kritiskt beroende'}
                </Text>
                
                <RiskBar label="Kundrisk" value={analysis.riskAssessment.customerRisk} />
                <Text style={{ fontSize: 6, color: '#666666', marginBottom: 4, marginLeft: 75 }}>
                  {analysis.riskAssessment.customerRisk <= 30 
                    ? 'Diversifierad kundbas'
                    : analysis.riskAssessment.customerRisk <= 60
                      ? 'Viss koncentration'
                      : 'Hög koncentration'}
                </Text>
                
                <RiskBar label="Juridisk" value={analysis.riskAssessment.legalRisk} />
                <Text style={{ fontSize: 6, color: '#666666', marginBottom: 4, marginLeft: 75 }}>
                  {analysis.riskAssessment.legalRisk <= 30 
                    ? 'Dokumentation i ordning'
                    : analysis.riskAssessment.legalRisk <= 60
                      ? 'Kräver viss utredning'
                      : 'Betydande risker'}
                </Text>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>SWOT-analys</Text>
              <View style={{ ...styles.successBox, marginBottom: 6, padding: 6 }}>
                <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#047857', marginBottom: 3 }}>STYRKOR</Text>
                {analysis.strengths.slice(0, 3).map((s, idx) => (
                  <Text key={idx} style={{ fontSize: 6, color: '#047857', marginBottom: 1 }}>✓ {s.substring(0, 60)}...</Text>
                ))}
              </View>
              
              <View style={{ ...styles.warningBox, marginBottom: 6, padding: 6 }}>
                <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#92400E', marginBottom: 3 }}>SVAGHETER</Text>
                {analysis.weaknesses.slice(0, 3).map((w, idx) => (
                  <Text key={idx} style={{ fontSize: 6, color: '#92400E', marginBottom: 1 }}>! {w.substring(0, 60)}...</Text>
                ))}
              </View>
              
              <View style={{ ...styles.highlightBox, backgroundColor: '#DBEAFE', borderLeft: '3 solid #3B82F6', marginBottom: 6, padding: 6 }}>
                <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#1D4ED8', marginBottom: 3 }}>MÖJLIGHETER</Text>
                <Text style={{ fontSize: 6, color: '#1D4ED8', marginBottom: 1 }}>→ Tillväxt genom nya marknader</Text>
                <Text style={{ fontSize: 6, color: '#1D4ED8', marginBottom: 1 }}>→ Synergier med köpare</Text>
                <Text style={{ fontSize: 6, color: '#1D4ED8', marginBottom: 1 }}>→ Digitalisering & effektivisering</Text>
              </View>
              
              <View style={{ ...styles.highlightBox, backgroundColor: '#FEE2E2', borderLeft: '3 solid #EF4444', padding: 6 }}>
                <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#B91C1C', marginBottom: 3 }}>HOT</Text>
                <Text style={{ fontSize: 6, color: '#B91C1C', marginBottom: 1 }}>⚠ Marknadsförändringar</Text>
                <Text style={{ fontSize: 6, color: '#B91C1C', marginBottom: 1 }}>⚠ Ökad konkurrens</Text>
                <Text style={{ fontSize: 6, color: '#B91C1C', marginBottom: 1 }}>⚠ Regulatoriska förändringar</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 8: Industry Analysis & Valuation */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 8</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Branschanalys & Värderingsfaktorer</Text>

          {companyData.industry && (
            <View style={{ backgroundColor: '#1F3C58', padding: 8, borderRadius: 4, marginBottom: 10 }}>
              <Text style={{ fontSize: 10, color: '#FFFFFF', fontWeight: 'bold' }}>Bransch: {companyData.industry.label}</Text>
            </View>
          )}

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {analysis.industrySpecific?.typicalMultiples && (
                <>
                  <Text style={styles.subsectionTitle}>Typiska Värderingsmultiplar</Text>
                  <View style={styles.highlightBox}>
                    <Text style={styles.smallText}>{analysis.industrySpecific.typicalMultiples}</Text>
                  </View>
                </>
              )}

              {analysis.industrySpecific?.keyValueDrivers && (
                <>
                  <Text style={styles.subsectionTitle}>Värdedrivare i branschen</Text>
                  <View style={styles.successBox}>
                    {analysis.industrySpecific.keyValueDrivers.map((driver, idx) => (
                      <Text key={idx} style={{ fontSize: 7, color: '#047857', marginBottom: 2 }}>✓ {driver}</Text>
                    ))}
                  </View>
                </>
              )}

              {analysis.industrySpecific?.buyerTypes && (
                <>
                  <Text style={styles.subsectionTitle}>Typiska Köpare</Text>
                  <View style={styles.highlightBox}>
                    <Text style={styles.smallText}>{analysis.industrySpecific.buyerTypes}</Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.column}>
              {analysis.industrySpecific?.commonRisks && (
                <>
                  <Text style={styles.subsectionTitle}>Branschspecifika Risker</Text>
                  <View style={styles.warningBox}>
                    {analysis.industrySpecific.commonRisks.map((risk, idx) => (
                      <Text key={idx} style={{ fontSize: 7, color: '#92400E', marginBottom: 2 }}>! {risk}</Text>
                    ))}
                  </View>
                </>
              )}

              {analysis.industrySpecific?.dueDiligenceFocus && (
                <>
                  <Text style={styles.subsectionTitle}>DD-fokusområden</Text>
                  <View style={styles.highlightBox}>
                    {analysis.industrySpecific.dueDiligenceFocus.map((focus, idx) => (
                      <Text key={idx} style={{ fontSize: 7, color: '#1F3C58', marginBottom: 2 }}>• {focus}</Text>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.subsectionTitle}>Vanliga Värderingsmetoder</Text>
              <View style={styles.table}>
                {[
                  { method: 'EV/EBITDA', desc: 'Vanligast för lönsamma SME-bolag' },
                  { method: 'EV/Omsättning', desc: 'För tillväxtbolag' },
                  { method: 'DCF', desc: 'Diskonterat kassaflöde' },
                  { method: 'Substansvärde', desc: 'Baserat på tillgångar' },
                ].map((item, idx) => (
                  <View key={idx} style={{ ...styles.tableRow, paddingVertical: 3 }}>
                    <Text style={{ ...styles.tableCell, width: '30%', fontWeight: 'bold' }}>{item.method}</Text>
                    <Text style={{ ...styles.tableCell, width: '70%', fontSize: 6 }}>{item.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Värderingsintervall</Text>
            <Text style={styles.executiveText}>{analysis.valuationFactors}</Text>
          </View>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.successBox}>
                <Text style={styles.boldText}>Faktorer som höjer värdet</Text>
                <Text style={styles.smallText}>• Stabil och förutsägbar intjäning</Text>
                <Text style={styles.smallText}>• Diversifierad kundbas</Text>
                <Text style={styles.smallText}>• Stark ledningsgrupp</Text>
                <Text style={styles.smallText}>• Återkommande intäkter</Text>
                <Text style={styles.smallText}>• Tillväxtpotential</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>Faktorer som sänker värdet</Text>
                <Text style={styles.smallText}>• Hög kundkoncentration</Text>
                <Text style={styles.smallText}>• Nyckelpersonberoende</Text>
                <Text style={styles.smallText}>• Bristande dokumentation</Text>
                <Text style={styles.smallText}>• Juridiska oklarheter</Text>
                <Text style={styles.smallText}>• Volatil intjäning</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 9: Recommendations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 9</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prioriterade Rekommendationer</Text>

          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Sammanfattning</Text>
            <Text style={styles.executiveText}>
              Nedan listas de viktigaste åtgärderna för att maximera bolagets värde och transaktionsberedskap. 
              Prioritera dessa innan ni inleder en försäljningsprocess.
            </Text>
          </View>

          {analysis.recommendations.map((rec, idx) => (
            <View key={idx} style={{ ...styles.highlightBox, marginBottom: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: 10, 
                  backgroundColor: '#1F3C58', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginRight: 8 
                }}>
                  <Text style={{ fontSize: 9, color: '#FFF', fontWeight: 'bold' }}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 8, color: '#333333', lineHeight: 1.4 }}>{rec}</Text>
                </View>
              </View>
            </View>
          ))}

          <Text style={styles.subsectionTitle}>Due Diligence Checklista</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.highlightBox}>
                <Text style={styles.boldText}>Finansiell DD</Text>
                {['Årsredovisningar (3-5 år)', 'Månadsrapporter', 'Budget & prognoser', 'Kundreskontra', 'Leverantörsreskontra'].map((item, idx) => (
                  <Text key={idx} style={{ fontSize: 6, color: '#333333', marginBottom: 1 }}>☐ {item}</Text>
                ))}
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.highlightBox}>
                <Text style={styles.boldText}>Juridisk DD</Text>
                {['Bolagsordning', 'Aktiebok', 'Väsentliga avtal', 'Anställningsavtal', 'Tillstånd & certifikat'].map((item, idx) => (
                  <Text key={idx} style={{ fontSize: 6, color: '#333333', marginBottom: 1 }}>☐ {item}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 10: Action Plan & Timeline */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 10</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Handlingsplan & Tidslinje</Text>

          <Text style={styles.subsectionTitle}>Steg-för-steg tidplan för försäljningsprocessen</Text>
          
          {analysis.nextSteps.map((step, idx) => (
            <View key={idx} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
              <View style={{ width: 25, alignItems: 'center', marginRight: 8 }}>
                <View style={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: 10, 
                  backgroundColor: idx === 0 ? '#10B981' : '#1F3C58', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Text style={{ fontSize: 8, color: '#FFF', fontWeight: 'bold' }}>{idx + 1}</Text>
                </View>
                {idx < analysis.nextSteps.length - 1 && (
                  <View style={{ width: 2, height: 15, backgroundColor: '#E5E5E5', marginTop: 3 }} />
                )}
              </View>
              <View style={{ flex: 1, paddingTop: 1 }}>
                <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#1F3C58', marginBottom: 1 }}>Steg {idx + 1}</Text>
                <Text style={{ fontSize: 7, color: '#666666', lineHeight: 1.4 }}>{step}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nästa Steg & Kontakt</Text>

          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Behöver du professionell hjälp?</Text>
            <Text style={styles.executiveText}>
              BOLAXO erbjuder komplett stöd genom hela försäljningsprocessen - från förberedelse och 
              värdering till marknadsföring, köparidentifiering och closing.
            </Text>
            <View style={{ marginTop: 12, borderTop: '1 solid rgba(255,255,255,0.3)', paddingTop: 10 }}>
              <Text style={{ fontSize: 8, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 6 }}>Kontakta oss</Text>
              <Text style={{ fontSize: 8, color: '#FFFFFF', opacity: 0.9 }}>✉ kontakt@bolaxo.se</Text>
              <Text style={{ fontSize: 8, color: '#FFFFFF', opacity: 0.9 }}>🌐 www.bolaxo.se</Text>
              <Text style={{ fontSize: 8, color: '#FFFFFF', opacity: 0.9 }}>📞 +46 8 123 456 78</Text>
            </View>
          </View>

          <View style={styles.highlightBox}>
            <Text style={styles.boldText}>Omedelbara nästa steg</Text>
            <Text style={styles.smallText}>1. Granska rapporten och prioritera identifierade åtgärder</Text>
            <Text style={styles.smallText}>2. Samla in kompletterande dokumentation för datarum</Text>
            <Text style={styles.smallText}>3. Boka uppföljningsmöte med BOLAXO för fördjupad rådgivning</Text>
            <Text style={styles.smallText}>4. Diskutera tidplan och processupplägg</Text>
          </View>

          <View style={{ ...styles.highlightBox, backgroundColor: '#F3F4F6', borderLeft: '3 solid #6B7280', marginTop: 10 }}>
            <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#374151', marginBottom: 4 }}>Ansvarsfriskrivning</Text>
            <Text style={{ fontSize: 6, color: '#374151', lineHeight: 1.4 }}>
              Informationen i denna rapport är baserad på uppgifter som tillhandahållits av företagsägaren. 
              BOLAXO AB garanterar inte uppgifternas riktighet. Värderingsintervall utgör inte finansiell 
              rådgivning och ska inte ligga till grund för investeringsbeslut utan kompletterande due diligence. 
              Vi rekommenderar att anlita kvalificerad juridisk, finansiell och skattemässig rådgivning 
              inför en företagstransaktion.
            </Text>
          </View>

          <View style={{ marginTop: 15, textAlign: 'center' }}>
            <Text style={{ fontSize: 10, color: '#1F3C58', fontWeight: 'bold' }}>BOLAXO AB</Text>
            <Text style={{ fontSize: 7, color: '#666666', marginTop: 3 }}>Norrmälarstrand 10, 114 62 Stockholm</Text>
            <Text style={{ fontSize: 6, color: '#666666', marginTop: 2 }}>Rapport genererad: {generatedAt}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>
    </Document>
  )
}

