'use client'

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Skapa stilar för PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #1e40af',
    paddingBottom: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 5,
  },
  valuationBox: {
    backgroundColor: '#eff6ff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    border: '2 solid #1e40af',
  },
  valuationAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  valuationRange: {
    fontSize: 12,
    color: '#4b5563',
  },
  methodBox: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 5,
    marginBottom: 12,
  },
  methodTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#374151',
  },
  methodText: {
    fontSize: 10,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  metricValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    width: 15,
    fontSize: 10,
  },
  listText: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
  },
  recommendation: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 5,
  },
  recTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#166534',
  },
  recDescription: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 4,
  },
  impactBadge: {
    fontSize: 8,
    color: '#ffffff',
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  }
})

interface ValuationPDFProps {
  companyName: string
  result: any
  generatedAt: string
}

export default function ValuationPDF({ companyName, result, generatedAt }: ValuationPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>BOLAXO</Text>
          <Text style={styles.title}>Företagsvärdering</Text>
          <Text style={styles.subtitle}>{companyName}</Text>
          <Text style={styles.subtitle}>Genererad: {generatedAt}</Text>
        </View>

        {/* Värdering */}
        <View style={styles.valuationBox}>
          <Text style={{ fontSize: 12, marginBottom: 5, color: '#1e40af' }}>
            Uppskattat företagsvärde
          </Text>
          <Text style={styles.valuationAmount}>
            {(result.valuationRange.mostLikely / 1000000).toFixed(1)} MSEK
          </Text>
          <Text style={styles.valuationRange}>
            Intervall: {(result.valuationRange.min / 1000000).toFixed(1)} - {(result.valuationRange.max / 1000000).toFixed(1)} MSEK
          </Text>
        </View>

        {/* Metod */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Värderingsmetod</Text>
          <Text style={styles.methodText}>{result.method}</Text>
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
          {result.keyMetrics?.map((metric: any, i: number) => (
            <View key={i} style={styles.metric}>
              <Text style={styles.metricLabel}>{metric.label}:</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </View>
          ))}
        </View>

        {/* SWOT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analys av företaget</Text>
          
          <Text style={{ ...styles.methodTitle, marginTop: 10, marginBottom: 5 }}>Styrkor</Text>
          {result.analysis.strengths.slice(0, 4).map((item: string, i: number) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
          
          <Text style={{ ...styles.methodTitle, marginTop: 10, marginBottom: 5 }}>Svagheter</Text>
          {result.analysis.weaknesses.slice(0, 4).map((item: string, i: number) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Detta är en indikativ värdering baserad på AI-analys. För exakt värdering, kontakta professionell värderare.{'\n'}
          BOLAXO © 2025 | info@bolaxo.se | www.bolaxo.se
        </Text>
      </Page>

      {/* Sida 2: Rekommendationer */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>BOLAXO</Text>
          <Text style={styles.title}>Rekommendationer för värdeökning</Text>
          <Text style={styles.subtitle}>{companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Konkreta åtgärder</Text>
          {result.recommendations?.map((rec: any, i: number) => (
            <View key={i} style={styles.recommendation}>
              <Text style={styles.recTitle}>{i + 1}. {rec.title}</Text>
              <Text style={styles.recDescription}>{rec.description}</Text>
              <Text style={styles.impactBadge}>
                {rec.impact === 'high' ? 'HÖG PÅVERKAN' : rec.impact === 'medium' ? 'MEDEL PÅVERKAN' : 'LÅG PÅVERKAN'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Möjligheter</Text>
          {result.analysis.opportunities.slice(0, 5).map((item: string, i: number) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risker att hantera</Text>
          {result.analysis.risks.slice(0, 5).map((item: string, i: number) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Marknadsanalys */}
        {result.marketComparison && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jämförelse med marknaden</Text>
            <Text style={styles.methodText}>{result.marketComparison}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Detta är en indikativ värdering baserad på AI-analys. För exakt värdering, kontakta professionell värderare.{'\n'}
          BOLAXO © 2025 | info@bolaxo.se | www.bolaxo.se
        </Text>
      </Page>
    </Document>
  )
}

