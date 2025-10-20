import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  phone?: string;
  company?: string;
  created_at: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string, phone?: string, company?: string) => Promise<void>;
  logout: () => Promise<void>;
  userDeals: any[];
  saveDeal: (dealData: any) => Promise<any>;
  loadUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDeals, setUserDeals] = useState<any[]>([]);

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        await loadUserData();
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('access_token');
        localStorage.removeItem('session_id');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('session_id');
    } finally {
      setLoading(false);
    }
  };

  const generateDeviceInfo = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      window.screen.width + 'x' + window.screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform,
      canvas.toDataURL(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.maxTouchPoints || 0
    ].join('|');
    
    return {
      fingerprint: btoa(fingerprint).slice(0, 32),
      user_agent: navigator.userAgent,
      browser: getBrowserInfo(),
      os: getOSInfo(),
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  };

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getOSInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  };

  const login = async (identifier: string, password: string): Promise<void> => {
    try {
      const deviceInfo = generateDeviceInfo();
      
      // Determine if identifier is email or phone
      const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      
      const requestBody = isEmailFormat 
        ? { email: identifier, password, device_info: deviceInfo }
        : { phone: identifier, password, device_info: deviceInfo };
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      console.log('AuthContext: Received login response:', data);
      
      // Store token and session info
      localStorage.setItem('access_token', data.access_token);
      if (data.session_id) {
        localStorage.setItem('session_id', data.session_id);
      } else {
        console.warn('AuthContext: No session_id in response');
      }
      
      console.log('AuthContext: Setting currentUser to:', data.user);
      setCurrentUser(data.user);
      
      // Load user data in background, don't let it block authentication
      loadUserData(data.user).catch(error => {
        console.error('Failed to load user deals:', error);
      });
      
      console.log('AuthContext: Login completed, isAuthenticated should be true');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName?: string, phone?: string, company?: string): Promise<void> => {
    try {
      const deviceInfo = generateDeviceInfo();
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName || '',
          phone,
          company,
          device_info: deviceInfo
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      
      // Store token and session info
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('session_id', data.session_id);
      
      setCurrentUser(data.user);
      await loadUserData(data.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('access_token');
      localStorage.removeItem('session_id');
      setCurrentUser(null);
      setUserDeals([]);
    }
  };

  const loadUserData = async (user?: any) => {
    const userToLoad = user || currentUser;
    if (!userToLoad) return;
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Load user's saved deals
      const dealsResponse = await fetch(`${API_BASE_URL}/api/deals/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (dealsResponse.ok) {
        const deals = await dealsResponse.json();
        setUserDeals(deals);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const saveDeal = async (dealData: any) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/api/deals/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save deal');
      }

      const savedDeal = await response.json();
      setUserDeals(prev => [...prev, savedDeal]);
      return savedDeal;
    } catch (error) {
      console.error('Save deal error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.is_verified || false,
    login,
    signup,
    logout,
    userDeals,
    saveDeal,
    loadUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
