import * as XLSX from 'xlsx';

export interface ParsedFinancialData {
  years: FinancialYear[];
  addBacksSuggestions: AddBackSuggestion[];
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  qualityScore: number;
  detectedColumns: string[];
  errors: string[];
  warnings: string[];
}

export interface FinancialYear {
  year: number;
  revenue: number;
  costs: number;
  ebitda: number;
  ebit: number;
  netIncome: number;
  assets?: number;
  liabilities?: number;
  equity?: number;
  cash?: number;
}

export interface AddBackSuggestion {
  id: string;
  category: 'owner_salary' | 'one_time_cost' | 'non_recurring_revenue' | 'stock_compensation' | 'related_party';
  description: string;
  estimatedAmount: number;
  confidence: 'high' | 'medium' | 'low';
  recommendation: string;
}

const ADDBACK_CATEGORIES = {
  owner_salary: {
    keywords: ['ägarlön', 'owner salary', 'director salary', 'vd', 'ceo'],
    description: 'Owner/management salary that may differ from market',
  },
  one_time_cost: {
    keywords: ['one-time', 'exceptional', 'extraordinary', 'engångskostnad', 'engångs', 'extraordinary costs'],
    description: 'Non-recurring expenses',
  },
  non_recurring_revenue: {
    keywords: ['one-time revenue', 'exceptional revenue', 'engångsintäkt', 'engångs'],
    description: 'Non-recurring revenue',
  },
  stock_compensation: {
    keywords: ['stock', 'warrant', 'option', 'aktie', 'warrant', 'optioner'],
    description: 'Stock-based compensation',
  },
  related_party: {
    keywords: ['related party', 'related-party', 'närstående', 'related'],
    description: 'Related party transactions',
  },
};

export async function parseExcelFile(buffer: Buffer, fileName: string): Promise<ParsedFinancialData> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Read workbook
    const workbook = XLSX.read(buffer, { cellFormula: true, cellStyles: true });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('No sheets found in Excel file');
    }

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (jsonData.length === 0) {
      throw new Error('No data found in sheet');
    }

    // Detect financial data
    const detectedColumns = Object.keys(jsonData[0] || {});
    const years = extractFinancialYears(jsonData, detectedColumns, errors, warnings);

    if (years.length === 0) {
      warnings.push('Could not automatically detect financial years. Please verify the data.');
    }

    // Suggest add-backs
    const addBacksSuggestions = suggestAddBacks(years, jsonData);

    // Calculate quality score
    const qualityScore = calculateQualityScore(years, errors);
    const dataQuality = getQualityRating(qualityScore);

    return {
      years,
      addBacksSuggestions,
      dataQuality,
      qualityScore,
      detectedColumns,
      errors,
      warnings,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`Failed to parse Excel file: ${errorMsg}`);

    return {
      years: [],
      addBacksSuggestions: [],
      dataQuality: 'poor',
      qualityScore: 0,
      detectedColumns: [],
      errors,
      warnings,
    };
  }
}

