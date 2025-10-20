/**
 * County Assessor/Recorder Office Data Adapter
 * Integrates with county assessor offices for public records data
 */

import {
  DataSourceAdapter,
  StandardMarketData,
  DataSourceMetadata,
  DataSourceConfig,
  FetchOptions,
  DataSource,
  DataSourceError,
} from './types';
import { MockProviders } from './mockProviders';

// County Assessor specific data types
export interface CountyAssessorData {
  // Property Identification
  apn: string; // Assessor's Parcel Number
  parcelId: string;
  legalDescription: string;
  
  // Ownership Information
  currentOwner: string;
  mailingAddress: string;
  ownershipType: string; // Individual, Corporation, Trust, etc.
  
  // Property Details
  landUse: string;
  zoning: string;
  lotSize: number; // in square feet
  yearBuilt: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  
  // Assessment Data
  assessedValue: number;
  landValue: number;
  improvementValue: number;
  assessmentYear: number;
  
  // Tax Information
  annualTaxAmount: number;
  taxDelinquent: boolean;
  taxLienAmount: number;
  taxExemptions: string[];
  
  // Sales History
  salesHistory: Array<{
    saleDate: string;
    salePrice: number;
    saleType: string; // Arm's Length, Non-Arm's Length
    buyer: string;
    seller: string;
  }>;
  
  // Permits and Violations
  permits: Array<{
    permitNumber: string;
    type: string;
    issueDate: string;
    status: string;
    description: string;
  }>;
  
  violations: Array<{
    violationType: string;
    date: string;
    status: string;
    fine: number;
    description: string;
  }>;
}

// County API configuration
interface CountyApiConfig {
  name: string;
  baseUrl: string;
  endpoints: {
    property: string;
    assessment: string;
    sales: string;
  };
  requiresAuth: boolean;
  rateLimit: number;
}

export class CountyAssessorAdapter implements DataSourceAdapter {
  private config: DataSourceConfig;
  private metadata: DataSourceMetadata;
  private countyApis: Map<string, CountyApiConfig>;

  constructor(config?: Partial<DataSourceConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      apiKey: config?.apiKey || process.env.REACT_APP_COUNTY_API_KEY,
      baseURL: config?.baseURL || '',
      timeout: config?.timeout ?? 20000,
      retryAttempts: config?.retryAttempts ?? 3,
      cacheTTL: config?.cacheTTL ?? 24 * 60 * 60 * 1000, // 24 hours
      priority: config?.priority ?? 2,
    };

    this.metadata = {
      name: 'County Assessor Offices',
      source: DataSource.COUNTY_ASSESSOR,
      isAvailable: this.config.enabled,
      apiVersion: 'v1',
    };

