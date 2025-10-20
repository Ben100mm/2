/**
 * Mock data providers for testing and development
 * Generates realistic data for all data sources
 */

import {
  StandardMarketData,
  ZillowResearchData,
  RealtorEconomicData,
  CensusData,
  MLSData,
  CountyAssessorData,
  DataSource,
} from './types';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate consistent pseudo-random number based on seed
 */
function seededRandom(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return min + random * (max - min);
}

/**
 * Extract numeric seed from zip code
 */
function zipToSeed(zipCode: string): number {
  return parseInt(zipCode.replace(/\D/g, '')) || 12345;
}

// ============================================================================
// Mock Zillow Data
// ============================================================================

export function generateMockZillowData(zipCode: string): ZillowResearchData {
  const seed = zipToSeed(zipCode);
  
  const baseRent = seededRandom(seed, 1500, 4500);
  const basePrice = seededRandom(seed + 1, 300000, 1200000);
  
  return {
    regionId: seed,
    regionName: `Region ${zipCode}`,
    regionType: 'zip',
    
    rentZRI: Math.round(baseRent),
    rentZRIYoY: seededRandom(seed + 2, -3, 12),
    
    zhvi: Math.round(basePrice),
    zhviYoY: seededRandom(seed + 3, -8, 18),
    
    inventoryRaw: Math.round(seededRandom(seed + 4, 50, 500)),
    daysOnMarket: Math.round(seededRandom(seed + 5, 20, 90)),
    
    priceToRentRatio: Math.round((basePrice / (baseRent * 12)) * 10) / 10,
    forecastedRentGrowth: seededRandom(seed + 6, 1, 8),
    forecastedPriceGrowth: seededRandom(seed + 7, 2, 10),
    
    date: new Date().toISOString().split('T')[0],
  };
}

/**
 * Convert Zillow data to standard format
 */
export function zillowToStandard(
  zillow: ZillowResearchData,
  zipCode: string,
): StandardMarketData {
  const seed = zipToSeed(zipCode);
  
  return {
    zipCode,
    city: 'Mock City',
    state: 'CA',
    
    medianRent: zillow.rentZRI,
    medianPrice: zillow.zhvi,
    rentGrowth12mo: zillow.rentZRIYoY,
    appreciationRate12mo: zillow.zhviYoY,
    
    vacancyRate: seededRandom(seed + 10, 3, 12),
    daysOnMarket: zillow.daysOnMarket,
    foreclosureRate: seededRandom(seed + 11, 0.5, 3),
    
    economicDiversityIndex: seededRandom(seed + 12, 50, 90),
    crimeSafetyScore: seededRandom(seed + 13, 55, 92),
    schoolRating: seededRandom(seed + 14, 5, 9.5),
    
    dateUpdated: new Date(),
    dataSource: DataSource.ZILLOW,
    confidence: 85,
  };
}

// ============================================================================
// Mock Realtor.com Data
// ============================================================================

export function generateMockRealtorData(zipCode: string): RealtorEconomicData {
  const seed = zipToSeed(zipCode);
  
  const medianPrice = seededRandom(seed + 100, 280000, 1150000);
  
  return {
    zip: zipCode,
    
    medianListPrice: Math.round(medianPrice),
    medianListPriceYoY: seededRandom(seed + 101, -6, 15),
    medianSalePrice: Math.round(medianPrice * 0.97), // Typically sells for less
    
    activeListingCount: Math.round(seededRandom(seed + 102, 30, 200)),
    newListingCount: Math.round(seededRandom(seed + 103, 10, 50)),
    pendingListingCount: Math.round(seededRandom(seed + 104, 15, 80)),
    
    daysOnMarket: Math.round(seededRandom(seed + 105, 18, 85)),
    monthsOfSupply: seededRandom(seed + 106, 1.5, 8),
    priceReducedCount: Math.round(seededRandom(seed + 107, 5, 40)),
    
    hotness_score: seededRandom(seed + 108, 30, 95),
    
    date: new Date().toISOString().split('T')[0],
  };
}

/**
 * Convert Realtor data to standard format
 */
