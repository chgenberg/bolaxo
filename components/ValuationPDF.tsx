'use client'

import { Document, Page, Text, View, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer'

// Registrera Inter font om möjligt (annars fallback till Helvetica)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 },
  ]
})

// Skapa stilar för PDF med mörkblå tema
const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#F8FAFD',
    fontFamily: 'Inter',
    fontSize: 11,
    lineHeight: 1.6,
  },
  // Header med mörkblå gradient-liknande effekt
  header: {
    marginBottom: 35,
    paddingBottom: 20,
    borderBottom: '3 solid #1e3a8a',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1e3a8a',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 10,
    color: '#64748b',
    marginLeft: 15,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 10,
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    color: '#94a3b8',
  },
  // Huvudvärderingsbox med mörkblå accent
  valuationBox: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 12,
    marginBottom: 30,
    borderLeft: '5 solid #1e3a8a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  valuationLabel: {
    fontSize: 13,
    marginBottom: 8,
    color: '#1e3a8a',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valuationAmount: {
    fontSize: 36,
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: 10,
  },
  valuationRange: {
    fontSize: 14,
    color: '#64748b',
  },
  // Mjuka vita boxar för sektioner
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1e3a8a',
    marginBottom: 15,
    letterSpacing: -0.5,
  },
  // Metodologi box
  methodBox: {
    backgroundColor: '#f1f5f9',
    padding: 18,
    borderRadius: 6,
    marginBottom: 15,
    borderLeft: '3 solid #3b82f6',
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: '#1e293b',
  },
  methodText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.5,
  },
  // Metrics grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  metricBox: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    marginRight: '2%',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
  },
  // Listor
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 5,
  },
  bullet: {
    width: 20,
    fontSize: 12,
    color: '#3b82f6',
  },
  listText: {
    flex: 1,
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.5,
  },
  // Rekommendationer
  recommendation: {
    marginBottom: 18,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderLeft: '3 solid #10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#0f172a',
    flex: 1,
  },
  recDescription: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.5,
  },
  impactBadge: {
    fontSize: 9,
    fontWeight: 600,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  impactHigh: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  impactMedium: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  impactLow: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
  },
  // Sidnumrering
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    fontSize: 10,
    color: '#94a3b8',
  },
  // Footer/Disclaimer
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    paddingTop: 15,
    borderTop: '1 solid #e2e8f0',
  },
  disclaimer: {
    fontSize: 9,
    color: '#94a3b8',
    lineHeight: 1.4,
  },
  // Marknadsanalys box
  analysisBox: {
    backgroundColor: '#f8fafc',
    padding: 18,
    borderRadius: 8,
    marginBottom: 15,
  },
  analysisText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.6,
  },
  // SWOT specifika stilar
  swotContainer: {
    marginBottom: 20,
  },
  swotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  swotBox: {
    width: '48%',
    marginBottom: 15,
    marginRight: '2%',
  },
  swotTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
    color: '#1e293b',
    paddingBottom: 4,
    borderBottom: '2 solid #e2e8f0',
  },
})

interface ValuationPDFProps {
  companyName: string
  result: any
  generatedAt: string
  companyInfo?: {
    orgNumber?: string
    website?: string
    email?: string
    phone?: string
    address?: string
    industry?: string
    employees?: string
  }
  hasExactFinancials?: boolean
}

