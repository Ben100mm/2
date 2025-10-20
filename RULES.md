# Development Rules and Policies

## Data Integration Policy

### Rule: No Mock Data or Any Other Mock Use

**Established**: 2024-12-19

**Policy**: All data integrations must use **REAL APIs ONLY**. No mock data, mock fallbacks, or simulated data is allowed anywhere in the codebase.

### Implementation Requirements

1. **Real API Calls Only**
   - All data adapters must make real API calls to official data sources
   - No mock data providers or simulated responses
   - No fallback to mock data when APIs fail

2. **Error Handling**
   - When APIs are unavailable, adapters must throw proper errors
   - Errors should be descriptive and actionable
   - No silent fallbacks to mock data

3. **Data Sources**
   - Census API: Real calls to `https://api.census.gov/data`
   - County Assessor: Real calls to county-specific APIs
   - MLS: Real calls to MLS APIs (when available)
   - All other integrations: Real API calls only

4. **Testing**
   - Tests must use real APIs or be disabled
   - No mock data in test suites
   - Integration tests only with real data sources

### Enforcement

- This rule applies to all current and future data integrations
- Code reviews must verify no mock data usage
- Any violation of this rule must be immediately corrected

### Rationale

- Ensures data accuracy and reliability
- Prevents confusion between real and simulated data
- Maintains production-ready code quality
- Forces proper error handling and API management

---

**Status**: ACTIVE
**Last Updated**: 2024-12-19
**Enforced By**: Development Team
