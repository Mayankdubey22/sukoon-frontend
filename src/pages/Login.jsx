import React, { useState } from 'react';

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Music2,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../AuthContext';

const Login = ({
  onSwitchToSignup,
}) => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    const normalizedEmail =
      email.trim();

    if (
      !normalizedEmail ||
      !password
    ) {
      setError(
        'Please enter your email and password.'
      );

      return;
    }

    setLoading(true);

    const result = await login({
      email: normalizedEmail,
      password,
    });

    setLoading(false);

    if (!result.success) {
      if (
        result.requiresVerification
      ) {
        sessionStorage.setItem(
          'sukoon_verification_email',
          normalizedEmail
        );

        navigate('/verify-email');

        return;
      }

      setError(result.message);

      return;
    }

    /*
      Tell App.jsx that this was
      a normal login.
    */

    sessionStorage.setItem(
      'sukoon_welcome_type',
      'returning'
    );

    navigate('/', {
      replace: true,
    });
  };

  return (
    <div
      className="
        fixed
        inset-0
        overflow-hidden
        bg-[#08090c]
        px-4
        text-white
        sm:px-6
        lg:px-8
      "
    >
      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-red-600/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-red-950/20
          blur-[140px]
        "
      />

      {/* Logo */}

      <div
        className="
          absolute
          left-5
          top-5
          flex
          items-center
          gap-2
          sm:left-8
          sm:top-6
        "
      >
        <img
          src="/sukoon-logo.png"
          alt="Sukoon"
          className="
            h-9
            w-9
            object-contain
          "
        />

        <span
          className="
            text-lg
            font-bold
            tracking-tight
          "
        >
          Sukoon
        </span>
      </div>

      {/* Main */}

      <div
        className="
          relative
          mx-auto
          flex
          h-full
          w-full
          max-w-lg
          items-center
          justify-center
        "
      >
        <div
          className="
            w-full
            py-4
            sm:py-6
          "
        >
          {/* Heading */}

          <div
            className="
              mb-4
              text-center
            "
          >
            <div
              className="
                mx-auto
                mb-3
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                shadow-[0_0_40px_rgba(229,9,47,0.12)]
              "
            >
              <Music2
                size={23}
                className="text-red-400"
              />
            </div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                sm:text-3xl
              "
            >
              Welcome back
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-5
                text-gray-400
              "
            >
              Sign in and continue
              listening on Sukoon.
            </p>
          </div>

          {/* Card */}

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-[#111317]/90
              p-5
              shadow-2xl
              shadow-black/40
              backdrop-blur-xl
              sm:p-6
            "
          >
            {/* Error */}

            {error && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  px-4
                  py-2.5
                  text-sm
                  leading-5
                  text-red-400
                "
              >
                {error}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="login-email"
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-gray-300
                  "
                >
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value
                    );

                    if (error) {
                      setError('');
                    }
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#1b1d21]
                    px-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-gray-600
                    hover:border-white/15
                    focus:border-red-500/50
                    focus:bg-[#1e2025]
                    focus:ring-2
                    focus:ring-red-500/10
                  "
                />
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="login-password"
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-gray-300
                  "
                >
                  Password
                </label>

                <div
                  className="relative"
                >
                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );

                      if (error) {
                        setError('');
                      }
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-[#1b1d21]
                      px-4
                      pr-12
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-600
                      hover:border-white/15
                      focus:border-red-500/50
                      focus:bg-[#1e2025]
                      focus:ring-2
                      focus:ring-red-500/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-gray-500
                      transition
                      hover:bg-white/5
                      hover:text-white
                    "
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login button */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  mt-2
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_8px_25px_rgba(229,9,47,0.18)]
                  transition-all
                  duration-200
                  hover:bg-red-500
                  hover:shadow-[0_8px_30px_rgba(229,9,47,0.28)]
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight
                      size={17}
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>
            </form>

            {/* Signup */}

            <div
              className="
                mt-5
                border-t
                border-white/5
                pt-4
                text-center
                text-sm
                text-gray-500
              "
            >
              Don't have an account?

              <button
                type="button"
                onClick={
                  onSwitchToSignup
                }
                className="
                  ml-1
                  font-medium
                  text-white
                  transition
                  hover:text-red-400
                "
              >
                Create account
              </button>
            </div>
          </div>

          <p
            className="
              mt-3
              text-center
              text-[10px]
              text-gray-600
            "
          >
            Welcome to your personal
            music space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;