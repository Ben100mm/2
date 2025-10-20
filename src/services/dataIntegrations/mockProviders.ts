/**
 * Mock Data Providers
 * 
 * Provides mock data for development and testing when real APIs are unavailable
 */

import { StandardMarketData, DataSource } from './types';

// Mock data interfaces
interface MockZillowData {
  medianHomeValue: number;
  medianRent: number;
  pricePerSqft: number;
  homeValueIndex: number;
  rentIndex: number;
  priceToRentRatio: number;
  inventory: number;
  daysOnMarket: number;
  foreclosureRate: number;
  appreciationRate: number;
}

interface MockRealtorData {
  medianListingPrice: number;
  medianSoldPrice: number;
  averageDaysOnMarket: number;
  inventoryCount: number;
  newListingsCount: number;
  priceReductionsCount: number;
  medianPricePerSqft: number;
  activeListingCount: number;
  pendingListingCount: number;
  soldListingCount: number;
}

interface MockCensusData {
  population: number;
  medianHouseholdIncome: number;
  unemploymentRate: number;
  povertyRate: number;
  medianAge: number;
  educationLevel: string;
  housingUnits: number;
  ownerOccupiedRate: number;
  renterOccupiedRate: number;
}

interface MockMLSData {
  totalListings: number;
  averagePrice: number;
  averageDaysOnMarket: number;
  pricePerSqft: number;
  inventoryMonths: number;
  salesVolume: number;
  newListings: number;
  pendingSales: number;
  closedSales: number;
}

interface MockCountyAssessorData {
  assessedValue: number;
  marketValue: number;
  landValue: number;
  improvementValue: number;
  taxAmount: number;
  taxRate: number;
  lastSaleDate: string;
  lastSalePrice: number;
  propertyType: string;
  yearBuilt: number;
}

export class MockProviders {
  /**
   * Generate mock Zillow data for a zip code
   */
  static zillow(zipCode: string): MockZillowData {
    // Generate consistent mock data based on zip code
    const seed = this.hashCode(zipCode);
    const random = this.seededRandom(seed);
    
    return {
      medianHomeValue: Math.round(400000 + random() * 600000),
      medianRent: Math.round(2000 + random() * 3000),
      pricePerSqft: Math.round(200 + random() * 400),
      homeValueIndex: Math.round(100 + random() * 50),
      rentIndex: Math.round(100 + random() * 30),
      priceToRentRatio: Math.round(15 + random() * 10),
      inventory: Math.round(50 + random() * 100),
      daysOnMarket: Math.round(20 + random() * 40),
      foreclosureRate: random() * 0.05,
      appreciationRate: -0.02 + random() * 0.08,
    };
  }

  /**
   * Convert mock Zillow data to standard format
   */
  static zillowToStandard(mockData: MockZillowData, zipCode: string): StandardMarketData {
    return {
      zipCode,
      source: DataSource.ZILLOW,
      timestamp: new Date(),
      medianHomeValue: mockData.medianHomeValue,
      medianRent: mockData.medianRent,
      pricePerSqft: mockData.pricePerSqft,
      inventory: mockData.inventory,
      daysOnMarket: mockData.daysOnMarket,
      appreciationRate: mockData.appreciationRate,
      foreclosureRate: mockData.foreclosureRate,
      dataQuality: 'mock',
      confidence: 0.5,
    };
  }

  /**
   * Generate mock Realtor data for a zip code
   */
  static realtor(zipCode: string): MockRealtorData {
    const seed = this.hashCode(zipCode);
    const random = this.seededRandom(seed);
    
    return {
      medianListingPrice: Math.round(350000 + random() * 500000),
      medianSoldPrice: Math.round(340000 + random() * 480000),
      averageDaysOnMarket: Math.round(25 + random() * 35),
      inventoryCount: Math.round(40 + random() * 80),
      newListingsCount: Math.round(10 + random() * 20),
      priceReductionsCount: Math.round(5 + random() * 15),
      medianPricePerSqft: Math.round(180 + random() * 350),
      activeListingCount: Math.round(35 + random() * 65),
      pendingListingCount: Math.round(8 + random() * 12),
      soldListingCount: Math.round(15 + random() * 25),
    };
  }

  /**
   * Convert mock Realtor data to standard format
   */
  static realtorToStandard(mockData: MockRealtorData, zipCode: string): StandardMarketData {
    return {
      zipCode,
      source: DataSource.REALTOR,
      timestamp: new Date(),
      medianHomeValue: mockData.medianSoldPrice,
      medianRent: Math.round(mockData.medianSoldPrice * 0.005), // Rough estimate
      pricePerSqft: mockData.medianPricePerSqft,
      inventory: mockData.inventoryCount,
      daysOnMarket: mockData.averageDaysOnMarket,
      appreciationRate: 0.02 + Math.random() * 0.06,
      foreclosureRate: Math.random() * 0.03,
      dataQuality: 'mock',
      confidence: 0.5,
    };
  }

  /**
   * Generate mock Census data for a zip code
   */
  static census(zipCode: string): MockCensusData {
    const seed = this.hashCode(zipCode);
    const random = this.seededRandom(seed);
    
    return {
      population: Math.round(10000 + random() * 50000),
      medianHouseholdIncome: Math.round(50000 + random() * 100000),
      unemploymentRate: random() * 0.1,
      povertyRate: random() * 0.2,
      medianAge: Math.round(30 + random() * 20),
      educationLevel: ['High School', 'Bachelor', 'Graduate'][Math.floor(random() * 3)],
      housingUnits: Math.round(5000 + random() * 20000),
      ownerOccupiedRate: 0.5 + random() * 0.4,
      renterOccupiedRate: 0.2 + random() * 0.3,
    };
  }

  /**
   * Generate mock MLS data for a zip code
   */
  static mls(zipCode: string): MockMLSData {
    const seed = this.hashCode(zipCode);
    const random = this.seededRandom(seed);
    
    return {
      totalListings: Math.round(30 + random() * 70),
      averagePrice: Math.round(300000 + random() * 400000),
      averageDaysOnMarket: Math.round(20 + random() * 40),
      pricePerSqft: Math.round(150 + random() * 300),
      inventoryMonths: random() * 6,
      salesVolume: Math.round(20 + random() * 50),
      newListings: Math.round(8 + random() * 15),
      pendingSales: Math.round(5 + random() * 10),
      closedSales: Math.round(10 + random() * 20),
    };
  }

  /**
   * Generate mock County Assessor data for a zip code
   */
  static countyAssessor(zipCode: string): MockCountyAssessorData {
    const seed = this.hashCode(zipCode);
    const random = this.seededRandom(seed);
    
    return {
      assessedValue: Math.round(250000 + random() * 350000),
      marketValue: Math.round(300000 + random() * 400000),
      landValue: Math.round(80000 + random() * 120000),
      improvementValue: Math.round(200000 + random() * 300000),
      taxAmount: Math.round(3000 + random() * 5000),
      taxRate: 0.01 + random() * 0.02,
      lastSaleDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastSalePrice: Math.round(280000 + random() * 380000),
      propertyType: ['Single Family', 'Condo', 'Townhouse'][Math.floor(random() * 3)],
      yearBuilt: Math.round(1950 + random() * 70),
    };
  }

  /**
   * Simple hash function for consistent seeding
   */
  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Seeded random number generator for consistent mock data
   */
  private static seededRandom(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }
}
