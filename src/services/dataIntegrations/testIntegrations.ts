/**
 * Test file for Census and County Assessor integrations
 * This file demonstrates how to use the new adapters
 */

import { DataAggregator } from './dataAggregator';
import { CensusAdapter } from './censusAdapter';
import { CountyAssessorAdapter } from './countyAssessorAdapter';

/**
 * Test the Census API integration
 */
export async function testCensusIntegration() {
  console.log('Testing Census API integration...');
  
  const censusAdapter = new CensusAdapter({
    enabled: true,
    apiKey: process.env.REACT_APP_CENSUS_API_KEY,
  });

  try {
    // Test with Beverly Hills ZIP code
    const censusData = await censusAdapter.fetchData('90210');
    console.log('Census data fetched successfully:', {
      zipCode: censusData.zipCode,
      medianIncome: censusData.medianPrice,
      medianRent: censusData.medianRent,
      population: censusData.economicDiversityIndex,
      confidence: censusData.confidence,
      dataSource: censusData.dataSource,
    });
    
    return true;
  } catch (error) {
    console.error('Census API test failed:', error);
    return false;
  }
}

/**
 * Test the County Assessor integration
 */
export async function testCountyAssessorIntegration() {
  console.log('Testing County Assessor integration...');
  
  const countyAdapter = new CountyAssessorAdapter({
    enabled: true,
    apiKey: process.env.REACT_APP_COUNTY_API_KEY,
  });

  try {
    // Test with mock data (since most counties don't have public APIs)
    const countyData = await countyAdapter.fetchData('90210');
    console.log('County Assessor data fetched successfully:', {
      zipCode: countyData.zipCode,
      medianPrice: countyData.medianPrice,
      appreciationRate: countyData.appreciationRate12mo,
      foreclosureRate: countyData.foreclosureRate,
      confidence: countyData.confidence,
      dataSource: countyData.dataSource,
    });
    
    // Test specific property data
    const propertyData = await countyAdapter.fetchPropertyData('123-456-789', 'los_angeles');
    console.log('Property data fetched:', {
      apn: propertyData.apn,
      assessedValue: propertyData.assessedValue,
      currentOwner: propertyData.currentOwner,
      salesHistory: propertyData.salesHistory.length,
      permits: propertyData.permits.length,
      violations: propertyData.violations.length,
    });
    
    return true;
  } catch (error) {
    console.error('County Assessor API test failed:', error);
    return false;
  }
}

/**
 * Test the Data Aggregator with all sources
 */
export async function testDataAggregator() {
  console.log('Testing Data Aggregator with all sources...');
  
  const aggregator = new DataAggregator({
    strategy: 'priority' as any,
    minimumSources: 1,
  });

  try {
    const aggregatedData = await aggregator.fetchAggregatedData('90210');
    console.log('Aggregated data fetched successfully:', {
      zipCode: aggregatedData.zipCode,
      sources: aggregatedData.sources,
      medianPrice: aggregatedData.medianPrice,
      medianRent: aggregatedData.medianRent,
      confidence: aggregatedData.confidence,
      dataSource: aggregatedData.dataSource,
    });
    
    // Show quality scores for each source
    console.log('Data quality scores:');
    aggregatedData.qualityScores.forEach((quality, source) => {
      console.log(`  ${source}: ${quality.overall}/100 (${quality.completeness}% complete)`);
    });
    
    return true;
  } catch (error) {
    console.error('Data Aggregator test failed:', error);
    return false;
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('Starting integration tests...\n');
  
  const results = await Promise.allSettled([
    testCensusIntegration(),
    testCountyAssessorIntegration(),
    testDataAggregator(),
  ]);
  
  console.log('\nTest Results:');
  results.forEach((result, index) => {
    const testNames = ['Census API', 'County Assessor', 'Data Aggregator'];
    if (result.status === 'fulfilled') {
      console.log(`✅ ${testNames[index]}: ${result.value ? 'PASSED' : 'FAILED'}`);
    } else {
      console.log(`❌ ${testNames[index]}: FAILED - ${result.reason}`);
    }
  });
  
  const passedTests = results.filter(r => r.status === 'fulfilled' && r.value).length;
  console.log(`\nSummary: ${passedTests}/${results.length} tests passed`);
  
  return passedTests === results.length;
}

// Export for use in other files
export default {
  testCensusIntegration,
  testCountyAssessorIntegration,
  testDataAggregator,
  runAllTests,
};