export function realtorToStandard(
  realtor: RealtorEconomicData,
  zipCode: string,
): StandardMarketData {
  const seed = zipToSeed(zipCode);
  
  // Estimate rent from price (1% rule approximation)
  const estimatedRent = realtor.medianSalePrice * 0.01;
  
  return {
    zipCode,
    city: 'Mock City',
    state: 'CA',
    
    medianRent: Math.round(estimatedRent),
    medianPrice: realtor.medianSalePrice,
    rentGrowth12mo: seededRandom(seed + 110, -2, 10),
    appreciationRate12mo: realtor.medianListPriceYoY,
    
    vacancyRate: seededRandom(seed + 111, 4, 11),
    daysOnMarket: realtor.daysOnMarket,
    foreclosureRate: seededRandom(seed + 112, 0.6, 2.8),
    
    economicDiversityIndex: seededRandom(seed + 113, 48, 88),
    crimeSafetyScore: seededRandom(seed + 114, 58, 90),
    schoolRating: seededRandom(seed + 115, 5.5, 9),
    
    dateUpdated: new Date(),
    dataSource: DataSource.REALTOR,
    confidence: 80,
  };
}

// ============================================================================
// Mock Census Data
// ============================================================================

export function generateMockCensusData(zipCode: string): CensusData {
  const seed = zipToSeed(zipCode);
  
  const population = Math.round(seededRandom(seed + 200, 15000, 80000));
  const housingUnits = Math.round(population / 2.5); // ~2.5 people per unit
  const medianIncome = Math.round(seededRandom(seed + 201, 45000, 120000));
  
  return {
    geoid: zipCode,
    name: `ZIP Code ${zipCode}`,
    
    population,
    medianAge: seededRandom(seed + 202, 28, 48),
    medianIncome,
    
    totalHousingUnits: housingUnits,
    occupiedHousingUnits: Math.round(housingUnits * seededRandom(seed + 203, 0.88, 0.97)),
    vacancyRate: seededRandom(seed + 204, 3, 12),
    medianHomeValue: Math.round(seededRandom(seed + 205, 250000, 1000000)),
    medianGrossRent: Math.round(seededRandom(seed + 206, 1200, 4000)),
    
    unemploymentRate: seededRandom(seed + 207, 2.5, 8.5),
    povertyRate: seededRandom(seed + 208, 5, 18),
    
    bachelorsOrHigher: seededRandom(seed + 209, 20, 65),
    
    year: new Date().getFullYear() - 1, // Census data is typically 1 year behind
  };
}

/**
 * Convert Census data to standard format
 */
export function censusToStandard(
  census: CensusData,
  zipCode: string,
): StandardMarketData {
  const seed = zipToSeed(zipCode);
  
  // Calculate economic diversity from employment and education data
  const economicDiversity = Math.min(
    100,
    (100 - census.unemploymentRate * 8) * 0.5 +
    (census.bachelorsOrHigher) * 0.5,
  );
  
  // Estimate crime/safety from income and poverty
  const safetyScore = Math.min(
    100,
    Math.max(
      30,
      (census.medianIncome / 1500) * 0.6 +
      (100 - census.povertyRate * 4) * 0.4,
    ),
  );
  
  return {
    zipCode,
    city: census.name,
    state: 'Unknown',
    
    medianRent: census.medianGrossRent,
    medianPrice: census.medianHomeValue,
    rentGrowth12mo: seededRandom(seed + 210, -1, 9), // Census doesn't have growth
    appreciationRate12mo: seededRandom(seed + 211, -4, 12),
    
    vacancyRate: census.vacancyRate,
    daysOnMarket: seededRandom(seed + 212, 25, 80),
    foreclosureRate: seededRandom(seed + 213, 0.8, 3.2),
    
    economicDiversityIndex: economicDiversity,
    crimeSafetyScore: safetyScore,
    schoolRating: census.bachelorsOrHigher / 10, // Education level proxy
    
    dateUpdated: new Date(census.year, 6, 1), // Mid-year date
    dataSource: DataSource.CENSUS,
    confidence: 70, // Lower confidence due to data age
  };
}

// ============================================================================
// Mock MLS Data
// ============================================================================