function extractFinancialYears(
  data: any[],
  columns: string[],
  errors: string[],
  warnings: string[]
): FinancialYear[] {
  const years: FinancialYear[] = [];

  // Swedish keywords for financial rows
  const revenueKeywords = ['omsättning', 'revenue', 'sales', 'försäljning', 'intäkt'];
  const costsKeywords = ['kostnader', 'costs', 'expenses', 'utgifter'];
  const ebitdaKeywords = ['ebitda', 'operating profit', 'driftresultat'];
  const ebitKeywords = ['ebit', 'ebita', 'operating income'];
  const netIncomeKeywords = ['result', 'net income', 'vinst', 'nettoresultat'];
  const assetsKeywords = ['aktiva', 'assets', 'total assets'];
  const liabilitiesKeywords = ['skulder', 'liabilities', 'total liabilities'];
  const equityKeywords = ['eget kapital', 'equity', 'shareholders equity'];
  const cashKeywords = ['kassa', 'cash', 'bank', 'kontanter'];

  // Try to find year columns
  const yearColumns = columns.filter((col) => {
    const val = col.toLowerCase().trim();
    return /^(\d{4}|år|year|20\d{2}|'?\d{2})$/.test(val);
  });

  if (yearColumns.length === 0) {
    warnings.push('Could not identify year columns');
    return [];
  }

  // Extract data for each year
  yearColumns.forEach((yearCol) => {
    let year = parseInt(yearCol.match(/\d{4}/)?.[0] || '2024', 10);

    const yearData: Partial<FinancialYear> = { year };

    // Find rows and extract values
    data.forEach((row) => {
      const rowLabel = Object.values(row)[0]?.toString().toLowerCase() || '';

      // Revenue
      if (
        revenueKeywords.some((kw) => rowLabel.includes(kw)) &&
        yearData.revenue === undefined
      ) {
        yearData.revenue = parseNumber(row[yearCol]);
      }

      // Costs
      if (costsKeywords.some((kw) => rowLabel.includes(kw)) && yearData.costs === undefined) {
        yearData.costs = parseNumber(row[yearCol]);
      }

      // EBITDA
      if (ebitdaKeywords.some((kw) => rowLabel.includes(kw)) && yearData.ebitda === undefined) {
        yearData.ebitda = parseNumber(row[yearCol]);
      } else if (yearData.revenue !== undefined && yearData.costs !== undefined && yearData.ebitda === undefined) {
        // Calculate EBITDA if not found
        yearData.ebitda = yearData.revenue - yearData.costs;
      }

      // EBIT
      if (ebitKeywords.some((kw) => rowLabel.includes(kw)) && yearData.ebit === undefined) {
        yearData.ebit = parseNumber(row[yearCol]);
      }

      // Net Income
      if (netIncomeKeywords.some((kw) => rowLabel.includes(kw)) && yearData.netIncome === undefined) {
        yearData.netIncome = parseNumber(row[yearCol]);
      }

      // Balance sheet items
      if (assetsKeywords.some((kw) => rowLabel.includes(kw)) && yearData.assets === undefined) {
        yearData.assets = parseNumber(row[yearCol]);
      }

      if (liabilitiesKeywords.some((kw) => rowLabel.includes(kw)) && yearData.liabilities === undefined) {
        yearData.liabilities = parseNumber(row[yearCol]);
      }

      if (equityKeywords.some((kw) => rowLabel.includes(kw)) && yearData.equity === undefined) {
        yearData.equity = parseNumber(row[yearCol]);
      }

      if (cashKeywords.some((kw) => rowLabel.includes(kw)) && yearData.cash === undefined) {
        yearData.cash = parseNumber(row[yearCol]);
      }
    });

    // Validate minimum required fields
    if (yearData.revenue !== undefined && yearData.revenue > 0) {
      years.push({
        year,
        revenue: yearData.revenue || 0,
        costs: yearData.costs || 0,
        ebitda: yearData.ebitda || 0,
        ebit: yearData.ebit || 0,
        netIncome: yearData.netIncome || 0,
        assets: yearData.assets,
        liabilities: yearData.liabilities,
        equity: yearData.equity,
        cash: yearData.cash,
      });
    }
  });

  // Sort by year ascending
  years.sort((a, b) => a.year - b.year);

  return years;
}

function suggestAddBacks(years: FinancialYear[], rawData: any[]): AddBackSuggestion[] {
  const suggestions: AddBackSuggestion[] = [];

  // Analyze for common add-back patterns
  if (years.length >= 2) {
    // Check for unusual owner salary
    const avgEbitda = years.reduce((sum, y) => sum + y.ebitda, 0) / years.length;
    const avgRevenue = years.reduce((sum, y) => sum + y.revenue, 0) / years.length;

    // Suggestion: Owner salary normalization
    if (avgRevenue > 0) {
      suggestions.push({
        id: 'owner_salary',
        category: 'owner_salary',
        description: 'Owner/CEO salary normalization',
        estimatedAmount: avgRevenue * 0.05, // Estimate 5% of revenue
        confidence: 'medium',
        recommendation: 'Verify against market rates for similar roles',
      });
    }

    // Check for revenue volatility (sign of one-time items)
    const revenueVariance =
      Math.max(...years.map((y) => y.revenue)) - Math.min(...years.map((y) => y.revenue));
    const revenueVariabilityPercent = (revenueVariance / avgRevenue) * 100;

    if (revenueVariabilityPercent > 20) {
      suggestions.push({
        id: 'one_time_revenue',
        category: 'non_recurring_revenue',
        description: 'Potential one-time revenue items detected',
        estimatedAmount: revenueVariance * 0.1,
        confidence: 'low',
        recommendation: 'Review revenue breakdown for non-recurring items',
      });
    }

    // Check for unusual cost structure
    const avgCosts = years.reduce((sum, y) => sum + y.costs, 0) / years.length;
    const costsVariance = Math.max(...years.map((y) => y.costs)) - Math.min(...years.map((y) => y.costs));

    if (costsVariance / avgCosts > 0.3) {
      suggestions.push({
        id: 'one_time_costs',
        category: 'one_time_cost',
        description: 'Potential one-time costs detected',
        estimatedAmount: costsVariance * 0.2,
        confidence: 'low',
        recommendation: 'Investigate unusual cost variations between years',
      });
    }

    // Stock compensation
    suggestions.push({
      id: 'stock_comp',
      category: 'stock_compensation',
      description: 'Potential stock/warrant expense',
      estimatedAmount: avgRevenue * 0.02,
      confidence: 'low',
      recommendation: 'Review for employee stock plans or warrants',
    });
  }

  return suggestions;
}

function calculateQualityScore(years: FinancialYear[], errors: string[]): number {
  let score = 100;

  // Deduct for errors
  score -= Math.min(errors.length * 20, 50);

  // Deduct for missing years
  if (years.length < 3) {
    score -= (3 - years.length) * 10;
  }

  // Deduct for missing data points
  const totalDataPoints = years.length * 6; // 6 key fields per year
  const filledPoints = years.reduce((sum, y) => {
    let count = 0;
    if (y.revenue > 0) count++;
    if (y.costs > 0) count++;
    if (y.ebitda > 0) count++;
    if (y.ebit > 0) count++;
    if (y.netIncome !== undefined) count++;
    if (y.assets !== undefined) count++;
    return sum + count;
  }, 0);

  const completeness = (filledPoints / totalDataPoints) * 100;
  if (completeness < 80) {
    score -= (80 - completeness) / 2;
  }

  return Math.max(0, Math.min(100, score));
}

function getQualityRating(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}

function parseNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove Swedish thousands separator
    const cleaned = value.replace(/\s/g, '').replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export function validateFinancialData(data: ParsedFinancialData): { isValid: boolean; errors: string[] } {
  const errors = [...data.errors];

  if (data.years.length === 0) {
    errors.push('No financial years extracted from file');
  }

  // Check for negative revenue
  if (data.years.some((y) => y.revenue < 0)) {
    errors.push('Negative revenue detected - please verify data');
  }

  // Check for revenue > 1B SEK (likely data quality issue)
  if (data.years.some((y) => y.revenue > 1000000000)) {
    errors.push('Unusually high revenue - verify decimal separator');
  }

  // Check for chronological order
  for (let i = 1; i < data.years.length; i++) {
    if (data.years[i].year <= data.years[i - 1].year) {
      errors.push('Years are not in chronological order');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
