# Census API & County Assessor Integration

## Overview

This implementation adds **free and accurate** data sources to the Dreamery platform:

1. **US Census API** - Demographics, population, housing data
2. **County Assessor Integration** - Property assessments, tax records, ownership history

Both integrations use **REAL DATA ONLY** - no mock data or fallbacks. If APIs are unavailable, the adapters will throw errors rather than returning mock data.

## Features Implemented

### ✅ US Census API Integration

- **Real API calls** to `https://api.census.gov/data`
- **American Community Survey (ACS) 5-Year Estimates** for comprehensive data
- **No mock fallbacks** - fails gracefully with proper error handling
- **Rate limiting and timeout handling**
- **Data fields**: Population, income, housing, unemployment, education

### ✅ County Assessor Integration

- **Framework for county-specific APIs** (Los Angeles, Cook, Maricopa, Harris)
- **Property data**: APN, ownership, assessments, tax information
- **Sales history** with appreciation rate calculations
- **Permits and violations** tracking
- **Real API calls only** - no mock data

### ✅ Enhanced Data Aggregation

- **Updated DataAggregator** to include new sources
- **Weighted aggregation** with configurable priorities
- **Quality scoring** for each data source
- **Conflict resolution** strategies
- **Real data only** - no mock fallbacks

## File Structure

```
src/services/dataIntegrations/
├── censusAdapter.ts              # Real Census API integration
├── countyAssessorAdapter.ts       # Real County Assessor integration
├── types.ts                      # Data types for all sources
├── dataAggregator.ts             # Aggregates real data from all sources
└── README.md                     # This documentation
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Census API (optional but recommended)
REACT_APP_CENSUS_API_KEY="your-census-api-key-here"

# County Assessor APIs (if required)
REACT_APP_COUNTY_API_KEY="your-county-api-key-here"

# Enable/disable adapters
REACT_APP_CENSUS_ENABLED=true
REACT_APP_COUNTY_ASSESSOR_ENABLED=true
```

### Getting Census API Key

1. Visit [Census API Key Request](https://api.census.gov/data/key_signup.html)
2. Fill out the form (free)
3. Add the key to your environment variables

## Usage Examples

### Basic Usage

```typescript
import { DataAggregator } from './services/dataIntegrations/dataAggregator';

const aggregator = new DataAggregator();

// Fetch aggregated data from all sources including Census and County Assessor
const marketData = await aggregator.fetchAggregatedData('90210');

console.log('Market data:', {
  zipCode: marketData.zipCode,
  medianPrice: marketData.medianPrice,
  medianRent: marketData.medianRent,
  sources: marketData.sources,
  confidence: marketData.confidence,
});
```

### Census-Specific Usage

```typescript
import { CensusAdapter } from './services/dataIntegrations/censusAdapter';

const censusAdapter = new CensusAdapter({
  enabled: true,
  apiKey: process.env.REACT_APP_CENSUS_API_KEY,
});

const censusData = await censusAdapter.fetchData('90210');
console.log('Census data:', {
  population: censusData.economicDiversityIndex,
  medianIncome: censusData.medianPrice,
  unemploymentRate: censusData.vacancyRate,
});
```

### County Assessor Usage

```typescript
import { CountyAssessorAdapter } from './services/dataIntegrations/countyAssessorAdapter';

const countyAdapter = new CountyAssessorAdapter();

// County Assessor data is property-specific, not ZIP code based
// Use fetchPropertyData for specific properties
const propertyData = await countyAdapter.fetchPropertyData('123-456-789', 'los_angeles');
console.log('Property data:', {
  apn: propertyData.apn,
  assessedValue: propertyData.assessedValue,
  currentOwner: propertyData.currentOwner,
  salesHistory: propertyData.salesHistory,
});
```

## Data Sources

### Census API Data Fields

- **Demographics**: Population, median age, median income
- **Housing**: Total units, occupied units, vacancy rate, median home value, median rent
- **Economic**: Unemployment rate, poverty rate
- **Education**: Bachelor's degree or higher percentage

### County Assessor Data Fields

- **Property Identification**: APN, parcel ID, legal description
- **Ownership**: Current owner, mailing address, ownership type
- **Property Details**: Land use, zoning, lot size, year built, bedrooms, bathrooms
- **Assessment**: Assessed value, land value, improvement value
- **Tax Information**: Annual tax amount, delinquency status, liens, exemptions
- **History**: Sales history, permits, violations

## Supported Counties

The County Assessor adapter includes configurations for:

- **Los Angeles County** (`los_angeles`)
- **Cook County (Chicago)** (`cook`)
- **Maricopa County (Phoenix)** (`maricopa`)
- **Harris County (Houston)** (`harris`)

To add more counties, update the `countyApis` Map in `countyAssessorAdapter.ts`.

## Error Handling

Both adapters include comprehensive error handling:

- **API timeouts** with configurable limits
- **Rate limiting** protection
- **No mock fallbacks** - proper error propagation
- **Detailed error messages** for debugging
- **Retry logic** for transient failures

## Performance Considerations

### Caching

- **Census data**: 7-day cache (updates infrequently)
- **County data**: 24-hour cache (updates daily)
- **Configurable TTL** for each adapter

### Rate Limits

- **Census API**: 500 requests/day (free), 10,000/day (with key)
- **County APIs**: Varies by county (typically 60-100/minute)
- **Automatic throttling** implemented

## Future Enhancements

### Planned Features

1. **Additional Census datasets** (age distribution, race/ethnicity)
2. **More county integrations** (expand supported counties)
3. **Real-time data updates** (webhook integration)
4. **Data validation** (cross-reference multiple sources)
5. **Geographic expansion** (state-level data)

### API Improvements

1. **Batch processing** for multiple properties
2. **Historical data** access
3. **Custom field mapping** for different counties
4. **Data quality metrics** and confidence scoring

## Troubleshooting

### Common Issues

1. **Census API errors**: Check API key and rate limits
2. **County API failures**: Verify county-specific endpoints
3. **No data available**: APIs may be down or rate limited
4. **Timeout errors**: Increase timeout values in configuration

### Debug Mode

Enable debug logging:

```typescript
const adapter = new CensusAdapter({
  enabled: true,
  timeout: 30000, // Increase timeout
});

// Check adapter availability
const isAvailable = await adapter.isAvailable();
console.log('Census adapter available:', isAvailable);
```

## Contributing

When adding new counties or data sources:

1. **Update types** in `types.ts`
2. **Add county configuration** in `countyAssessorAdapter.ts`
3. **Update aggregator** in `dataAggregator.ts`
4. **Test with real APIs** - no mock data allowed
5. **Update documentation**

## License

This implementation is part of the Dreamery platform and follows the same licensing terms.