    // Initialize county-specific API configurations
    this.countyApis = new Map([
      ['los_angeles', {
        name: 'Los Angeles County',
        baseUrl: 'https://assessor.lacounty.gov/api',
        endpoints: {
          property: '/property/{apn}',
          assessment: '/assessment/{apn}',
          sales: '/sales/{apn}',
        },
        requiresAuth: false,
        rateLimit: 100, // requests per minute
      }],
      ['cook', {
        name: 'Cook County (Chicago)',
        baseUrl: 'https://www.cookcountyassessor.com/api',
        endpoints: {
          property: '/property/{pin}',
          assessment: '/assessment/{pin}',
          sales: '/sales/{pin}',
        },
        requiresAuth: false,
        rateLimit: 60,
      }],
      ['maricopa', {
        name: 'Maricopa County (Phoenix)',
        baseUrl: 'https://mcassessor.maricopa.gov/api',
        endpoints: {
          property: '/property/{apn}',
          assessment: '/assessment/{apn}',
          sales: '/sales/{apn}',
        },
        requiresAuth: false,
        rateLimit: 80,
      }],
      ['harris', {
        name: 'Harris County (Houston)',
        baseUrl: 'https://hcad.org/api',
        endpoints: {
          property: '/property/{acct}',
          assessment: '/assessment/{acct}',
          sales: '/sales/{acct}',
        },
        requiresAuth: false,
        rateLimit: 60,
      }],
    ]);
  }

  /**
   * Fetch data from county assessor
   */
  async fetchData(
    zipCode: string,
    options?: FetchOptions,
  ): Promise<StandardMarketData> {
    if (!this.config.enabled) {
      throw new DataSourceError(
        'County Assessor adapter is disabled',
        DataSource.COUNTY_ASSESSOR,
        undefined,
        false,
      );
    }

    try {
      // For now, return mock data since most counties don't have public APIs
      // In production, implement county-specific API calls
      return await this.fetchMockData(zipCode);
    } catch (error) {
      if (error instanceof DataSourceError) {
        throw error;
      }
      throw new DataSourceError(
        `Failed to fetch County Assessor data: ${error}`,
        DataSource.COUNTY_ASSESSOR,
        undefined,
        true,
      );
    }
  }

  /**
   * Fetch property data from specific county
   */
  async fetchPropertyData(
    apn: string,
    county: string,
    options?: FetchOptions,
  ): Promise<CountyAssessorData> {
    const countyConfig = this.countyApis.get(county);
    if (!countyConfig) {
      throw new DataSourceError(
        `County ${county} not supported`,
        DataSource.COUNTY_ASSESSOR,
        undefined,
        false,
      );
    }

    try {
      // Implement county-specific API calls
      const [propertyData, assessmentData, salesData] = await Promise.all([
        this.fetchPropertyInfo(apn, countyConfig),
        this.fetchAssessmentInfo(apn, countyConfig),
        this.fetchSalesHistory(apn, countyConfig),
      ]);

      return this.combineCountyData(propertyData, assessmentData, salesData);
    } catch (error) {
      throw new DataSourceError(
        `Failed to fetch property data for APN ${apn}: ${error}`,
        DataSource.COUNTY_ASSESSOR,
        undefined,
        true,
      );
    }
  }

  /**
   * Fetch property information
   */
  private async fetchPropertyInfo(apn: string, config: CountyApiConfig): Promise<any> {
    const url = `${config.baseUrl}${config.endpoints.property.replace('{apn}', apn)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Dreamery-Property-Platform/1.0',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Property API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Property API request timed out');
      }
      throw error;
    }
  }

  /**
   * Fetch assessment information
   */
  private async fetchAssessmentInfo(apn: string, config: CountyApiConfig): Promise<any> {
    const url = `${config.baseUrl}${config.endpoints.assessment.replace('{apn}', apn)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Dreamery-Property-Platform/1.0',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Assessment API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Assessment API request timed out');
      }
      throw error;
    }
  }

  /**
   * Fetch sales history
   */
  private async fetchSalesHistory(apn: string, config: CountyApiConfig): Promise<any> {
    const url = `${config.baseUrl}${config.endpoints.sales.replace('{apn}', apn)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Dreamery-Property-Platform/1.0',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Sales API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Sales API request timed out');
      }
      throw error;
    }
  }

  /**
   * Combine data from multiple county endpoints
   */
  private combineCountyData(property: any, assessment: any, sales: any): CountyAssessorData {
    return {
      apn: property.apn || '',
      parcelId: property.parcelId || '',
      legalDescription: property.legalDescription || '',
      
      currentOwner: property.currentOwner || '',
      mailingAddress: property.mailingAddress || '',
      ownershipType: property.ownershipType || '',
      
      landUse: property.landUse || '',
      zoning: property.zoning || '',
      lotSize: property.lotSize || 0,
      yearBuilt: property.yearBuilt || 0,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      squareFeet: property.squareFeet || 0,
      
      assessedValue: assessment.assessedValue || 0,
      landValue: assessment.landValue || 0,
      improvementValue: assessment.improvementValue || 0,
      assessmentYear: assessment.assessmentYear || new Date().getFullYear(),
      
      annualTaxAmount: assessment.annualTaxAmount || 0,
      taxDelinquent: assessment.taxDelinquent || false,
      taxLienAmount: assessment.taxLienAmount || 0,
      taxExemptions: assessment.taxExemptions || [],
      
      salesHistory: sales.history || [],
      permits: property.permits || [],
      violations: property.violations || [],
    };
  }

  /**
   * Fetch mock data
   */
  private async fetchMockData(zipCode: string): Promise<StandardMarketData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mockData = MockProviders.countyAssessor(zipCode);
    return MockProviders.countyAssessorToStandard(mockData, zipCode);
  }

  /**
   * Convert county data to standard format
   */
  private countyToStandard(county: CountyAssessorData, zipCode: string): StandardMarketData {
    // Use county data to enhance standard market data
    return {
      zipCode,
      city: 'Unknown',
      state: 'Unknown',
      
      medianRent: 0, // Not available from county data
      medianPrice: county.assessedValue,
      rentGrowth12mo: 0, // Not available
      appreciationRate12mo: this.calculateAppreciationRate(county.salesHistory),
      
      vacancyRate: 0, // Not available
      daysOnMarket: 0, // Not available
      foreclosureRate: county.taxDelinquent ? 1 : 0,
      
      economicDiversityIndex: 0, // Not available
      crimeSafetyScore: 0, // Not available
      schoolRating: 0, // Not available
      
      dateUpdated: new Date(),
      dataSource: DataSource.COUNTY_ASSESSOR,
      confidence: 90, // County data is reliable
    };
  }

  /**
   * Calculate appreciation rate from sales history
   */
  private calculateAppreciationRate(salesHistory: any[]): number {
    if (salesHistory.length < 2) return 0;
    
    const sortedSales = salesHistory
      .sort((a, b) => new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime());
    
    const oldestSale = sortedSales[0];
    const newestSale = sortedSales[sortedSales.length - 1];
    
    const yearsDiff = (new Date(newestSale.saleDate).getTime() - 
                      new Date(oldestSale.saleDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    if (yearsDiff === 0) return 0;
    
    const appreciationRate = ((newestSale.salePrice - oldestSale.salePrice) / 
                             oldestSale.salePrice) / yearsDiff * 100;
    
    return appreciationRate;
  }

  /**
   * Check if adapter is available
   */
  async isAvailable(): Promise<boolean> {
    return this.config.enabled && await this.testConnection();
  }

  /**
   * Get metadata
   */
  getMetadata(): DataSourceMetadata {
    return { ...this.metadata };
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test with a known county API
      const testConfig = this.countyApis.get('los_angeles');
      if (!testConfig) return false;
      
      // Simple connectivity test
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch(`${testConfig.baseUrl}/health`, {
          signal: controller.signal,
          method: 'HEAD',
        });
        clearTimeout(timeoutId);
        return response.ok;
      } catch (error) {
        clearTimeout(timeoutId);
        return false; // Fallback to mock mode
      }
    } catch (error) {
      console.warn('County Assessor API connection test failed:', error);
      return false; // Fallback to mock mode
    }
  }

  /**
   * Get configuration
   */
  getConfig(): DataSourceConfig {
    return { ...this.config };
  }

  /**
   * Get supported counties
   */
  getSupportedCounties(): string[] {
    return Array.from(this.countyApis.keys());
  }

  /**
   * Get county configuration
   */
  getCountyConfig(county: string): CountyApiConfig | undefined {
    return this.countyApis.get(county);
  }
}

export default CountyAssessorAdapter;
