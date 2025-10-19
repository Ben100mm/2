import React, { Suspense, lazy } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider, RoleContext } from './context/RoleContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ProfessionalSupportProvider } from './context/ProfessionalSupportContext';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { RouteProtection } from './components/RouteProtection';
import { AuthGuard } from './components/AuthGuard';
import { theme } from "./theme";
import Header from './components/HeaderWithRouting';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const ProfessionalSignupPage = lazy(() => import('./pages/ProfessionalSignupPage'));
const BusinessSignupPage = lazy(() => import('./pages/BusinessSignupPage'));
const LuminaPage = lazy(() => import('./pages/LuminaPage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const BuyPage = lazy(() => import('./pages/BuyPage'));
const RentPage = lazy(() => import('./pages/RentPage'));

const MortgagePage = lazy(() => import('./pages/MortgagePage'));
const PreApprovalPage = lazy(() => import('./pages/PreApprovalPage'));
const PreApprovalBasicInfoPage = lazy(() => import('./pages/PreApprovalBasicInfoPage'));
const PreApprovalQuestionsPage = lazy(() => import('./pages/PreApprovalQuestionsPage'));
const PreApprovalHomePreferencesPage = lazy(() => import('./pages/PreApprovalHomePreferencesPage'));
const PreApprovalFinancialPage = lazy(() => import('./pages/PreApprovalFinancialPage'));
const PreApprovalPropertyFinancialPage = lazy(() => import('./pages/PreApprovalPropertyFinancialPage'));
const PreApprovalAdditionalQuestionsPage = lazy(() => import('./pages/PreApprovalAdditionalQuestionsPage'));
const PreApprovalSummaryPage = lazy(() => import('./pages/PreApprovalSummaryPage'));
const PreApprovalResultsPage = lazy(() => import('./pages/PreApprovalResultsPage'));
const UnderwritePage = lazy(() => import('./pages/UnderwritePage'));
const UXDemoPage = lazy(() => import('./pages/UXDemoPage'));

const ClosePage = lazy(() => import('./pages/ClosePage'));
const WorkspacesPage = lazy(() => import('./pages/WorkspacesPage'));
const WorkspacesPersonalPage = lazy(() => import('./pages/WorkspacesPersonalPage'));
const WorkspacesAgentPage = lazy(() => import('./pages/WorkspacesAgentPage'));
const WorkspacesBrokeragesPage = lazy(() => import('./pages/WorkspacesBrokeragesPage'));
const WorkspacesProfessionalSupportPage = lazy(() => import('./pages/WorkspacesProfessionalSupportPage'));
const WorkspacesBusinessesPage = lazy(() => import('./pages/WorkspacesBusinessesPage'));
const PartnerPage = lazy(() => import('./pages/partner'));
const PartnerProfileCompletionPage = lazy(() => import('./pages/PartnerProfileCompletionPage'));
const OtherProfessionalPage = lazy(() => import('./pages/OtherProfessionalPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PerformanceDashboardPage = lazy(() => import('./pages/PerformanceDashboardPage'));
const DataSourcesDashboard = lazy(() => import('./pages/DataSourcesDashboard'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const AdvertisePage = lazy(() => import('./pages/AdvertisePage'));
const Advertise3DPage = lazy(() => import('./pages/Advertise3DPage'));
const DeveloperPage = lazy(() => import('./pages/DeveloperPage'));

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const HomePage = () => (
  <AppContainer>
    <Header />
    <Hero />
    <Navigation />
  </AppContainer>
);

const AppContent = () => {
  const { userRole } = React.useContext(RoleContext);

  const getRouteForRole = (role: string) => {
    if ([
      'Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'
    ].includes(role)) return '/workspaces/personal';
    if ([
      'Real Estate Agent', 'Real Estate Broker', 'Realtor', "Buyer's Agent",
      'Listing Agent', 'Commercial Agent', 'Luxury Agent', 'New Construction Agent',
      'Wholesaler', 'Disposition Agent'
    ].includes(role)) return '/workspaces/agent';
    if (['Real Estate Broker'].includes(role)) return '/workspaces/brokerages';
    return '/workspaces/other';
  };

  return (
    <Suspense fallback={<div>Loading…</div>}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/professional-signup" element={<ProfessionalSignupPage />} />
      <Route path="/business-signup" element={<BusinessSignupPage />} />
      <Route path="/lumina" element={
        <AuthGuard>
          <RouteProtection>
            <LuminaPage />
          </RouteProtection>
        </AuthGuard>
      } />
      <Route path="/marketplace" element={
        <AuthGuard>
          <RouteProtection>
            <MarketplacePage />
          </RouteProtection>
        </AuthGuard>
      }>
        <Route index element={<Navigate to="buy" replace />} />
        <Route path="buy" element={<BuyPage />} />
        <Route path="rent" element={<RentPage />} />
      </Route>
      <Route path="/buy" element={
        <AuthGuard>
          <Navigate to="/marketplace/buy" replace />
        </AuthGuard>
      } />
      <Route path="/rent" element={
        <AuthGuard>
          <Navigate to="/marketplace/rent" replace />
        </AuthGuard>
      } />

      <Route path="/mortgage" element={
        <AuthGuard>
          <RouteProtection>
            <MortgagePage />
          </RouteProtection>
        </AuthGuard>
      } />
      <Route path="/pre-approval" element={
        <AuthGuard>
          <PreApprovalPage />
        </AuthGuard>
      } />
      <Route path="/pre-approval-basic-info" element={
        <AuthGuard>
          <PreApprovalBasicInfoPage />
        </AuthGuard>
      } />
      <Route path="/pre-approval-questions" element={
        <AuthGuard>
          <PreApprovalQuestionsPage />
        </AuthGuard>
      } />
      <Route path="/pre-approval-home-preferences" element={
        <AuthGuard>
          <PreApprovalHomePreferencesPage />
        </AuthGuard>
      } />
      <Route path="/pre-approval-financial" element={
        <AuthGuard>
          <PreApprovalFinancialPage />
        </AuthGuard>
      } />
      <Route path="/pre-approval-property-financial" element={
        <AuthGuard>
          <PreApprovalPropertyFinancialPage />
        </AuthGuard>
      } />
      <Route path="/pre-approval-additional-questions" element={
        <AuthGuard>
          <PreApprovalAdditionalQuestionsPage />
        </AuthGuard>
      } />
      <Route path="/pre-approval-summary" element={
        <AuthGuard>
          <PreApprovalSummaryPage />
        </AuthGuard>
      } />
      <Route path="/pre-approval-results" element={
        <AuthGuard>
          <PreApprovalResultsPage />
        </AuthGuard>
      } />
      <Route path="/underwrite" element={
        <AuthGuard>
          <UnderwritePage />
        </AuthGuard>
      } />
      
      {/* New Workspaces Routes */}
      <Route path="/workspaces" element={
        <AuthGuard>
          <RouteProtection>
            <WorkspacesPage />
          </RouteProtection>
        </AuthGuard>
      } />
      <Route path="/workspaces/personal" element={
        <AuthGuard>
          <WorkspacesPersonalPage />
        </AuthGuard>
      } />
      <Route path="/workspaces/buyer" element={
        <AuthGuard>
          <Navigate to="/workspaces/personal" replace />
        </AuthGuard>
      } />
      <Route path="/workspaces/agent" element={
        <AuthGuard>
          <WorkspacesAgentPage />
        </AuthGuard>
      } />
      <Route path="/workspaces/brokerages" element={
        <AuthGuard>
          <WorkspacesBrokeragesPage />
        </AuthGuard>
      } />
      <Route path="/workspaces/businesses" element={
        <AuthGuard>
          <WorkspacesBusinessesPage />
        </AuthGuard>
      } />
      <Route path="/workspaces/professional-support" element={
        <AuthGuard>
          <WorkspacesProfessionalSupportPage />
        </AuthGuard>
      } />
      <Route path="/workspaces/other" element={
        <AuthGuard>
          <OtherProfessionalPage />
        </AuthGuard>
      } />
      
      {/* Redirects from old /close/* routes to new /workspaces/* routes */}
      <Route path="/close" element={
        <AuthGuard>
          <Navigate to="/workspaces" replace />
        </AuthGuard>
      } />
      <Route path="/close/buyer" element={
        <AuthGuard>
          <Navigate to="/workspaces/personal?workspace=close" replace />
        </AuthGuard>
      } />
      <Route path="/close/personal" element={
        <AuthGuard>
          <Navigate to="/workspaces/personal?workspace=close" replace />
        </AuthGuard>
      } />
      <Route path="/close/agent" element={
        <AuthGuard>
          <Navigate to="/workspaces/agent" replace />
        </AuthGuard>
      } />
      <Route path="/close/brokerages" element={
        <AuthGuard>
          <Navigate to="/workspaces/brokerages" replace />
        </AuthGuard>
      } />
      <Route path="/close/businesses" element={
        <AuthGuard>
          <Navigate to="/workspaces/businesses" replace />
        </AuthGuard>
      } />
      <Route path="/close/professional-support" element={
        <AuthGuard>
          <Navigate to="/workspaces/professional-support" replace />
        </AuthGuard>
      } />
      
      <Route path="/rent" element={
        <AuthGuard>
          <Navigate to="/workspaces/personal?workspace=rent" replace />
        </AuthGuard>
      } />
      <Route path="/manage" element={
        <AuthGuard>
          <Navigate to="/workspaces/personal?workspace=manage" replace />
        </AuthGuard>
      } />
      <Route path="/invest" element={
        <AuthGuard>
          <Navigate to="/workspaces/personal?workspace=invest" replace />
        </AuthGuard>
      } />
      <Route path="/fund" element={
        <AuthGuard>
          <Navigate to="/workspaces/personal?workspace=fund" replace />
        </AuthGuard>
      } />
      <Route path="/operate" element={
        <AuthGuard>
          <Navigate to="/workspaces/personal?workspace=operate" replace />
        </AuthGuard>
      } />
      <Route path="/learn" element={
        <AuthGuard>
          <RouteProtection>
            <LearnPage />
          </RouteProtection>
        </AuthGuard>
      } />
      <Route path="/advertise" element={
        <AuthGuard>
          <RouteProtection>
            <AdvertisePage />
          </RouteProtection>
        </AuthGuard>
      } />
      <Route path="/advertise-3d" element={
        <AuthGuard>
          <Advertise3DPage />
        </AuthGuard>
      } />
      <Route path="/partner" element={
        <AuthGuard>
          <RouteProtection>
            <PartnerPage />
          </RouteProtection>
        </AuthGuard>
      } />
      <Route path="/partner-profile" element={
        <AuthGuard>
          <PartnerProfileCompletionPage />
        </AuthGuard>
      } />
      <Route path="/profile" element={
        <AuthGuard>
          <ProfilePage />
        </AuthGuard>
      } />
      <Route path="/ux-demo" element={
        <AuthGuard>
          <UXDemoPage />
        </AuthGuard>
      } />
      <Route path="/performance-dashboard" element={
        <AuthGuard>
          <PerformanceDashboardPage />
        </AuthGuard>
      } />
      <Route path="/data-sources" element={
        <AuthGuard>
          <DataSourcesDashboard />
        </AuthGuard>
      } />
      <Route path="/developer" element={
        <AuthGuard>
          <RouteProtection>
            <DeveloperPage />
          </RouteProtection>
        </AuthGuard>
      } />
    </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <FeatureFlagProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <RoleProvider>
            <WorkspaceProvider>
              <ProfessionalSupportProvider>
                <Router>
                  <AppContent />
                </Router>
              </ProfessionalSupportProvider>
            </WorkspaceProvider>
          </RoleProvider>
        </ThemeProvider>
      </AuthProvider>
    </FeatureFlagProvider>
  );
}

export default App;
