import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  if (showLogin) {
    return (
      <Login
        onSwitchToSignup={() =>
          setShowLogin(false)
        }
      />
    );
  }

  return (
    <Signup
      onSwitchToLogin={() =>
        setShowLogin(true)
      }
    />
  );
};

export default AuthPage;