export function generateMockMLSData(zipCode: string): MLSData {
  const seed = zipToSeed(zipCode);
  
  const avgSalePrice = seededRandom(seed + 300, 320000, 1180000);
  const avgListPrice = avgSalePrice * seededRandom(seed + 301, 1.02, 1.08);
  
  return {
    mlsNumber: `MLS${seed}`,
    mlsSource: 'Mock MLS Board',
    
    zipCode,
    subdivision: `Subdivision ${Math.floor(seed / 1000)}`,
    
    averageSalePrice: Math.round(avgSalePrice),
    medianSalePrice: Math.round(avgSalePrice * 0.98),
    averageListPrice: Math.round(avgListPrice),
    
    activeListings: Math.round(seededRandom(seed + 302, 35, 180)),
    soldListings: Math.round(seededRandom(seed + 303, 20, 90)),
    pendingListings: Math.round(seededRandom(seed + 304, 12, 70)),
    
    averageDaysOnMarket: Math.round(seededRandom(seed + 305, 22, 88)),
    saleToPriceRatio: seededRandom(seed + 306, 0.94, 1.01),
    
    monthOverMonthChange: seededRandom(seed + 307, -3, 5),
    yearOverYearChange: seededRandom(seed + 308, -7, 16),
    
    date: new Date().toISOString().split('T')[0],
  };
}

/**
 * Convert MLS data to standard format
 */
export function mlsToStandard(mls: MLSData, zipCode: string): StandardMarketData {
  const seed = zipToSeed(zipCode);
  
  // Estimate rent from sale price (1% rule)
  const estimatedRent = mls.medianSalePrice * 0.01;
  
  // Calculate vacancy from listing ratios
  const totalListings = mls.activeListings + mls.pendingListings;
  const marketActivity = mls.soldListings / totalListings;
  const vacancyEstimate = Math.max(3, Math.min(15, (1 - marketActivity) * 15));
  
  return {
    zipCode,
    city: 'Local Area',
    state: 'Unknown',
    
    medianRent: Math.round(estimatedRent),
    medianPrice: mls.medianSalePrice,
    rentGrowth12mo: seededRandom(seed + 310, -2, 11),
    appreciationRate12mo: mls.yearOverYearChange,
    
    vacancyRate: vacancyEstimate,
    daysOnMarket: mls.averageDaysOnMarket,
    foreclosureRate: seededRandom(seed + 311, 0.7, 2.9),
    
    economicDiversityIndex: seededRandom(seed + 312, 52, 86),
    crimeSafetyScore: seededRandom(seed + 313, 60, 88),
    schoolRating: seededRandom(seed + 314, 5.8, 8.8),
    
    dateUpdated: new Date(mls.date),
    dataSource: DataSource.MLS,
    confidence: 90, // MLS data is typically very current and accurate
  };
}

// ============================================================================
// Unified Mock Generator
// ============================================================================

/**
 * Generate mock standard data directly (fallback/default)
 */
export function generateMockStandardData(zipCode: string): StandardMarketData {
  const seed = zipToSeed(zipCode);
  
  return {
    zipCode,
    city: 'Mock City',
    state: 'CA',
    
    medianRent: Math.round(seededRandom(seed, 1500, 4500)),
    medianPrice: Math.round(seededRandom(seed + 1, 300000, 1200000)),
    rentGrowth12mo: seededRandom(seed + 2, -5, 15),
    appreciationRate12mo: seededRandom(seed + 3, -10, 20),
    
    vacancyRate: seededRandom(seed + 4, 2, 15),
    daysOnMarket: Math.round(seededRandom(seed + 5, 15, 90)),
    foreclosureRate: seededRandom(seed + 6, 0.1, 3),
    
    economicDiversityIndex: seededRandom(seed + 7, 40, 95),
    crimeSafetyScore: seededRandom(seed + 8, 50, 95),
    schoolRating: seededRandom(seed + 9, 4, 9.5),
    
    dateUpdated: new Date(),
    dataSource: DataSource.MOCK,
    confidence: 60,
  };
}

/**
 * Generate mock County Assessor data
 */
