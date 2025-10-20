import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard = ({ 
  children, 
  fallback = <Navigate to="/" replace />
}: AuthGuardProps): React.ReactElement => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to homepage
  if (!isAuthenticated) {
    return fallback as React.ReactElement;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default AuthGuard;
