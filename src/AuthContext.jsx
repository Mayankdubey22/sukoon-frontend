import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { API_BASE_URL } from './config';

const AuthContext = createContext(null);

const TOKEN_KEY = 'sukoon_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token && user);

  /* =====================================================
     GET CURRENT USER
  ===================================================== */

  const fetchCurrentUser = async (authToken) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message || 'Authentication failed'
        );
      }

      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error(
        'Fetch current user error:',
        error
      );

      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);

      return {
        success: false,
        message:
          error.message ||
          'Failed to fetch user',
      };
    }
  };

  /* =====================================================
     CHECK EXISTING LOGIN SESSION
  ===================================================== */

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken =
        localStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);

      await fetchCurrentUser(savedToken);

      setLoading(false);
    };

    initializeAuth();
  }, []);

  /* =====================================================
     SIGN UP
  ===================================================== */

  const signup = async ({
    name,
    email,
    password,
  }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message:
            data?.message ||
            'Failed to create account',
        };
      }

      return {
        success: true,
        message: data.message,
        email: data.email,
      };
    } catch (error) {
      console.error(
        'Signup error:',
        error
      );

      return {
        success: false,
        message:
          'Unable to connect to the server.',
      };
    }
  };

  /* =====================================================
     VERIFY EMAIL OTP
  ===================================================== */

  const verifyEmail = async ({
    email,
    otp,
  }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/verify-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message:
            data?.message ||
            'Failed to verify email',
        };
      }

      if (data.token) {
        localStorage.setItem(
          TOKEN_KEY,
          data.token
        );

        setToken(data.token);
      }

      if (data.user) {
        setUser(data.user);
      }

      return {
        success: true,
        message: data.message,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error(
        'Email verification error:',
        error
      );

      return {
        success: false,
        message:
          'Unable to connect to the server.',
      };
    }
  };

  /* =====================================================
     RESEND OTP
  ===================================================== */

  const resendOtp = async (email) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/resend-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message:
            data?.message ||
            'Failed to resend OTP',
        };
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error(
        'Resend OTP error:',
        error
      );

      return {
        success: false,
        message:
          'Unable to connect to the server.',
      };
    }
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const login = async ({
    email,
    password,
  }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message:
            data?.message ||
            'Failed to login',
          requiresVerification:
            data?.requiresVerification ||
            false,
        };
      }

      if (data.token) {
        localStorage.setItem(
          TOKEN_KEY,
          data.token
        );

        setToken(data.token);
      }

      if (data.user) {
        setUser(data.user);
      }

      return {
        success: true,
        message: data.message,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error(
        'Login error:',
        error
      );

      return {
        success: false,
        message:
          'Unable to connect to the server.',
      };
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);

    setToken(null);
    setUser(null);
  };

  /* =====================================================
     REFRESH USER
  ===================================================== */

  const refreshUser = async () => {
    const currentToken =
      localStorage.getItem(TOKEN_KEY);

    if (!currentToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    return fetchCurrentUser(
      currentToken
    );
  };

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {
    user,
    token,
    loading,
    isAuthenticated,

    signup,
    verifyEmail,
    resendOtp,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* =======================================================
   useAuth HOOK
======================================================= */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
};

export default AuthContext;