export function generateMockCountyAssessorData(zipCode: string): CountyAssessorData {
  const seed = zipToSeed(zipCode);
  
  const assessedValue = Math.round(seededRandom(seed + 400, 200000, 1200000));
  const landValue = Math.round(assessedValue * seededRandom(seed + 401, 0.2, 0.4));
  const improvementValue = assessedValue - landValue;
  
  return {
    apn: `${zipCode}-${Math.floor(seededRandom(seed + 402, 1000, 9999))}`,
    parcelId: `PARCEL-${zipCode}-${Math.floor(seededRandom(seed + 403, 100, 999))}`,
    legalDescription: `Lot ${Math.floor(seededRandom(seed + 404, 1, 50))}, Block ${Math.floor(seededRandom(seed + 405, 1, 20))}`,
    
    currentOwner: `Owner ${Math.floor(seededRandom(seed + 406, 1, 1000))}`,
    mailingAddress: `${Math.floor(seededRandom(seed + 407, 100, 9999))} Main St`,
    ownershipType: seededRandom(seed + 408, 0, 1) > 0.8 ? 'Corporation' : 'Individual',
    
    landUse: seededRandom(seed + 409, 0, 1) > 0.9 ? 'Commercial' : 'Residential',
    zoning: seededRandom(seed + 410, 0, 1) > 0.7 ? 'R-1' : 'R-2',
    lotSize: Math.round(seededRandom(seed + 411, 5000, 15000)),
    yearBuilt: Math.round(seededRandom(seed + 412, 1950, 2020)),
    bedrooms: Math.round(seededRandom(seed + 413, 2, 5)),
    bathrooms: Math.round(seededRandom(seed + 414, 1, 4)),
    squareFeet: Math.round(seededRandom(seed + 415, 1200, 3500)),
    
    assessedValue,
    landValue,
    improvementValue,
    assessmentYear: new Date().getFullYear(),
    
    annualTaxAmount: Math.round(assessedValue * seededRandom(seed + 416, 0.008, 0.025)),
    taxDelinquent: seededRandom(seed + 417, 0, 1) > 0.95,
    taxLienAmount: seededRandom(seed + 418, 0, 1) > 0.98 ? Math.round(seededRandom(seed + 419, 1000, 10000)) : 0,
    taxExemptions: seededRandom(seed + 420, 0, 1) > 0.8 ? ['Homestead'] : [],
    
    salesHistory: generateMockSalesHistory(seed + 421),
    permits: generateMockPermits(seed + 422),
    violations: generateMockViolations(seed + 423),
  };
}

/**
 * Generate mock sales history
 */
function generateMockSalesHistory(seed: number): Array<{
  saleDate: string;
  salePrice: number;
  saleType: string;
  buyer: string;
  seller: string;
}> {
  const salesCount = Math.floor(seededRandom(seed, 1, 4));
  const sales = [];
  
  for (let i = 0; i < salesCount; i++) {
    const saleDate = new Date();
    saleDate.setFullYear(saleDate.getFullYear() - Math.floor(seededRandom(seed + i, 1, 10)));
    saleDate.setMonth(Math.floor(seededRandom(seed + i + 1, 0, 11)));
    
    sales.push({
      saleDate: saleDate.toISOString().split('T')[0],
      salePrice: Math.round(seededRandom(seed + i + 2, 150000, 800000)),
      saleType: seededRandom(seed + i + 3, 0, 1) > 0.9 ? 'Non-Arm\'s Length' : 'Arm\'s Length',
      buyer: `Buyer ${Math.floor(seededRandom(seed + i + 4, 1, 1000))}`,
      seller: `Seller ${Math.floor(seededRandom(seed + i + 5, 1, 1000))}`,
    });
  }
  
  return sales.sort((a, b) => new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime());
}

/**
 * Generate mock permits
 */
