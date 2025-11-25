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
          {companyData.orgNumber && (
            <Text style={{ ...styles.coverSubtitle, fontSize: 12 }}>Org.nr: {companyData.orgNumber}</Text>
          )}
        </View>
        <Text style={styles.coverDate}>Genererad: {generatedAt}</Text>
        <Text style={{ ...styles.coverDate, marginTop: 8, fontSize: 9 }}>KONFIDENTIELLT DOKUMENT</Text>
      </Page>

      {/* Page 2: Executive Summary + Key Metrics */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 2</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sammanfattning</Text>
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

      {/* Page 3: Company Overview + Financial Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 3</Text>
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

      {/* Page 4: Business Relations + Key Person */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 4</Text>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Affärsrelationer</Text>
            
            {companyData.generatedSummaries.businessRelations && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{companyData.generatedSummaries.businessRelations}</Text>
              </View>
            )}

            <Text style={styles.text}>{analysis.businessRelationsAnalysis}</Text>

            {companyData.businessRelations.topCustomers.some(c => c.name) && (
              <>
                <Text style={styles.subsectionTitle}>Största kunder</Text>
                <View style={styles.table}>
                  {companyData.businessRelations.topCustomers.filter(c => c.name).map((c, idx) => (
                    <View key={idx} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{c.name}</Text>
                      <Text style={{ ...styles.tableCell, textAlign: 'right' }}>{c.percentage}%</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {companyData.businessRelations.keySuppliers && (
              <Text style={styles.smallText}>Leverantörer: {companyData.businessRelations.keySuppliers}</Text>
            )}
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Organisation</Text>
            
            {companyData.generatedSummaries.keyPerson && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{companyData.generatedSummaries.keyPerson}</Text>
              </View>
            )}

            <Text style={styles.text}>{analysis.keyPersonAnalysis}</Text>

            <View style={companyData.keyPerson.ownerInvolvement === 'critical' || companyData.keyPerson.ownerInvolvement === 'high' ? styles.warningBox : styles.successBox}>
              <Text style={styles.boldText}>Ägarinvolvering: {
                companyData.keyPerson.ownerInvolvement === 'critical' ? 'Kritisk' :
                companyData.keyPerson.ownerInvolvement === 'high' ? 'Hög' :
                companyData.keyPerson.ownerInvolvement === 'medium' ? 'Medel' :
                companyData.keyPerson.ownerInvolvement === 'low' ? 'Låg' : 'Ej bedömd'
              }</Text>
            </View>

            <Text style={styles.subsectionTitle}>Beredskap</Text>
            {[
              { label: 'Dokumenterade processer', ok: companyData.keyPerson.documentedProcesses },
              { label: 'Backup-personer', ok: companyData.keyPerson.backupPersons },
              { label: 'Ledningsgrupp', ok: !!companyData.keyPerson.managementTeam },
              { label: 'Övergångsplan', ok: !!companyData.keyPerson.transitionPlan },
            ].map((item, idx) => (
              <View key={idx} style={styles.checkItem}>
                <View style={{ ...styles.checkBox, ...(item.ok ? styles.checkBoxChecked : styles.checkBoxUnchecked) }}>
                  {item.ok && <Text style={{ fontSize: 8, color: '#FFF' }}>✓</Text>}
                </View>
                <Text style={styles.checkText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 5: Balance Sheet + Legal */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 5</Text>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Balansräkning</Text>
            
            {companyData.generatedSummaries.balanceSheet && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{companyData.generatedSummaries.balanceSheet}</Text>
              </View>
            )}

            <Text style={styles.text}>{analysis.balanceSheetAnalysis}</Text>

            <View style={styles.table}>
              {[
                { label: 'Lån till ägare', value: companyData.balanceSheet.loansToOwners || 'Inga' },
                { label: 'Icke-operativa tillgångar', value: companyData.balanceSheet.nonOperatingAssets || 'Inga' },
                { label: 'Lagerstatus', value: companyData.balanceSheet.inventoryStatus || '-' },
                { label: 'Kundfordringar', value: companyData.balanceSheet.receivablesStatus || '-' },
              ].map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={{ ...styles.tableCell, fontWeight: 'bold' }}>{item.label}</Text>
                  <Text style={styles.tableCell}>{item.value}</Text>
                </View>
              ))}
            </View>

            {companyData.balanceSheet.liabilitiesToClean && (
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>Att reglera</Text>
                <Text style={styles.smallText}>{companyData.balanceSheet.liabilitiesToClean}</Text>
              </View>
            )}
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Juridisk dokumentation</Text>
            
            {companyData.generatedSummaries.legalDocs && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{companyData.generatedSummaries.legalDocs}</Text>
              </View>
            )}

            <Text style={styles.text}>{analysis.legalAnalysis}</Text>

            <View style={styles.table}>
              {[
                { label: 'Bolagsordning', ok: companyData.legalDocs.articlesOfAssociationUpdated },
                { label: 'Aktiebok', ok: companyData.legalDocs.shareRegisterComplete },
                { label: 'Styrelsebeslut', ok: companyData.legalDocs.boardMinutesArchived },
                { label: 'Ägaravtal', ok: companyData.legalDocs.ownerAgreementsReviewed },
                { label: 'Tillstånd', ok: companyData.legalDocs.permitsVerified },
              ].map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.label}</Text>
                  <Text style={{ ...styles.tableCell, color: item.ok ? '#10B981' : '#EF4444', textAlign: 'right' }}>
                    {item.ok ? '✓ Klart' : '✗ Saknas'}
                  </Text>
                </View>
              ))}
            </View>

            {companyData.legalDocs.pendingLegalIssues && (
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>Noteringar</Text>
                <Text style={styles.smallText}>{companyData.legalDocs.pendingLegalIssues}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 6: Risk Assessment + SWOT */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 6</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riskbedömning & SWOT-analys</Text>
          
          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>
              Övergripande riskprofil: {analysis.riskAssessment.overall === 'low' ? 'LÅG' : analysis.riskAssessment.overall === 'medium' ? 'MEDEL' : 'HÖG'} RISK
            </Text>
            <Text style={styles.executiveText}>
              {analysis.riskAssessment.overall === 'low' 
                ? 'Företaget har en attraktiv riskprofil för potentiella köpare.'
                : analysis.riskAssessment.overall === 'medium'
                  ? 'Vissa riskfaktorer bör adresseras för att maximera värdet.'
                  : 'Betydande riskfaktorer behöver åtgärdas.'}
            </Text>
          </View>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Riskprofil</Text>
              <RiskBar label="Finansiell" value={analysis.riskAssessment.financialRisk} />
              <RiskBar label="Operationell" value={analysis.riskAssessment.operationalRisk} />
              <RiskBar label="Nyckelperson" value={analysis.riskAssessment.keyPersonRisk} />
              <RiskBar label="Kund" value={analysis.riskAssessment.customerRisk} />
              <RiskBar label="Juridisk" value={analysis.riskAssessment.legalRisk} />
            </View>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Värderingsfaktorer</Text>
              <Text style={styles.smallText}>{analysis.valuationFactors}</Text>
            </View>
          </View>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.successBox}>
                <Text style={styles.boldText}>✓ STYRKOR</Text>
                {analysis.strengths.map((s, idx) => (
                  <Text key={idx} style={{ fontSize: 7, color: '#047857', marginTop: 2 }}>• {s}</Text>
                ))}
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>! FÖRBÄTTRINGSOMRÅDEN</Text>
                {analysis.weaknesses.map((w, idx) => (
                  <Text key={idx} style={{ fontSize: 7, color: '#92400E', marginTop: 2 }}>• {w}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>

      {/* Page 7: Recommendations + Next Steps */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName} | Sida 7</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekommendationer & Nästa Steg</Text>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Prioriterade åtgärder</Text>
              {analysis.recommendations.map((rec, idx) => (
                <View key={idx} style={{ ...styles.highlightBox, marginBottom: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#1F3C58', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                      <Text style={{ fontSize: 9, color: '#FFF', fontWeight: 'bold' }}>{idx + 1}</Text>
                    </View>
                    <Text style={{ ...styles.text, flex: 1, marginBottom: 0 }}>{rec}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.column}>
              <Text style={styles.subsectionTitle}>Tidplan</Text>
              {analysis.nextSteps.map((step, idx) => (
                <View key={idx} style={{ flexDirection: 'row', marginBottom: 6 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: idx === 0 ? '#10B981' : '#1F3C58', marginRight: 8, marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#1F3C58' }}>Steg {idx + 1}</Text>
                    <Text style={{ fontSize: 7, color: '#666666' }}>{step}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={{ ...styles.executiveBox, marginTop: 15 }}>
            <Text style={styles.executiveTitle}>Behöver du hjälp?</Text>
            <Text style={styles.executiveText}>
              BOLAXO erbjuder professionell rådgivning genom hela försäljningsprocessen.
            </Text>
            <Text style={{ ...styles.executiveText, marginTop: 8, fontWeight: 'bold' }}>
              kontakt@bolaxo.se | bolaxo.se | +46 8 123 456 78
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument</Text>
        </View>
      </Page>
    </Document>
  )
}