export default function ValuationPDF({ companyName, result, generatedAt, companyInfo, hasExactFinancials = false }: ValuationPDFProps) {
  // Funktion för att få rätt stil för impact badge
  const getImpactStyle = (impact: string) => {
    switch(impact) {
      case 'high': return { ...styles.impactBadge, ...styles.impactHigh }
      case 'medium': return { ...styles.impactBadge, ...styles.impactMedium }
      case 'low': return { ...styles.impactBadge, ...styles.impactLow }
      default: return styles.impactBadge
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>BOLAXO</Text>
            <Text style={styles.tagline}>AI-driven företagsvärdering</Text>
          </View>
          <Text style={styles.title}>Värderingsrapport</Text>
          <Text style={styles.subtitle}>{companyName}</Text>
          <Text style={styles.date}>Genererad: {generatedAt}</Text>
        </View>

        {/* Huvudvärdering */}
        <View style={styles.valuationBox}>
          <Text style={styles.valuationLabel}>
            Uppskattat företagsvärde
          </Text>
          <Text style={styles.valuationAmount}>
            {(result.valuationRange.mostLikely / 1000000).toFixed(1)} MSEK
          </Text>
          <Text style={styles.valuationRange}>
            Värderingsintervall: {(result.valuationRange.min / 1000000).toFixed(1)} - {(result.valuationRange.max / 1000000).toFixed(1)} MSEK
          </Text>
        </View>

        {/* Data quality indicator */}
        <View style={{
          backgroundColor: hasExactFinancials ? '#f0fdf4' : '#fef3c7',
          padding: 12,
          borderRadius: 6,
          marginBottom: 20,
          borderLeft: hasExactFinancials ? '3 solid #10b981' : '3 solid #f59e0b'
        }}>
          <Text style={{
            fontSize: 10,
            color: hasExactFinancials ? '#166534' : '#92400e',
            fontWeight: 600,
            marginBottom: 3
          }}>
            {hasExactFinancials ? '✓ Baserat på exakta finansiella siffror' : '⚠ Baserat på uppskattningar'}
          </Text>
          <Text style={{
            fontSize: 9,
            color: hasExactFinancials ? '#15803d' : '#b45309',
            lineHeight: 1.4
          }}>
            {hasExactFinancials 
              ? 'Värderingen baseras på faktisk omsättning och rörelsekostnader, vilket ger högre precision.'
              : 'Värderingen baseras på intervalluppskattningar. För mer exakt värdering, ange exakta finansiella siffror.'
            }
          </Text>
        </View>

        {/* Värderingsmetod */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Värderingsmetod</Text>
          <View style={styles.analysisBox}>
            <Text style={styles.analysisText}>{result.method}</Text>
          </View>
        </View>

        {/* Metodologi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beräkningsunderlag</Text>
          
          {result.methodology.multipel && (
            <View style={styles.methodBox}>
              <Text style={styles.methodTitle}>Multipelvärdering</Text>
              <Text style={styles.methodText}>{result.methodology.multipel}</Text>
            </View>
          )}
          
          {result.methodology.avkastningskrav && (
            <View style={styles.methodBox}>
              <Text style={styles.methodTitle}>Avkastningsvärdering</Text>
              <Text style={styles.methodText}>{result.methodology.avkastningskrav}</Text>
            </View>
          )}
          
          {result.methodology.substans && (
            <View style={styles.methodBox}>
              <Text style={styles.methodTitle}>Substansvärde / Kontroll</Text>
              <Text style={styles.methodText}>{result.methodology.substans}</Text>
            </View>
          )}
        </View>

        {/* Nyckeltal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nyckeltal</Text>
          <View style={styles.metricsGrid}>
            {result.keyMetrics?.map((metric: any, i: number) => (
              <View key={i} style={styles.metricBox}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Företagsinformation om tillgänglig */}
        {companyInfo && Object.keys(companyInfo).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Företagsinformation</Text>
            <View style={styles.metricsGrid}>
              {companyInfo.orgNumber && (
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Organisationsnummer</Text>
                  <Text style={styles.metricValue}>{companyInfo.orgNumber}</Text>
                </View>
              )}
              {companyInfo.industry && (
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Bransch</Text>
                  <Text style={styles.metricValue}>{companyInfo.industry}</Text>
                </View>
              )}
              {companyInfo.employees && (
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Antal anställda</Text>
                  <Text style={styles.metricValue}>{companyInfo.employees}</Text>
                </View>
              )}
              {companyInfo.website && (
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Webbplats</Text>
                  <Text style={styles.metricValue}>{companyInfo.website.replace(/^https?:\/\//, '')}</Text>
                </View>
              )}
            </View>
            {(companyInfo.email || companyInfo.phone || companyInfo.address) && (
              <View style={{ marginTop: 10 }}>
                {companyInfo.address && (
                  <Text style={{ ...styles.methodText, marginBottom: 3 }}>Adress: {companyInfo.address}</Text>
                )}
                {companyInfo.email && (
                  <Text style={{ ...styles.methodText, marginBottom: 3 }}>E-post: {companyInfo.email}</Text>
                )}
                {companyInfo.phone && (
                  <Text style={styles.methodText}>Telefon: {companyInfo.phone}</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Sidnummer */}
        <Text style={styles.pageNumber}>Sida 1 av 3</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            Detta är en indikativ värdering baserad på AI-analys och tillgänglig publik information. 
            För bindande värdering, kontakta auktoriserad värderare.
          </Text>
        </View>
      </Page>

      {/* Sida 2: SWOT-analys */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>BOLAXO</Text>
          </View>
          <Text style={styles.title}>Företagsanalys</Text>
          <Text style={styles.subtitle}>{companyName}</Text>
        </View>

        <View style={styles.swotContainer}>
          <View style={styles.swotGrid}>
            {/* Styrkor */}
            <View style={styles.swotBox}>
              <Text style={{ ...styles.swotTitle, color: '#10b981' }}>Styrkor</Text>
              {result.analysis.strengths.slice(0, 4).map((item: string, i: number) => (
                <View key={i} style={styles.listItem}>
                  <Text style={{ ...styles.bullet, color: '#10b981' }}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Svagheter */}
            <View style={styles.swotBox}>
              <Text style={{ ...styles.swotTitle, color: '#ef4444' }}>Svagheter</Text>
              {result.analysis.weaknesses.slice(0, 4).map((item: string, i: number) => (
                <View key={i} style={styles.listItem}>
                  <Text style={{ ...styles.bullet, color: '#ef4444' }}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Möjligheter */}
            <View style={styles.swotBox}>
              <Text style={{ ...styles.swotTitle, color: '#3b82f6' }}>Möjligheter</Text>
              {result.analysis.opportunities.slice(0, 4).map((item: string, i: number) => (
                <View key={i} style={styles.listItem}>
                  <Text style={{ ...styles.bullet, color: '#3b82f6' }}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Risker */}
            <View style={styles.swotBox}>
              <Text style={{ ...styles.swotTitle, color: '#f59e0b' }}>Risker</Text>
              {result.analysis.risks.slice(0, 4).map((item: string, i: number) => (
                <View key={i} style={styles.listItem}>
                  <Text style={{ ...styles.bullet, color: '#f59e0b' }}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Marknadsanalys */}
        {result.marketComparison && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Marknadsposition</Text>
            <View style={styles.analysisBox}>
              <Text style={styles.analysisText}>{result.marketComparison}</Text>
            </View>
          </View>
        )}

        {/* Sidnummer */}
        <Text style={styles.pageNumber}>Sida 2 av 3</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            BOLAXO © 2025 | info@bolaxo.se | www.bolaxo.se
          </Text>
        </View>
      </Page>

      {/* Sida 3: Rekommendationer och nästa steg */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>BOLAXO</Text>
          </View>
          <Text style={styles.title}>Rekommendationer för värdeökning</Text>
          <Text style={styles.subtitle}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prioriterade åtgärder</Text>
          {result.recommendations?.map((rec: any, i: number) => (
            <View key={i} style={styles.recommendation}>
              <View style={styles.recHeader}>
                <Text style={styles.recTitle}>{i + 1}. {rec.title}</Text>
                <Text style={getImpactStyle(rec.impact)}>
                  {rec.impact === 'high' ? 'HÖG PRIORITET' : rec.impact === 'medium' ? 'MEDEL' : 'LÅG'}
                </Text>
              </View>
              <Text style={styles.recDescription}>{rec.description}</Text>
            </View>
          ))}
        </View>

        {/* Nästa steg */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nästa steg</Text>
          <View style={styles.methodBox}>
            <Text style={styles.methodTitle}>1. Förbered för försäljning</Text>
            <Text style={styles.methodText}>
              Implementera rekommendationerna ovan för att maximera företagets värde innan försäljning.
            </Text>
          </View>
          <View style={styles.methodBox}>
            <Text style={styles.methodTitle}>2. Professionell rådgivning</Text>
            <Text style={styles.methodText}>
              Överväg att anlita en M&A-rådgivare för att optimera försäljningsprocessen och säkerställa bästa möjliga utfall.
            </Text>
          </View>
          <View style={styles.methodBox}>
            <Text style={styles.methodTitle}>3. Publicera på BOLAXO</Text>
            <Text style={styles.methodText}>
              Lista ditt företag på BOLAXO för att nå kvalificerade köpare och få en transparent försäljningsprocess.
            </Text>
          </View>
        </View>

        {/* Sidnummer */}
        <Text style={styles.pageNumber}>Sida 3 av 3</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            Denna rapport är konfidentiell och avsedd endast för mottagaren. Spridning utan tillstånd är förbjuden.
          </Text>
        </View>
      </Page>
    </Document>
  )
}