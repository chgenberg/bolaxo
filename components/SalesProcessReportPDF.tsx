'use client'

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { CompanyData } from './SalesProcessDataModal'

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
  },
  // Cover page
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
  // Header
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
  // Section styles
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
  // Content boxes
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
  // Text styles
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
  // Table styles
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
  // Checklist
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
  // Summary box
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
  // Risk indicator
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
  // Footer
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
  // Executive summary box
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
  // Key metrics grid
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

export default function SalesProcessReportPDF({ 
  companyData, 
  analysis, 
  generatedAt 
}: SalesProcessReportPDFProps) {
  const getRiskColor = (value: number) => {
    if (value <= 30) return '#10B981' // Green
    if (value <= 60) return '#F59E0B' // Amber
    return '#EF4444' // Red
  }

  const companyName = companyData.companyName || companyData.scrapedData?.title || 'Företaget'

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
              { title: 'Företagsöversikt', page: 4 },
              { title: 'Finansiell analys', page: 5 },
              { title: 'Affärsrelationer & kundbas', page: 6 },
              { title: 'Organisation & nyckelpersoner', page: 7 },
              { title: 'Balansräkning & tillgångar', page: 8 },
              { title: 'Juridisk dokumentation', page: 9 },
              { title: 'Riskbedömning', page: 10 },
              { title: 'Styrkor & svagheter (SWOT)', page: 11 },
              { title: 'Rekommendationer & nästa steg', page: 12 },
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

          {/* Key Metrics Grid */}
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
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 4</Text>
        </View>
      </Page>

      {/* Financial Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finansiell Analys</Text>
          
          {companyData.generatedSummaries.financialDocs && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Sammanfattning - Finansiell dokumentation</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.financialDocs}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.financialAnalysis}</Text>

          {/* Financial data table */}
          <Text style={styles.subsectionTitle}>Angiven finansiell data</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Parameter</Text>
              <Text style={styles.tableHeaderCell}>Värde/Status</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Omsättning (3 år)</Text>
              <Text style={styles.tableCell}>{companyData.financialDocs.revenue3Years || 'Ej angivet'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Resultat (3 år)</Text>
              <Text style={styles.tableCell}>{companyData.financialDocs.profit3Years || 'Ej angivet'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Reviderade årsredovisningar</Text>
              <Text style={styles.tableCell}>{companyData.financialDocs.hasAuditedReports ? 'Ja' : 'Nej'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Månadsrapporter</Text>
              <Text style={styles.tableCell}>{companyData.financialDocs.hasMonthlyReports ? 'Ja' : 'Nej'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Budget & prognoser</Text>
              <Text style={styles.tableCell}>{companyData.financialDocs.budgetAvailable ? 'Ja' : 'Nej'}</Text>
            </View>
          </View>

          {companyData.financialDocs.ebitdaNotes && (
            <>
              <Text style={styles.subsectionTitle}>EBITDA-justeringar</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.text}>{companyData.financialDocs.ebitdaNotes}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 5</Text>
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
              <Text style={styles.summaryTitle}>Sammanfattning - Affärsrelationer</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.businessRelations}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.businessRelationsAnalysis}</Text>

          {/* Customer table */}
          {companyData.businessRelations.topCustomers.some(c => c.name) && (
            <>
              <Text style={styles.subsectionTitle}>Största kunder</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderCell}>Kund</Text>
                  <Text style={styles.tableHeaderCell}>Andel av omsättning</Text>
                </View>
                {companyData.businessRelations.topCustomers
                  .filter(c => c.name)
                  .map((customer, idx) => (
                    <View key={idx} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{customer.name}</Text>
                      <Text style={styles.tableCell}>{customer.percentage}%</Text>
                    </View>
                  ))}
              </View>
            </>
          )}

          {companyData.businessRelations.customerConcentrationRisk && (
            <View style={
              companyData.businessRelations.customerConcentrationRisk === 'high' ? styles.warningBox :
              companyData.businessRelations.customerConcentrationRisk === 'low' ? styles.successBox :
              styles.highlightBox
            }>
              <Text style={styles.boldText}>Kundkoncentrationsrisk</Text>
              <Text style={styles.text}>
                {companyData.businessRelations.customerConcentrationRisk === 'low' ? 'Låg - God diversifiering' :
                 companyData.businessRelations.customerConcentrationRisk === 'medium' ? 'Medel - Viss koncentration' :
                 'Hög - Betydande beroende av enskilda kunder'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 6</Text>
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
              <Text style={styles.summaryTitle}>Sammanfattning - Nyckelpersonberoende</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.keyPerson}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.keyPersonAnalysis}</Text>

          <View style={
            companyData.keyPerson.ownerInvolvement === 'critical' || companyData.keyPerson.ownerInvolvement === 'high' 
              ? styles.warningBox 
              : styles.highlightBox
          }>
            <Text style={styles.boldText}>Ägarens involvering</Text>
            <Text style={styles.text}>
              {companyData.keyPerson.ownerInvolvement === 'critical' ? 'Kritisk - Verksamheten stannar utan ägaren' :
               companyData.keyPerson.ownerInvolvement === 'high' ? 'Hög - Involverad i de flesta beslut' :
               companyData.keyPerson.ownerInvolvement === 'medium' ? 'Medel - Delegerar men övervakar' :
               companyData.keyPerson.ownerInvolvement === 'low' ? 'Låg - Verksamheten fungerar utan ägaren' :
               'Ej bedömd'}
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>Beredskap</Text>
          <View style={styles.checkItem}>
            <View style={{ 
              ...styles.checkBox, 
              ...(companyData.keyPerson.documentedProcesses ? styles.checkBoxChecked : styles.checkBoxUnchecked) 
            }}>
              {companyData.keyPerson.documentedProcesses && <Text style={{ fontSize: 10, color: '#FFFFFF' }}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Dokumenterade processer och rutiner</Text>
          </View>
          <View style={styles.checkItem}>
            <View style={{ 
              ...styles.checkBox, 
              ...(companyData.keyPerson.backupPersons ? styles.checkBoxChecked : styles.checkBoxUnchecked) 
            }}>
              {companyData.keyPerson.backupPersons && <Text style={{ fontSize: 10, color: '#FFFFFF' }}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Backup-personer för kritiska roller</Text>
          </View>

          {companyData.keyPerson.managementTeam && (
            <>
              <Text style={styles.subsectionTitle}>Ledningsgrupp</Text>
              <Text style={styles.text}>{companyData.keyPerson.managementTeam}</Text>
            </>
          )}

          {companyData.keyPerson.transitionPlan && (
            <>
              <Text style={styles.subsectionTitle}>Övergångsplan</Text>
              <Text style={styles.text}>{companyData.keyPerson.transitionPlan}</Text>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 7</Text>
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
              <Text style={styles.summaryTitle}>Sammanfattning - Balansräkning</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.balanceSheet}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.balanceSheetAnalysis}</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Post</Text>
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
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 8</Text>
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
              <Text style={styles.summaryTitle}>Sammanfattning - Juridik</Text>
              <Text style={styles.summaryText}>{companyData.generatedSummaries.legalDocs}</Text>
            </View>
          )}

          <Text style={styles.text}>{analysis.legalAnalysis}</Text>

          <Text style={styles.subsectionTitle}>Checklista juridiska dokument</Text>
          <View style={styles.checkItem}>
            <View style={{ 
              ...styles.checkBox, 
              ...(companyData.legalDocs.articlesOfAssociationUpdated ? styles.checkBoxChecked : styles.checkBoxUnchecked) 
            }}>
              {companyData.legalDocs.articlesOfAssociationUpdated && <Text style={{ fontSize: 10, color: '#FFFFFF' }}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Bolagsordning uppdaterad</Text>
          </View>
          <View style={styles.checkItem}>
            <View style={{ 
              ...styles.checkBox, 
              ...(companyData.legalDocs.shareRegisterComplete ? styles.checkBoxChecked : styles.checkBoxUnchecked) 
            }}>
              {companyData.legalDocs.shareRegisterComplete && <Text style={{ fontSize: 10, color: '#FFFFFF' }}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Aktiebok komplett</Text>
          </View>
          <View style={styles.checkItem}>
            <View style={{ 
              ...styles.checkBox, 
              ...(companyData.legalDocs.boardMinutesArchived ? styles.checkBoxChecked : styles.checkBoxUnchecked) 
            }}>
              {companyData.legalDocs.boardMinutesArchived && <Text style={{ fontSize: 10, color: '#FFFFFF' }}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Styrelsebeslut arkiverade</Text>
          </View>
          <View style={styles.checkItem}>
            <View style={{ 
              ...styles.checkBox, 
              ...(companyData.legalDocs.ownerAgreementsReviewed ? styles.checkBoxChecked : styles.checkBoxUnchecked) 
            }}>
              {companyData.legalDocs.ownerAgreementsReviewed && <Text style={{ fontSize: 10, color: '#FFFFFF' }}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Ägaravtal granskade</Text>
          </View>
          <View style={styles.checkItem}>
            <View style={{ 
              ...styles.checkBox, 
              ...(companyData.legalDocs.permitsVerified ? styles.checkBoxChecked : styles.checkBoxUnchecked) 
            }}>
              {companyData.legalDocs.permitsVerified && <Text style={{ fontSize: 10, color: '#FFFFFF' }}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Tillstånd verifierade</Text>
          </View>

          {companyData.legalDocs.pendingLegalIssues && (
            <View style={styles.warningBox}>
              <Text style={styles.boldText}>Pågående juridiska frågor</Text>
              <Text style={styles.text}>{companyData.legalDocs.pendingLegalIssues}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 9</Text>
        </View>
      </Page>

      {/* Risk Assessment */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riskbedömning</Text>
          
          <View style={styles.executiveBox}>
            <Text style={styles.executiveTitle}>Övergripande riskprofil: {
              analysis.riskAssessment.overall === 'low' ? 'LÅG' :
              analysis.riskAssessment.overall === 'medium' ? 'MEDEL' : 'HÖG'
            }</Text>
            <Text style={styles.executiveText}>
              Denna bedömning baseras på en genomgång av finansiella, operationella, 
              nyckelperson-, kund- och juridiska risker.
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>Detaljerad riskanalys</Text>
          
          {/* Risk bars */}
          {[
            { label: 'Finansiell risk', value: analysis.riskAssessment.financialRisk },
            { label: 'Operationell risk', value: analysis.riskAssessment.operationalRisk },
            { label: 'Nyckelpersonrisk', value: analysis.riskAssessment.keyPersonRisk },
            { label: 'Kundrisk', value: analysis.riskAssessment.customerRisk },
            { label: 'Juridisk risk', value: analysis.riskAssessment.legalRisk },
          ].map((risk, idx) => (
            <View key={idx} style={styles.riskContainer}>
              <Text style={styles.riskLabel}>{risk.label}</Text>
              <View style={styles.riskBar}>
                <View style={{ 
                  ...styles.riskFill, 
                  width: `${risk.value}%`, 
                  backgroundColor: getRiskColor(risk.value) 
                }} />
              </View>
              <Text style={{ ...styles.riskValue, color: getRiskColor(risk.value) }}>{risk.value}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 10</Text>
        </View>
      </Page>

      {/* SWOT Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>BOLAXO</Text>
          <Text style={styles.headerPageNum}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Styrkor & Svagheter</Text>

          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <View style={styles.successBox}>
                <Text style={styles.boldText}>Styrkor</Text>
                {analysis.strengths.map((strength, idx) => (
                  <View key={idx} style={{ ...styles.checkItem, marginTop: 6 }}>
                    <Text style={{ ...styles.checkText, color: '#047857' }}>✓ {strength}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.warningBox}>
                <Text style={styles.boldText}>Förbättringsområden</Text>
                {analysis.weaknesses.map((weakness, idx) => (
                  <View key={idx} style={{ ...styles.checkItem, marginTop: 6 }}>
                    <Text style={{ ...styles.checkText, color: '#92400E' }}>! {weakness}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Värderingspåverkande faktorer</Text>
          <Text style={styles.text}>{analysis.valuationFactors}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 11</Text>
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
              <Text style={styles.boldText}>{idx + 1}. {rec}</Text>
            </View>
          ))}

          <Text style={styles.subsectionTitle}>Nästa steg i försäljningsprocessen</Text>
          {analysis.nextSteps.map((step, idx) => (
            <View key={idx} style={styles.checkItem}>
              <View style={{ ...styles.checkBox, backgroundColor: '#1F3C58' }}>
                <Text style={{ fontSize: 8, color: '#FFFFFF' }}>{idx + 1}</Text>
              </View>
              <Text style={styles.checkText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={{ ...styles.executiveBox, marginTop: 30 }}>
          <Text style={styles.executiveTitle}>Behöver du hjälp?</Text>
          <Text style={styles.executiveText}>
            BOLAXO erbjuder professionell rådgivning genom hela försäljningsprocessen. 
            Kontakta oss för att diskutera hur vi kan hjälpa dig att maximera värdet vid försäljning av ditt företag.
          </Text>
          <Text style={{ ...styles.executiveText, marginTop: 15, fontWeight: 'bold' }}>
            kontakt@bolaxo.se | bolaxo.se
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BOLAXO AB | Konfidentiellt dokument | Sida 12</Text>
        </View>
      </Page>
    </Document>
  )
}