function generateMockPermits(seed: number): Array<{
  permitNumber: string;
  type: string;
  issueDate: string;
  status: string;
  description: string;
}> {
  const permitCount = Math.floor(seededRandom(seed, 0, 3));
  const permits = [];
  
  const permitTypes = ['Building', 'Electrical', 'Plumbing', 'HVAC', 'Roofing'];
  
  for (let i = 0; i < permitCount; i++) {
    const issueDate = new Date();
    issueDate.setFullYear(issueDate.getFullYear() - Math.floor(seededRandom(seed + i, 0, 5)));
    issueDate.setMonth(Math.floor(seededRandom(seed + i + 1, 0, 11)));
    
    permits.push({
      permitNumber: `PERMIT-${Math.floor(seededRandom(seed + i + 2, 1000, 9999))}`,
      type: permitTypes[Math.floor(seededRandom(seed + i + 3, 0, permitTypes.length))],
      issueDate: issueDate.toISOString().split('T')[0],
      status: seededRandom(seed + i + 4, 0, 1) > 0.8 ? 'Closed' : 'Open',
      description: `${permitTypes[Math.floor(seededRandom(seed + i + 5, 0, permitTypes.length))]} work`,
    });
  }
  
  return permits;
}

/**
 * Generate mock violations
 */
function generateMockViolations(seed: number): Array<{
  violationType: string;
  date: string;
  status: string;
  fine: number;
  description: string;
}> {
  const violationCount = Math.floor(seededRandom(seed, 0, 2));
  const violations = [];
  
  const violationTypes = ['Code Violation', 'Safety Violation', 'Environmental Violation'];
  
  for (let i = 0; i < violationCount; i++) {
    const violationDate = new Date();
    violationDate.setFullYear(violationDate.getFullYear() - Math.floor(seededRandom(seed + i, 0, 3)));
    violationDate.setMonth(Math.floor(seededRandom(seed + i + 1, 0, 11)));
    
    violations.push({
      violationType: violationTypes[Math.floor(seededRandom(seed + i + 2, 0, violationTypes.length))],
      date: violationDate.toISOString().split('T')[0],
      status: seededRandom(seed + i + 3, 0, 1) > 0.7 ? 'Resolved' : 'Open',
      fine: Math.round(seededRandom(seed + i + 4, 100, 2000)),
      description: `Violation description ${i + 1}`,
    });
  }
  
  return violations;
}

/**
 * Convert County Assessor data to standard format
 */
export function countyAssessorToStandard(
  county: CountyAssessorData,
  zipCode: string,
): StandardMarketData {
  const seed = zipToSeed(zipCode);
  
  // Calculate appreciation rate from sales history
  let appreciationRate = 0;
  if (county.salesHistory.length >= 2) {
    const sortedSales = county.salesHistory.sort((a, b) => 
      new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime()
    );
    const oldestSale = sortedSales[0];
    const newestSale = sortedSales[sortedSales.length - 1];
    
    const yearsDiff = (new Date(newestSale.saleDate).getTime() - 
                      new Date(oldestSale.saleDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    if (yearsDiff > 0) {
      appreciationRate = ((newestSale.salePrice - oldestSale.salePrice) / 
                         oldestSale.salePrice) / yearsDiff * 100;
    }
  }
  
  return {
    zipCode,
    city: 'Unknown',
    state: 'Unknown',
    
    medianRent: 0, // Not available from county data
    medianPrice: county.assessedValue,
    rentGrowth12mo: seededRandom(seed + 450, -2, 8),
    appreciationRate12mo: appreciationRate,
    
    vacancyRate: 0, // Not available
    daysOnMarket: seededRandom(seed + 451, 15, 90),
    foreclosureRate: county.taxDelinquent ? 1 : seededRandom(seed + 452, 0.5, 3),
    
    economicDiversityIndex: seededRandom(seed + 453, 50, 90),
    crimeSafetyScore: seededRandom(seed + 454, 60, 95),
    schoolRating: seededRandom(seed + 455, 5, 10),
    
    dateUpdated: new Date(),
    dataSource: DataSource.COUNTY_ASSESSOR,
    confidence: 90, // County data is reliable
  };
}

export const MockProviders = {
  // Raw data generators
  zillow: generateMockZillowData,
  realtor: generateMockRealtorData,
  census: generateMockCensusData,
  mls: generateMockMLSData,
  countyAssessor: generateMockCountyAssessorData,
  
  // Converters to standard format
  zillowToStandard,
  realtorToStandard,
  censusToStandard,
  mlsToStandard,
  countyAssessorToStandard,
  
  // Direct standard data
  standard: generateMockStandardData,
};

export default MockProviders;

