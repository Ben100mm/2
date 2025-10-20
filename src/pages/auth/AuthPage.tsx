import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Divider,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { brandColors } from "../../theme";
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';



const AuthContainer = styled(Container)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${brandColors.neutral[100]};
  padding: 1rem;
  overflow: hidden;
`;

const AuthCard = styled(Paper)`
  width: 100%;
  max-width: 380px;
  padding: 1.5rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
`;

const LogoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const BackButton = styled(Button)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: ${brandColors.neutral[700]};
  text-transform: none;
  font-size: 14px;
  
  &:hover {
    background: ${brandColors.neutral[50]};
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8px;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: ${brandColors.neutral[400]};
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${brandColors.primary};
    }
  }
`;

const ContinueButton = styled(Button)`
  height: 48px;
  border-radius: 8px;
  background: ${brandColors.primary};
  text-transform: none;
  font-size: 16px;
  font-weight: 600;
  
  &:hover {
    background: ${brandColors.primaryLight};
  }
`;

const SocialButton = styled(IconButton)`
  width: 48px;
  height: 48px;
  border: 2px solid ${brandColors.neutral[300]};
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: ${brandColors.neutral[50]};
    border-color: ${brandColors.neutral[500]};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const OrDivider = styled(Box)`
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
  
  .MuiDivider-root {
    flex-grow: 1;
  }
  
  .MuiTypography-root {
    margin: 0 1rem;
    color: ${brandColors.neutral[600]};
    font-size: 14px;
  }
`;

// Custom Google Logo Component
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Custom Apple Logo Component
const AppleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

// Custom Microsoft Logo Component
const MicrosoftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z" />
    <path fill="#7FBA00" d="M13 1h10v10H13z" />
    <path fill="#00A4EF" d="M1 13h10v10H1z" />
    <path fill="#FFB900" d="M13 13h10v10H13z" />
  </svg>
);

// Custom Facebook Logo Component
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877f2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Custom X (Twitter) Logo Component
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Redirect to homepage if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const isEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const isPhoneNumber = (input: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanInput = input.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanInput) && cleanInput.length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Validate password confirmation
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        await signup(email, password, fullName, phone);
        window.location.href = '/';
      } else {
        // Validate login input
        if (!isEmail(email) && !isPhoneNumber(email)) {
          setError('Please enter a valid email address or phone number');
          setIsLoading(false);
          return;
        }
        await login(email, password);
        window.location.href = '/';
      }
    } catch (error: any) {
      setError(error.message || (isSignUp ? 'Registration failed' : 'Invalid email/phone or password'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Signing in with ${provider}`);
    // Placeholder for social login
  };

  return (
    <AuthContainer maxWidth={false}>
      <AuthCard elevation={0}>
        <LogoContainer onClick={handleLogoClick}>
          <Typography
            variant="h4"
            sx={{
              color: brandColors.primary,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              fontSize: '2rem',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}
          >
            DREAMERY
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: brandColors.neutral[600],
              fontWeight: 600,
              fontSize: '1.5rem',
              textAlign: 'center'
            }}
          >
            {isSignUp ? 'Create account' : 'Sign in'}
          </Typography>
        </LogoContainer>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {isSignUp && (
            <StyledTextField
              fullWidth
              label="Full Name*"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: brandColors.neutral[500] }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <StyledTextField
            fullWidth
            label={isSignUp ? "Email Address*" : "Email or Phone Number*"}
            type={isSignUp ? "email" : "text"}
            placeholder={isSignUp ? "" : "Enter your email or phone number"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 1.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: brandColors.neutral[500] }} />
                </InputAdornment>
              ),
            }}
          />

          {isSignUp && (
            <StyledTextField
              fullWidth
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: brandColors.neutral[500] }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          
          <StyledTextField
            fullWidth
            label="Password*"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: brandColors.neutral[500] }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: brandColors.neutral[500] }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {isSignUp && (
            <StyledTextField
              fullWidth
              label="Confirm Password*"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: brandColors.neutral[500] }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: brandColors.neutral[500] }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <ContinueButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </ContinueButton>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ color: brandColors.neutral[800], fontSize: '14px' }}>
            {isSignUp ? 'Have a Dreamery account?' : 'New to Dreamery?'}{' '}
            <Button
              variant="text"
              onClick={() => setIsSignUp(!isSignUp)}
              sx={{
                color: brandColors.primary,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                minWidth: 'auto',
                padding: 0,
                '&:hover': {
                  background: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              {isSignUp ? 'Sign in' : 'Create account'}
            </Button>
          </Typography>
        </Box>

        <OrDivider>
          <Divider />
          <Typography variant="body2">Or Continue with</Typography>
          <Divider />
        </OrDivider>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          <SocialButton onClick={() => handleSocialLogin('Google')}>
            <GoogleIcon />
          </SocialButton>
          <SocialButton onClick={() => handleSocialLogin('Apple')}>
            <AppleIcon />
          </SocialButton>
          <SocialButton onClick={() => handleSocialLogin('Microsoft')}>
            <MicrosoftIcon />
          </SocialButton>
          <SocialButton onClick={() => handleSocialLogin('Facebook')}>
            <FacebookIcon />
          </SocialButton>
          <SocialButton onClick={() => handleSocialLogin('X')}>
            <XIcon />
          </SocialButton>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 1.5 }}>
          <Typography sx={{ color: brandColors.neutral[800], fontSize: '12px' }}>
            By submitting, I accept Dreamery's{' '}
            <Button
              variant="text"
              sx={{
                color: brandColors.primary,
                textTransform: 'none',
                fontSize: '12px',
                minWidth: 'auto',
                padding: 0,
                '&:hover': {
                  background: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              terms of use
            </Button>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{
              color: brandColors.neutral[800],
              textTransform: 'none',
              fontSize: '14px',
              '&:hover': {
                background: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            Go Back
          </Button>
        </Box>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;