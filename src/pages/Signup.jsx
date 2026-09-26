import React, { useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Music2,
} from 'lucide-react';
import { useAuth } from '../AuthContext';

const Signup = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (
      !name ||
      !email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const result = await signup({
      name,
      email,
      password: formData.password,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    sessionStorage.setItem(
      'sukoon_verification_email',
      result.email || email
    );

    window.location.href = '/verify-email';
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
      {/* BACKGROUND GLOW */}

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

      {/* BRAND */}

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

      {/* MAIN */}

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
          {/* TITLE */}

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
              Create your account
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-5
                text-gray-400
              "
            >
              Create your Sukoon account
              and keep your music with you.
            </p>
          </div>

          {/* CARD */}

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
            {error && (
              <div
                className="
                  mb-4
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

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              {/* NAME */}

              <div>
                <label
                  htmlFor="signup-name"
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-gray-300
                  "
                >
                  Name
                </label>

                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
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

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="signup-email"
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
                  id="signup-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="signup-password"
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

                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
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

              {/* CONFIRM PASSWORD */}

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-gray-300
                  "
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
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
                      setShowConfirmPassword(
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
                      showConfirmPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* CREATE ACCOUNT */}

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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

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

            {/* LOGIN */}

            <div
              className="
                mt-4
                border-t
                border-white/5
                pt-4
                text-center
                text-sm
                text-gray-500
              "
            >
              Already have an account?

              <button
                type="button"
                onClick={onSwitchToLogin}
                className="
                  ml-1
                  font-medium
                  text-white
                  transition
                  hover:text-red-400
                "
              >
                Sign in
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
            Your account helps keep your
            music experience personal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;