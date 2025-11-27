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
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  coverPage: {
    padding: 50,
    backgroundColor: '#1F3C58',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverLogo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 15,
  },
  coverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 30,
    textAlign: 'center',
  },
  coverCompanyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  coverDate: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 40,
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2 solid #1F3C58',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLogo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F3C58',
    letterSpacing: 1,
  },
  headerPageNum: {
    fontSize: 9,
    color: '#666666',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1 solid #E5E5E5',
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 6,
    marginTop: 10,
  },
  highlightBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    borderLeft: '3 solid #1F3C58',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    borderLeft: '3 solid #F59E0B',
  },
  successBox: {
    backgroundColor: '#D1FAE5',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    borderLeft: '3 solid #10B981',
  },
  text: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 5,
    lineHeight: 1.5,
  },
  boldText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 3,
  },
  smallText: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 4,
  },
  table: {
    marginTop: 6,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E5E5E5',
    paddingVertical: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    borderBottom: '1 solid #1F3C58',
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    color: '#333333',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1F3C58',
  },
  checkItem: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  checkBox: {
    width: 12,
    height: 12,
    marginRight: 6,
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
    fontSize: 8,
    color: '#333333',
    flex: 1,
  },
  summaryBox: {
    backgroundColor: '#F0F4F8',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: '1 solid #E5E5E5',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: '#999999',
  },
  executiveBox: {
    backgroundColor: '#1F3C58',
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
  },
  executiveTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  executiveText: {
    fontSize: 9,
    color: '#FFFFFF',
    lineHeight: 1.6,
    opacity: 0.95,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metricBox: {
    width: '24%',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
    marginRight: '1%',
  },
  metricLabel: {
    fontSize: 7,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F3C58',
  },
  metricNote: {
    fontSize: 7,
    color: '#666666',
    marginTop: 2,
  },
  chartContainer: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
  },
  chartTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F3C58',
    marginBottom: 8,
    textAlign: 'center',
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  barLabel: {
    width: 45,
    fontSize: 8,
    color: '#666666',
  },
  barContainer: {
    flex: 1,
    height: 14,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginHorizontal: 6,
  },
  bar: {
    height: 14,
    borderRadius: 3,
  },
  barValue: {
    width: 45,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1F3C58',
    textAlign: 'right',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 15,
  },
  column: {
    flex: 1,
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
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
      <Text style={{ width: 80, fontSize: 8, color: '#666666' }}>{label}</Text>
      <View style={{ flex: 1, height: 10, backgroundColor: '#E5E5E5', borderRadius: 5, marginHorizontal: 6 }}>
        <View style={{ height: 10, width: `${value}%`, backgroundColor: getRiskColor(value), borderRadius: 5 }} />
      </View>
      <Text style={{ width: 35, fontSize: 8, fontWeight: 'bold', color: getRiskColor(value), textAlign: 'right' }}>
        {value <= 30 ? 'Låg' : value <= 60 ? 'Medel' : 'Hög'}
      </Text>
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

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverLogo}>BOLAXO</Text>
        <Text style={styles.coverTitle}>Försäljningsförberedande</Text>
        <Text style={styles.coverTitle}>Analys & Rapport</Text>
        <Text style={styles.coverSubtitle}>En komplett genomgång av ditt företag</Text>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.coverCompanyName}>{companyName}</Text>
          {companyData.industry && (
            <Text style={{ ...styles.coverSubtitle, fontSize: 14, marginBottom: 8, opacity: 0.9 }}>
              {companyData.industry.label}
            </Text>
          )}
          {companyData.orgNumber && (
            <Text style={{ ...styles.coverSubtitle, fontSize: 12 }}>Org.nr: {companyData.orgNumber}</Text>
          )}
        </View>
        <Text style={styles.coverDate}>Genererad: {generatedAt}</Text>
        <Text style={{ ...styles.coverDate, marginTop: 8, fontSize: 9 }}>KONFIDENTIELLT DOKUMENT</Text>
      </Page>

      {/* Page 2: Table of Contents */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 2</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Innehållsförteckning</Text>
          <View style={{ marginTop: 20 }}>
            {[
              { page: 3, title: 'Sammanfattning & Nyckeltal' },
              { page: 4, title: 'Övergripande Bedömning' },
              { page: 5, title: 'Företagsöversikt' },
              { page: 6, title: 'Finansiell Analys - Omsättning & Resultat' },
              { page: 7, title: 'Finansiell Analys - Dokumentation & EBITDA' },
              { page: 8, title: 'Finansiell Analys - Trender & Prognoser' },
              { page: 9, title: 'Affärsrelationer - Kunder' },
              { page: 10, title: 'Affärsrelationer - Leverantörer & Avtal' },
              { page: 11, title: 'Organisation & Ledning' },
              { page: 12, title: 'Nyckelpersoner & Succession' },
              { page: 13, title: 'Balansräkning - Tillgångar' },
              { page: 14, title: 'Balansräkning - Skulder & Justeringar' },
              { page: 15, title: 'Juridisk Dokumentation' },
              { page: 16, title: 'Juridisk Due Diligence-beredskap' },
              { page: 17, title: 'Riskbedömning - Översikt' },
              { page: 18, title: 'Riskbedömning - Detaljanalys' },
              { page: 19, title: 'SWOT-Analys' },
              { page: 20, title: 'Branschspecifik Analys' },
              { page: 21, title: 'Värderingsfaktorer & Multiplar' },
              { page: 22, title: 'Rekommendationer' },
              { page: 23, title: 'Handlingsplan & Tidslinje' },
              { page: 24, title: 'Nästa Steg & Kontakt' },
            ].map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', borderBottom: '1 solid #E5E5E5', paddingVertical: 8 }}>
                <Text style={{ width: 30, fontSize: 10, fontWeight: 'bold', color: '#1F3C58' }}>{item.page}</Text>
                <Text style={{ flex: 1, fontSize: 10, color: '#333333' }}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 3: Executive Summary + Key Metrics */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 3</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sammanfattning</Text>
          {companyData.industry && (
            <View style={{ backgroundColor: '#F0F4F8', padding: 8, borderRadius: 4, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#1F3C58', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 }}>
                <Text style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 'bold' }}>{companyData.industry.label}</Text>
              </View>
              <Text style={{ fontSize: 8, color: '#666666', marginLeft: 8 }}>Branschspecifik analys</Text>
            </View>
          )}
          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Övergripande bedömning</Text>
            <Text style={styles.executiveText}>{analysis.executiveSummary}</Text>
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
              <Text style={styles.metricValue}>{analysis.strengths.length}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Förbättringar</Text>
              <Text style={styles.metricValue}>{analysis.weaknesses.length}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Åtgärder</Text>
              <Text style={styles.metricValue}>{analysis.recommendations.length}</Text>
            </View>
          </View>

          {/* Two column layout for charts */}
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {revenueData.some(d => d.value > 0) && <BarChart data={revenueData} title="Omsättning (MSEK)" />}
            </View>
            <View style={styles.column}>
              {profitData.some(d => d.value > 0) && <BarChart data={profitData} title="Resultat (MSEK)" />}
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Styrkor</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {analysis.strengths.slice(0, 6).map((s, idx) => (
              <View key={idx} style={{ width: '50%', marginBottom: 3 }}>
                <Text style={{ fontSize: 8, color: '#047857' }}>✓ {s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 4: Övergripande Bedömning */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 4</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Övergripande Bedömning</Text>
          
          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Vår samlade bedömning</Text>
            <Text style={styles.executiveText}>{analysis.executiveSummary}</Text>
          </View>

          <Text style={styles.subsectionTitle}>Värderingsintervall</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.text}>{analysis.valuationFactors}</Text>
          </View>

          <Text style={styles.subsectionTitle}>Transaktionsberedskap</Text>
          <View style={styles.metricsGrid}>
            <View style={{ ...styles.metricBox, width: '32%' }}>
              <Text style={styles.metricLabel}>Finansiell dokumentation</Text>
              <Text style={{ ...styles.metricValue, fontSize: 12, color: companyData.financialDocs.hasAuditedReports ? '#10B981' : '#F59E0B' }}>
                {companyData.financialDocs.hasAuditedReports ? 'Komplett' : 'Delvis'}
              </Text>
            </View>
            <View style={{ ...styles.metricBox, width: '32%' }}>
              <Text style={styles.metricLabel}>Juridisk beredskap</Text>
              <Text style={{ ...styles.metricValue, fontSize: 12, color: companyData.legalDocs.articlesOfAssociationUpdated ? '#10B981' : '#F59E0B' }}>
                {companyData.legalDocs.articlesOfAssociationUpdated ? 'Komplett' : 'Kräver arbete'}
              </Text>
            </View>
            <View style={{ ...styles.metricBox, width: '32%' }}>
              <Text style={styles.metricLabel}>Organisatorisk mognad</Text>
              <Text style={{ ...styles.metricValue, fontSize: 12, color: companyData.keyPerson.documentedProcesses ? '#10B981' : '#F59E0B' }}>
                {companyData.keyPerson.documentedProcesses ? 'Hög' : 'Medel'}
              </Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Kritiska framgångsfaktorer</Text>
          <View style={styles.successBox}>
            {analysis.strengths.slice(0, 4).map((s, idx) => (
              <Text key={idx} style={{ fontSize: 9, color: '#047857', marginBottom: 4 }}>✓ {s}</Text>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 5: Company Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 5</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Företagsöversikt & Finansiell Analys</Text>
          
          {companyData.scrapedData && (
            <View style={styles.highlightBox}>
              {companyData.scrapedData.title && <Text style={styles.boldText}>{companyData.scrapedData.title}</Text>}
              {companyData.scrapedData.description && <Text style={styles.text}>{companyData.scrapedData.description}</Text>}
            </View>
          )}

          <Text style={styles.text}>{analysis.companyOverview}</Text>

          {companyData.generatedSummaries.financialDocs && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Finansiell sammanfattning</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.financialDocs}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.financialAnalysis}</Text>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Dokumentation</Text>
              <View style={styles.table}>
                {[
                  { label: 'Reviderade årsredovisningar', ok: companyData.financialDocs.hasAuditedReports },
                  { label: 'Månadsrapporter', ok: companyData.financialDocs.hasMonthlyReports },
                  { label: 'Budget & prognoser', ok: companyData.financialDocs.budgetAvailable },
                ].map((item, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.label}</Text>
                    <Text style={{ ...styles.tableCell, color: item.ok ? '#10B981' : '#EF4444', textAlign: 'right' }}>
                      {item.ok ? '✓' : '✗'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.column}>
              {companyData.financialDocs.ebitdaNotes && (
                <>
                  <Text style={styles.subsectionTitle}>EBITDA-noteringar</Text>
                  <Text style={styles.smallText}>{companyData.financialDocs.ebitdaNotes}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 6: Financial Analysis - Part 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 6</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finansiell Analys - Dokumentation & EBITDA</Text>
          
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Finansiell dokumentation</Text>
              <View style={styles.table}>
                {[
                  { label: 'Reviderade årsredovisningar', ok: companyData.financialDocs.hasAuditedReports, detail: 'Senaste 3-5 år' },
                  { label: 'Månadsrapporter', ok: companyData.financialDocs.hasMonthlyReports, detail: 'Löpande uppföljning' },
                  { label: 'Budget & prognoser', ok: companyData.financialDocs.budgetAvailable, detail: `${companyData.financialDocs.forecastYears || 3} år framåt` },
                ].map((item, idx) => (
                  <View key={idx} style={{ ...styles.tableRow, flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ ...styles.tableCell, fontWeight: 'bold' }}>{item.label}</Text>
                      <Text style={{ ...styles.tableCell, color: item.ok ? '#10B981' : '#EF4444', textAlign: 'right', width: 60 }}>
                        {item.ok ? '✓ Finns' : '✗ Saknas'}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 7, color: '#666666', marginTop: 2 }}>{item.detail}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Kvalitetsbedömning</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.boldText}>Revisionskvalitet</Text>
                <Text style={styles.smallText}>
                  {companyData.financialDocs.hasAuditedReports 
                    ? 'Bolaget har reviderade räkenskaper vilket stärker trovärdigheten för finansiell information.'
                    : 'Reviderade räkenskaper saknas vilket kan försvåra due diligence.'}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>EBITDA-analys & normaliseringar</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.boldText}>EBITDA-noteringar</Text>
            <Text style={styles.text}>{companyData.financialDocs.ebitdaNotes || 'Inga specifika EBITDA-justeringar har dokumenterats.'}</Text>
          </View>

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

      {/* Page 7: Financial Analysis - Part 3 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 7</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finansiell Analys - Trender & Prognoser</Text>
          
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {revenueData.some(d => d.value > 0) && <BarChart data={revenueData} title="Omsättningsutveckling (MSEK)" />}
            </View>
            <View style={styles.column}>
              {profitData.some(d => d.value > 0) && <BarChart data={profitData} title="Resultatutveckling (MSEK)" />}
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Tillväxtanalys</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              Baserat på historisk utveckling visar bolaget en tydlig tillväxttrend. 
              {revenueData.length >= 2 && revenueData[revenueData.length - 1].value > revenueData[0].value 
                ? ` Omsättningen har ökat från ${revenueData[0].value} MSEK till ${revenueData[revenueData.length - 1].value} MSEK.`
                : ' Detaljerad trendanalys kräver ytterligare data.'}
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>Prognoser & framtidsutsikter</Text>
          <Text style={styles.text}>{analysis.financialAnalysis}</Text>

          <View style={styles.highlightBox}>
            <Text style={styles.boldText}>Viktiga nyckeltal att bevaka</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
              {['EBITDA-marginal', 'Tillväxttakt', 'Kassaflöde', 'Rörelsekapital'].map((kpi, idx) => (
                <View key={idx} style={{ width: '25%', marginBottom: 6 }}>
                  <Text style={{ fontSize: 8, color: '#1F3C58', fontWeight: 'bold' }}>• {kpi}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 8: Business Relations - Customers */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 8</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affärsrelationer - Kundanalys</Text>
          
          {companyData.generatedSummaries.businessRelations && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.businessRelations}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.businessRelationsAnalysis}</Text>

          {companyData.businessRelations.topCustomers.some(c => c.name) && (
            <>
              <Text style={styles.subsectionTitle}>Kundkoncentration - Topp 5 kunder</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={{ ...styles.tableHeaderCell, width: '40%' }}>Kund</Text>
                  <Text style={{ ...styles.tableHeaderCell, width: '30%' }}>Andel av oms.</Text>
                  <Text style={{ ...styles.tableHeaderCell, width: '30%' }}>Riskbedömning</Text>
                </View>
                {companyData.businessRelations.topCustomers.filter(c => c.name).map((c, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={{ ...styles.tableCell, width: '40%' }}>{c.name}</Text>
                    <Text style={{ ...styles.tableCell, width: '30%' }}>{c.percentage}%</Text>
                    <Text style={{ ...styles.tableCell, width: '30%', color: parseInt(c.percentage) > 20 ? '#EF4444' : parseInt(c.percentage) > 10 ? '#F59E0B' : '#10B981' }}>
                      {parseInt(c.percentage) > 20 ? 'Hög' : parseInt(c.percentage) > 10 ? 'Medel' : 'Låg'}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={{ ...styles.highlightBox, marginTop: 10 }}>
            <Text style={styles.boldText}>Kundkoncentrationsrisk</Text>
            <Text style={styles.text}>
              {companyData.businessRelations.customerConcentrationRisk === 'high' 
                ? 'Hög koncentration - behöver diversifieras för att minska risk vid transaktion.'
                : companyData.businessRelations.customerConcentrationRisk === 'medium'
                  ? 'Medelhög koncentration - acceptabel men bör bevakas.'
                  : 'Låg koncentration - positiv diversifiering som minskar transaktionsrisk.'}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 9: Business Relations - Suppliers & Agreements */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 9</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affärsrelationer - Leverantörer & Avtal</Text>
          
          {companyData.businessRelations.keySuppliers && (
            <>
              <Text style={styles.subsectionTitle}>Nyckelleverantörer</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.text}>{companyData.businessRelations.keySuppliers}</Text>
              </View>
            </>
          )}

          {companyData.businessRelations.exclusivityAgreements && (
            <>
              <Text style={styles.subsectionTitle}>Exklusivitetsavtal</Text>
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>Bindande avtal att granska</Text>
                <Text style={styles.smallText}>{companyData.businessRelations.exclusivityAgreements}</Text>
              </View>
            </>
          )}

          {companyData.businessRelations.informalAgreements && (
            <>
              <Text style={styles.subsectionTitle}>Informella överenskommelser</Text>
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>! Kräver formalisering</Text>
                <Text style={styles.smallText}>{companyData.businessRelations.informalAgreements}</Text>
              </View>
            </>
          )}

          <Text style={styles.subsectionTitle}>Rekommendationer för affärsrelationer</Text>
          <View style={styles.successBox}>
            <Text style={styles.text}>• Säkerställ skriftliga avtal med alla nyckelleverantörer</Text>
            <Text style={styles.text}>• Dokumentera alla informella överenskommelser</Text>
            <Text style={styles.text}>• Granska förnyelsedatum för viktiga avtal</Text>
            <Text style={styles.text}>• Identifiera change-of-control-klausuler</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 10: Organization & Management */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 10</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organisation & Ledning</Text>
          
          {companyData.generatedSummaries.keyPerson && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.keyPerson}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.keyPersonAnalysis}</Text>

          {companyData.keyPerson.managementTeam && (
            <>
              <Text style={styles.subsectionTitle}>Ledningsgrupp</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.text}>{companyData.keyPerson.managementTeam}</Text>
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 11: Key Persons & Succession */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 11</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nyckelpersoner & Succession</Text>
          
          <Text style={styles.subsectionTitle}>Organisatorisk beredskap</Text>
          <View style={styles.table}>
            {[
              { label: 'Dokumenterade processer', ok: companyData.keyPerson.documentedProcesses, desc: 'Standardiserade arbetssätt och manualer' },
              { label: 'Backup-personer', ok: companyData.keyPerson.backupPersons, desc: 'Ersättare för kritiska roller' },
              { label: 'Ledningsgrupp etablerad', ok: !!companyData.keyPerson.managementTeam, desc: 'Kompetent andra linje' },
              { label: 'Övergångsplan', ok: !!companyData.keyPerson.transitionPlan, desc: 'Plan för ägarskifte' },
            ].map((item, idx) => (
              <View key={idx} style={{ ...styles.tableRow, flexDirection: 'column', paddingVertical: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ ...styles.tableCell, fontWeight: 'bold' }}>{item.label}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ ...styles.checkBox, ...(item.ok ? styles.checkBoxChecked : styles.checkBoxUnchecked), marginRight: 4 }}>
                      {item.ok && <Text style={{ fontSize: 8, color: '#FFF' }}>✓</Text>}
                    </View>
                    <Text style={{ fontSize: 8, color: item.ok ? '#10B981' : '#EF4444' }}>
                      {item.ok ? 'Finns' : 'Saknas'}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 7, color: '#666666', marginTop: 2 }}>{item.desc}</Text>
              </View>
            ))}
          </View>

          {companyData.keyPerson.transitionPlan && (
            <>
              <Text style={styles.subsectionTitle}>Successionsplan</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.text}>{companyData.keyPerson.transitionPlan}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 12: Balance Sheet - Assets */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 12</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balansräkning - Tillgångar</Text>
            
            {companyData.generatedSummaries.balanceSheet && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{companyData.generatedSummaries.balanceSheet}</Text>
              </View>
            )}

            <Text style={styles.text}>{analysis.balanceSheetAnalysis}</Text>

            <Text style={styles.subsectionTitle}>Tillgångsanalys</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={{ ...styles.tableHeaderCell, width: '35%' }}>Post</Text>
                <Text style={{ ...styles.tableHeaderCell, width: '65%' }}>Beskrivning</Text>
              </View>
              {[
                { label: 'Kundfordringar', value: companyData.balanceSheet.receivablesStatus || 'Ej specificerat' },
                { label: 'Lager', value: companyData.balanceSheet.inventoryStatus || 'Ej specificerat' },
                { label: 'Icke-operativa tillgångar', value: companyData.balanceSheet.nonOperatingAssets || 'Inga identifierade' },
              ].map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={{ ...styles.tableCell, width: '35%', fontWeight: 'bold' }}>{item.label}</Text>
                  <Text style={{ ...styles.tableCell, width: '65%', fontSize: 7 }}>{item.value}</Text>
                </View>
              ))}
            </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 13: Balance Sheet - Liabilities & Adjustments */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 13</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balansräkning - Skulder & Justeringar</Text>

          {companyData.balanceSheet.loansToOwners && (
            <>
              <Text style={styles.subsectionTitle}>Lån till/från ägare</Text>
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>Kräver reglering före closing</Text>
                <Text style={styles.text}>{companyData.balanceSheet.loansToOwners}</Text>
              </View>
            </>
          )}

          {companyData.balanceSheet.liabilitiesToClean && (
            <>
              <Text style={styles.subsectionTitle}>Skulder att reglera</Text>
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>! Poster att hantera</Text>
                <Text style={styles.smallText}>{companyData.balanceSheet.liabilitiesToClean}</Text>
              </View>
            </>
          )}

          <Text style={styles.subsectionTitle}>Rekommenderade justeringar</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.text}>• Reglera alla mellanhavanden med ägare</Text>
            <Text style={styles.text}>• Identifiera och värdera icke-operativa tillgångar separat</Text>
            <Text style={styles.text}>• Granska rörelsekapitalbehov och normalnivå</Text>
            <Text style={styles.text}>• Utvärdera eventuell överskottslikviditet</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 14: Legal Documentation */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 14</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Juridisk Dokumentation</Text>
            
          {companyData.generatedSummaries.legalDocs && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.legalDocs}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.legalAnalysis}</Text>

          <Text style={styles.subsectionTitle}>Dokumentstatus</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={{ ...styles.tableHeaderCell, width: '50%' }}>Dokument</Text>
              <Text style={{ ...styles.tableHeaderCell, width: '25%' }}>Status</Text>
              <Text style={{ ...styles.tableHeaderCell, width: '25%' }}>Prioritet</Text>
            </View>
            {[
              { label: 'Bolagsordning (uppdaterad)', ok: companyData.legalDocs.articlesOfAssociationUpdated, prio: 'Hög' },
              { label: 'Aktiebok (komplett)', ok: companyData.legalDocs.shareRegisterComplete, prio: 'Hög' },
              { label: 'Styrelseprotokoll (arkiverade)', ok: companyData.legalDocs.boardMinutesArchived, prio: 'Medel' },
              { label: 'Ägaravtal (granskade)', ok: companyData.legalDocs.ownerAgreementsReviewed, prio: 'Hög' },
              { label: 'Tillstånd (verifierade)', ok: companyData.legalDocs.permitsVerified, prio: 'Hög' },
            ].map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, width: '50%' }}>{item.label}</Text>
                <Text style={{ ...styles.tableCell, width: '25%', color: item.ok ? '#10B981' : '#EF4444' }}>
                  {item.ok ? '✓ Klart' : '✗ Saknas'}
                </Text>
                <Text style={{ ...styles.tableCell, width: '25%', color: item.prio === 'Hög' ? '#EF4444' : '#F59E0B' }}>
                  {item.prio}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 15: Legal Due Diligence Readiness */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 15</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Juridisk Due Diligence-beredskap</Text>

          {companyData.legalDocs.pendingLegalIssues && (
            <>
              <Text style={styles.subsectionTitle}>Pågående ärenden & noteringar</Text>
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>Juridiska noteringar</Text>
                <Text style={styles.text}>{companyData.legalDocs.pendingLegalIssues}</Text>
              </View>
            </>
          )}

          <Text style={styles.subsectionTitle}>Checklista för juridisk DD</Text>
          <View style={styles.highlightBox}>
            {[
              'Bolagsordning - senaste version med alla ändringar',
              'Aktiebok - verifierad och komplett',
              'Styrelseprotokoll - alla beslut arkiverade',
              'Anställningsavtal - alla nyckelpersoner',
              'Kundavtal - samtliga väsentliga avtal',
              'Leverantörsavtal - strategiska partners',
              'Hyresavtal - lokaler och utrustning',
              'Immateriella rättigheter - patent, varumärken',
              'Försäkringar - gällande försäkringsbrev',
              'Tillstånd - branschspecifika certifikat',
            ].map((item, idx) => (
              <Text key={idx} style={{ fontSize: 8, color: '#333333', marginBottom: 3 }}>☐ {item}</Text>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 16: Risk Assessment - Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 16</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riskbedömning - Översikt</Text>
          
          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>
              Övergripande riskprofil: {analysis.riskAssessment.overall === 'low' ? 'LÅG' : analysis.riskAssessment.overall === 'medium' ? 'MEDEL' : 'HÖG'} RISK
            </Text>
            <Text style={styles.executiveText}>
              {analysis.riskAssessment.overall === 'low' 
                ? 'Företaget har en attraktiv riskprofil för potentiella köpare. Inga väsentliga risker har identifierats som skulle kunna påverka en transaktion negativt.'
                : analysis.riskAssessment.overall === 'medium'
                  ? 'Vissa riskfaktorer har identifierats som bör adresseras för att maximera värdet vid en transaktion. Med rätt åtgärder kan dessa hanteras.'
                  : 'Betydande riskfaktorer har identifierats som behöver åtgärdas innan bolaget är redo för en transaktion. Vi rekommenderar att dessa prioriteras.'}
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>Riskprofil per kategori</Text>
          <View style={{ marginBottom: 15 }}>
            <RiskBar label="Finansiell risk" value={analysis.riskAssessment.financialRisk} />
            <RiskBar label="Operationell risk" value={analysis.riskAssessment.operationalRisk} />
            <RiskBar label="Nyckelpersonrisk" value={analysis.riskAssessment.keyPersonRisk} />
            <RiskBar label="Kundrisk" value={analysis.riskAssessment.customerRisk} />
            <RiskBar label="Juridisk risk" value={analysis.riskAssessment.legalRisk} />
          </View>

          <View style={styles.highlightBox}>
            <Text style={styles.boldText}>Riskmätning</Text>
            <Text style={styles.smallText}>
              Risknivåerna är beräknade baserat på insamlad data och branschspecifika riskfaktorer.
              Grön (0-30%) = Låg risk, Gul (31-60%) = Medel risk, Röd (61-100%) = Hög risk.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 17: Risk Assessment - Detail */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 17</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riskbedömning - Detaljanalys</Text>
          
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Finansiell risk ({analysis.riskAssessment.financialRisk}%)</Text>
              <View style={analysis.riskAssessment.financialRisk <= 30 ? styles.successBox : analysis.riskAssessment.financialRisk <= 60 ? styles.warningBox : { ...styles.warningBox, backgroundColor: '#FEE2E2', borderLeft: '3 solid #EF4444' }}>
                <Text style={styles.smallText}>
                  {analysis.riskAssessment.financialRisk <= 30 
                    ? 'Stabil finansiell ställning med god historik och dokumentation.'
                    : analysis.riskAssessment.financialRisk <= 60
                      ? 'Vissa finansiella osäkerheter eller dokumentationsbrister.'
                      : 'Betydande finansiella risker eller bristande dokumentation.'}
                </Text>
              </View>

              <Text style={styles.subsectionTitle}>Operationell risk ({analysis.riskAssessment.operationalRisk}%)</Text>
              <View style={analysis.riskAssessment.operationalRisk <= 30 ? styles.successBox : analysis.riskAssessment.operationalRisk <= 60 ? styles.warningBox : { ...styles.warningBox, backgroundColor: '#FEE2E2', borderLeft: '3 solid #EF4444' }}>
                <Text style={styles.smallText}>
                  {analysis.riskAssessment.operationalRisk <= 30 
                    ? 'Väl dokumenterade processer och stabil drift.'
                    : analysis.riskAssessment.operationalRisk <= 60
                      ? 'Processer finns men kan behöva stärkas.'
                      : 'Bristande processer eller hög operationell komplexitet.'}
                </Text>
              </View>

              <Text style={styles.subsectionTitle}>Juridisk risk ({analysis.riskAssessment.legalRisk}%)</Text>
              <View style={analysis.riskAssessment.legalRisk <= 30 ? styles.successBox : analysis.riskAssessment.legalRisk <= 60 ? styles.warningBox : { ...styles.warningBox, backgroundColor: '#FEE2E2', borderLeft: '3 solid #EF4444' }}>
                <Text style={styles.smallText}>
                  {analysis.riskAssessment.legalRisk <= 30 
                    ? 'Juridisk dokumentation i god ordning.'
                    : analysis.riskAssessment.legalRisk <= 60
                      ? 'Vissa juridiska frågor behöver utredas.'
                      : 'Betydande juridiska risker eller pågående ärenden.'}
                </Text>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Nyckelpersonrisk ({analysis.riskAssessment.keyPersonRisk}%)</Text>
              <View style={analysis.riskAssessment.keyPersonRisk <= 30 ? styles.successBox : analysis.riskAssessment.keyPersonRisk <= 60 ? styles.warningBox : { ...styles.warningBox, backgroundColor: '#FEE2E2', borderLeft: '3 solid #EF4444' }}>
                <Text style={styles.smallText}>
                  {analysis.riskAssessment.keyPersonRisk <= 30 
                    ? 'God organisatorisk bredd och successionsplan.'
                    : analysis.riskAssessment.keyPersonRisk <= 60
                      ? 'Visst beroende av nyckelpersoner finns.'
                      : 'Kritiskt beroende av ägare/nyckelpersoner.'}
                </Text>
              </View>

              <Text style={styles.subsectionTitle}>Kundrisk ({analysis.riskAssessment.customerRisk}%)</Text>
              <View style={analysis.riskAssessment.customerRisk <= 30 ? styles.successBox : analysis.riskAssessment.customerRisk <= 60 ? styles.warningBox : { ...styles.warningBox, backgroundColor: '#FEE2E2', borderLeft: '3 solid #EF4444' }}>
                <Text style={styles.smallText}>
                  {analysis.riskAssessment.customerRisk <= 30 
                    ? 'Diversifierad kundbas med stabila relationer.'
                    : analysis.riskAssessment.customerRisk <= 60
                      ? 'Viss kundkoncentration men hanterbar.'
                      : 'Hög kundkoncentration som utgör en risk.'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 18: SWOT Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 18</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SWOT-Analys</Text>
          
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={{ ...styles.successBox, marginBottom: 10 }}>
                <Text style={{ ...styles.boldText, color: '#047857', marginBottom: 6 }}>✓ STYRKOR (Strengths)</Text>
                {analysis.strengths.map((s, idx) => (
                  <Text key={idx} style={{ fontSize: 8, color: '#047857', marginBottom: 4 }}>• {s}</Text>
                ))}
              </View>

              <View style={{ ...styles.highlightBox, backgroundColor: '#DBEAFE', borderLeft: '3 solid #3B82F6' }}>
                <Text style={{ ...styles.boldText, color: '#1D4ED8', marginBottom: 6 }}>→ MÖJLIGHETER (Opportunities)</Text>
                <Text style={{ fontSize: 8, color: '#1D4ED8', marginBottom: 4 }}>• Tillväxtpotential genom nya marknader</Text>
                <Text style={{ fontSize: 8, color: '#1D4ED8', marginBottom: 4 }}>• Synergier med potentiella köpare</Text>
                <Text style={{ fontSize: 8, color: '#1D4ED8', marginBottom: 4 }}>• Digitalisering och effektivisering</Text>
                <Text style={{ fontSize: 8, color: '#1D4ED8', marginBottom: 4 }}>• Branschkonsolidering</Text>
              </View>
            </View>

            <View style={styles.column}>
              <View style={{ ...styles.warningBox, marginBottom: 10 }}>
                <Text style={{ ...styles.boldText, color: '#92400E', marginBottom: 6 }}>! SVAGHETER (Weaknesses)</Text>
                {analysis.weaknesses.map((w, idx) => (
                  <Text key={idx} style={{ fontSize: 8, color: '#92400E', marginBottom: 4 }}>• {w}</Text>
                ))}
              </View>

              <View style={{ ...styles.highlightBox, backgroundColor: '#FEE2E2', borderLeft: '3 solid #EF4444' }}>
                <Text style={{ ...styles.boldText, color: '#B91C1C', marginBottom: 6 }}>⚠ HOT (Threats)</Text>
                <Text style={{ fontSize: 8, color: '#B91C1C', marginBottom: 4 }}>• Marknadsförändringar</Text>
                <Text style={{ fontSize: 8, color: '#B91C1C', marginBottom: 4 }}>• Konkurrenssituation</Text>
                <Text style={{ fontSize: 8, color: '#B91C1C', marginBottom: 4 }}>• Regulatoriska förändringar</Text>
                <Text style={{ fontSize: 8, color: '#B91C1C', marginBottom: 4 }}>• Ekonomiska konjunkturer</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 19: Industry Specific Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 19</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Branschspecifik Analys{companyData.industry ? `: ${companyData.industry.label}` : ''}</Text>
            
            {analysis.industrySpecific.typicalMultiples && (
              <View style={styles.highlightBox}>
                <Text style={styles.boldText}>Typiska värderingsmultiplar</Text>
                <Text style={styles.text}>{analysis.industrySpecific.typicalMultiples}</Text>
              </View>
            )}

            {analysis.industrySpecific.buyerTypes && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subsectionTitle}>Typiska köpare</Text>
                <Text style={styles.text}>{analysis.industrySpecific.buyerTypes}</Text>
              </View>
            )}

            <View style={styles.twoColumn}>
              <View style={styles.column}>
                {analysis.industrySpecific.keyValueDrivers && analysis.industrySpecific.keyValueDrivers.length > 0 && (
                  <>
                    <Text style={styles.subsectionTitle}>Branschens värdedrivare</Text>
                    <View style={styles.successBox}>
                      {analysis.industrySpecific.keyValueDrivers.map((driver, idx) => (
                        <Text key={idx} style={{ fontSize: 8, color: '#047857', marginTop: 2 }}>✓ {driver}</Text>
                      ))}
                    </View>
                  </>
                )}
              </View>
              <View style={styles.column}>
                {analysis.industrySpecific.commonRisks && analysis.industrySpecific.commonRisks.length > 0 && (
                  <>
                    <Text style={styles.subsectionTitle}>Branschspecifika risker</Text>
                    <View style={styles.warningBox}>
                      {analysis.industrySpecific.commonRisks.map((risk, idx) => (
                        <Text key={idx} style={{ fontSize: 8, color: '#92400E', marginTop: 2 }}>! {risk}</Text>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>

            {analysis.industrySpecific.dueDiligenceFocus && analysis.industrySpecific.dueDiligenceFocus.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subsectionTitle}>Due Diligence-fokus för branschen</Text>
                <View style={styles.highlightBox}>
                  {analysis.industrySpecific.dueDiligenceFocus.map((focus, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', marginBottom: 4 }}>
                      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#1F3C58', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                        <Text style={{ fontSize: 9, color: '#FFF', fontWeight: 'bold' }}>{idx + 1}</Text>
                      </View>
                      <Text style={{ ...styles.text, flex: 1, marginTop: 2 }}>{focus}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {!analysis.industrySpecific && (
            <View style={styles.highlightBox}>
              <Text style={styles.text}>
                Branschspecifik analys är tillgänglig när bransch har angetts. 
                Denna analys inkluderar typiska värderingsmultiplar, köpartyper, 
                värdedrivare och due diligence-fokusområden för din specifika bransch.
              </Text>
            </View>
          )}

          {analysis.industrySpecific?.typicalMultiples && (
            <View style={styles.highlightBox}>
              <Text style={styles.boldText}>Typiska värderingsmultiplar i branschen</Text>
              <Text style={styles.text}>{analysis.industrySpecific.typicalMultiples}</Text>
            </View>
          )}

          {analysis.industrySpecific?.buyerTypes && (
            <>
              <Text style={styles.subsectionTitle}>Typiska köpare</Text>
              <Text style={styles.text}>{analysis.industrySpecific.buyerTypes}</Text>
            </>
          )}

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {analysis.industrySpecific?.keyValueDrivers && (
                <>
                  <Text style={styles.subsectionTitle}>Värdedrivare</Text>
                  <View style={styles.successBox}>
                    {analysis.industrySpecific.keyValueDrivers.map((driver, idx) => (
                      <Text key={idx} style={{ fontSize: 8, color: '#047857', marginBottom: 3 }}>✓ {driver}</Text>
                    ))}
                  </View>
                </>
              )}
            </View>
            <View style={styles.column}>
              {analysis.industrySpecific?.commonRisks && (
                <>
                  <Text style={styles.subsectionTitle}>Branschrisker</Text>
                  <View style={styles.warningBox}>
                    {analysis.industrySpecific.commonRisks.map((risk, idx) => (
                      <Text key={idx} style={{ fontSize: 8, color: '#92400E', marginBottom: 3 }}>! {risk}</Text>
                    ))}
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

      {/* Page 20: Valuation Factors */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 20</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Värderingsfaktorer & Multiplar</Text>
          
          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Värderingsintervall</Text>
            <Text style={styles.executiveText}>{analysis.valuationFactors}</Text>
          </View>

          <Text style={styles.subsectionTitle}>Värderingspåverkande faktorer</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.successBox}>
                <Text style={styles.boldText}>Faktorer som höjer värdet</Text>
                <Text style={styles.smallText}>• Stabil och förutsägbar intjäning</Text>
                <Text style={styles.smallText}>• Diversifierad kundbas</Text>
                <Text style={styles.smallText}>• Stark ledningsgrupp</Text>
                <Text style={styles.smallText}>• Dokumenterade processer</Text>
                <Text style={styles.smallText}>• Tillväxtpotential</Text>
                <Text style={styles.smallText}>• Återkommande intäkter</Text>
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
                <Text style={styles.smallText}>• Negativa trender</Text>
              </View>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Vanliga värderingsmetoder</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={{ ...styles.tableHeaderCell, width: '30%' }}>Metod</Text>
              <Text style={{ ...styles.tableHeaderCell, width: '70%' }}>Beskrivning</Text>
            </View>
            {[
              { method: 'EV/EBITDA', desc: 'Enterprise Value dividerat med EBITDA. Vanligast för lönsamma SME-bolag.' },
              { method: 'EV/Omsättning', desc: 'För tillväxtbolag eller bolag med låg lönsamhet.' },
              { method: 'DCF', desc: 'Diskonterat kassaflöde - baserat på framtida kassaflöden.' },
              { method: 'Substansvärde', desc: 'Baserat på tillgångarnas marknadsvärde minus skulder.' },
            ].map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, width: '30%', fontWeight: 'bold' }}>{item.method}</Text>
                <Text style={{ ...styles.tableCell, width: '70%', fontSize: 7 }}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 21: Recommendations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 21</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekommendationer</Text>

          <Text style={styles.subsectionTitle}>Prioriterade åtgärder</Text>
          {analysis.recommendations.map((rec, idx) => (
            <View key={idx} style={{ ...styles.highlightBox, marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#1F3C58', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Text style={{ fontSize: 11, color: '#FFF', fontWeight: 'bold' }}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...styles.text, marginBottom: 0 }}>{rec}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 22: Action Plan & Timeline */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 22</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Handlingsplan & Tidslinje</Text>

          <Text style={styles.subsectionTitle}>Steg-för-steg tidplan</Text>
          {analysis.nextSteps.map((step, idx) => (
            <View key={idx} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' }}>
              <View style={{ width: 30, alignItems: 'center', marginRight: 10 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: idx === 0 ? '#10B981' : '#1F3C58', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 10, color: '#FFF', fontWeight: 'bold' }}>{idx + 1}</Text>
                </View>
                {idx < analysis.nextSteps.length - 1 && (
                  <View style={{ width: 2, height: 20, backgroundColor: '#E5E5E5', marginTop: 4 }} />
                )}
              </View>
              <View style={{ flex: 1, paddingTop: 2 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1F3C58', marginBottom: 2 }}>Steg {idx + 1}</Text>
                <Text style={{ fontSize: 8, color: '#666666' }}>{step}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 23: Next Steps & Contact */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 23</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nästa Steg & Kontakt</Text>

          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Sammanfattning</Text>
            <Text style={styles.executiveText}>
              Denna rapport har gett en övergripande bild av {companyName}s transaktionsberedskap.
              Med identifierade styrkor, förbättringsområden och en tydlig handlingsplan är ni väl 
              rustade att ta nästa steg i försäljningsprocessen.
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>Omedelbara nästa steg</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.text}>1. Granska rapporten och prioritera identifierade åtgärder</Text>
            <Text style={styles.text}>2. Samla in kompletterande dokumentation för datarum</Text>
            <Text style={styles.text}>3. Boka uppföljningsmöte med BOLAXO för fördjupad rådgivning</Text>
            <Text style={styles.text}>4. Diskutera tidplan och processupplägg</Text>
          </View>

          <View style={{ ...styles.executiveBox, marginTop: 20 }}>
            <Text style={styles.executiveTitle}>Behöver du professionell hjälp?</Text>
            <Text style={styles.executiveText}>
              BOLAXO erbjuder komplett stöd genom hela försäljningsprocessen - från 
              förberedelse och värdering till marknadsföring, köparidentifiering och closing.
            </Text>
            <View style={{ marginTop: 15, borderTop: '1 solid rgba(255,255,255,0.3)', paddingTop: 15 }}>
              <Text style={{ ...styles.executiveText, fontWeight: 'bold', marginBottom: 8 }}>Kontakta oss</Text>
              <Text style={styles.executiveText}>✉ kontakt@bolaxo.se</Text>
              <Text style={styles.executiveText}>🌐 www.bolaxo.se</Text>
              <Text style={styles.executiveText}>📞 +46 8 123 456 78</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 24: Appendix & Disclaimer */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 24</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bilagor & Ansvarsfriskrivning</Text>

          <Text style={styles.subsectionTitle}>Om denna rapport</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.smallText}>
              Denna rapport har genererats av BOLAXO:s analysverktyg baserat på information som 
              tillhandahållits av företagsägaren. Rapporten är avsedd som ett stöd i 
              försäljningsförberedelser och ersätter inte professionell rådgivning.
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>Datakällor</Text>
          <View style={styles.table}>
            {[
              { source: 'Företagsinformation', desc: 'Tillhandahållen av ägaren via BOLAXO-plattformen' },
              { source: 'Finansiell data', desc: 'Baserat på uppgifter om omsättning, resultat och EBITDA' },
              { source: 'Branschdata', desc: 'BOLAXO:s databas med transaktionsmultiplar och branschinformation' },
              { source: 'Riskbedömning', desc: 'Algoritmisk bedömning baserad på insamlad data' },
            ].map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, width: '35%', fontWeight: 'bold' }}>{item.source}</Text>
                <Text style={{ ...styles.tableCell, width: '65%', fontSize: 7 }}>{item.desc}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.subsectionTitle}>Ansvarsfriskrivning</Text>
          <View style={{ ...styles.warningBox, backgroundColor: '#F3F4F6', borderLeft: '3 solid #6B7280' }}>
            <Text style={{ fontSize: 7, color: '#374151', lineHeight: 1.5 }}>
              Informationen i denna rapport är baserad på uppgifter som tillhandahållits av 
              företagsägaren och offentligt tillgängliga källor. BOLAXO AB garanterar inte 
              uppgifternas riktighet eller fullständighet. Värderingsintervall och 
              rekommendationer utgör inte finansiell rådgivning och ska inte ligga till grund 
              för investeringsbeslut utan kompletterande due diligence. BOLAXO AB frånsäger sig 
              allt ansvar för eventuella förluster som kan uppstå till följd av användning av 
              informationen i denna rapport. Vi rekommenderar att anlita kvalificerad juridisk, 
              finansiell och skattemässig rådgivning inför en företagstransaktion.
            </Text>
          </View>

          <View style={{ marginTop: 20, textAlign: 'center' }}>
            <Text style={{ fontSize: 10, color: '#1F3C58', fontWeight: 'bold' }}>BOLAXO AB</Text>
            <Text style={{ fontSize: 8, color: '#666666', marginTop: 4 }}>Norrmälarstrand 10, 114 62 Stockholm</Text>
            <Text style={{ fontSize: 8, color: '#666666', marginTop: 2 }}>Org.nr: 559XXX-XXXX</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Rapport genererad: {generatedAt}</Text>
        </View>
      </Page>
    </Document>
  )
}
