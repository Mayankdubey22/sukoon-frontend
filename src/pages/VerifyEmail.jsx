import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../AuthContext';

const VerifyEmail = () => {
  const navigate = useNavigate();

  const {
    verifyEmail,
    resendOtp,
  } = useAuth();

  const [email, setEmail] =
    useState('');

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [timeLeft, setTimeLeft] =
    useState(600);

  const inputRefs =
    useRef([]);

  /* =======================================================
     LOAD EMAIL
  ======================================================= */

  useEffect(() => {
    const savedEmail =
      sessionStorage.getItem(
        'sukoon_verification_email'
      );

    if (!savedEmail) {
      navigate('/auth', {
        replace: true,
      });

      return;
    }

    setEmail(savedEmail);

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, [navigate]);

  /* =======================================================
     OTP TIMER
  ======================================================= */

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(
        (previous) =>
          Math.max(
            previous - 1,
            0
          )
      );
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [timeLeft]);

  /* =======================================================
     OTP CHANGE
  ======================================================= */

  const handleOtpChange = (
    index,
    value
  ) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    setError('');
    setSuccess('');

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (
      value &&
      index < 5
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  /* =======================================================
     BACKSPACE
  ======================================================= */

  const handleKeyDown = (
    index,
    event
  ) => {
    if (
      event.key ===
        'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }
  };

  /* =======================================================
     PASTE OTP
  ======================================================= */

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted =
      event.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, 6);

    if (!pasted) {
      return;
    }

    const newOtp = [
      '',
      '',
      '',
      '',
      '',
      '',
    ];

    pasted
      .split('')
      .forEach(
        (digit, index) => {
          newOtp[index] = digit;
        }
      );

    setOtp(newOtp);

    setError('');
    setSuccess('');

    const nextIndex = Math.min(
      pasted.length,
      5
    );

    inputRefs.current[
      nextIndex
    ]?.focus();
  };

  /* =======================================================
     VERIFY
  ======================================================= */

  const handleVerify = async (
    event
  ) => {
    event.preventDefault();

    const otpValue =
      otp.join('');

    if (
      otpValue.length !== 6
    ) {
      setError(
        'Please enter the complete 6-digit OTP.'
      );

      return;
    }

    if (timeLeft <= 0) {
      setError(
        'This OTP has expired. Please request a new one.'
      );

      return;
    }

    setLoading(true);

    setError('');
    setSuccess('');

    const result =
      await verifyEmail({
        email,
        otp: otpValue,
      });

    setLoading(false);

    if (!result.success) {
      setError(result.message);

      return;
    }

    /*
      Email verification succeeded.

      Tell App.jsx that this is the
      user's first-time account creation.
    */

    sessionStorage.setItem(
      'sukoon_welcome_type',
      'first-time'
    );

    sessionStorage.removeItem(
      'sukoon_verification_email'
    );

    setSuccess(
      'Email verified successfully!'
    );

    setTimeout(() => {
      navigate('/', {
        replace: true,
      });
    }, 800);
  };

  /* =======================================================
     RESEND OTP
  ======================================================= */

  const handleResend = async () => {
    if (resending) {
      return;
    }

    setResending(true);

    setError('');
    setSuccess('');

    const result =
      await resendOtp(email);

    setResending(false);

    if (!result.success) {
      setError(result.message);

      return;
    }

    setOtp([
      '',
      '',
      '',
      '',
      '',
      '',
    ]);

    setTimeLeft(600);

    setSuccess(
      'A new OTP has been sent to your email.'
    );

    inputRefs.current[0]?.focus();
  };

  /* =======================================================
     TIMER
  ======================================================= */

  const minutes = Math.floor(
    timeLeft / 60
  )
    .toString()
    .padStart(2, '0');

  const seconds = (
    timeLeft % 60
  )
    .toString()
    .padStart(2, '0');

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        bg-[#121212]
        px-4
        py-10
        text-white
        sm:px-6
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-white/10
          bg-[#181818]
          p-6
          shadow-2xl
          shadow-black/30
          sm:p-8
        "
      >
        {/* Back */}

        <button
          type="button"
          onClick={() =>
            navigate('/auth')
          }
          className="
            mb-6
            flex
            items-center
            gap-2
            text-sm
            text-gray-400
            transition
            hover:text-white
          "
        >
          <ArrowLeft size={18} />

          Back
        </button>

        {/* Heading */}

        <div className="text-center">
          <img
            src="/sukoon-logo.png"
            alt="Sukoon"
            className="
              mx-auto
              mb-5
              h-14
              w-14
              object-contain
            "
          />

          <h1
            className="
              text-2xl
              font-bold
              sm:text-3xl
            "
          >
            Verify your email
          </h1>

          <p
            className="
              mx-auto
              mt-3
              max-w-sm
              text-sm
              leading-6
              text-gray-400
            "
          >
            We sent a 6-digit
            verification code to
          </p>

          <p
            className="
              mt-1
              break-all
              text-sm
              font-medium
              text-white
            "
          >
            {email}
          </p>
        </div>

        {/* Error */}

        {error && (
          <div
            className="
              mt-6
              rounded-lg
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-3
              text-center
              text-sm
              text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-green-500/20
              bg-green-500/10
              px-4
              py-3
              text-center
              text-sm
              text-green-400
            "
          >
            <CheckCircle2 size={17} />

            {success}
          </div>
        )}

        {/* Form */}

        <form
          onSubmit={handleVerify}
          className="mt-7"
        >
          {/* OTP inputs */}

          <div
            className="
              flex
              justify-center
              gap-2
              sm:gap-3
            "
            onPaste={handlePaste}
          >
            {otp.map(
              (digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[
                      index
                    ] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(
                    event
                  ) =>
                    handleOtpChange(
                      index,
                      event.target.value
                    )
                  }
                  onKeyDown={(
                    event
                  ) =>
                    handleKeyDown(
                      index,
                      event
                    )
                  }
                  className="
                    h-12
                    w-11
                    rounded-lg
                    border
                    border-white/10
                    bg-[#242424]
                    text-center
                    text-lg
                    font-semibold
                    text-white
                    outline-none
                    transition
                    focus:border-white/30
                    focus:bg-[#292929]
                    sm:h-14
                    sm:w-12
                    sm:text-xl
                  "
                  aria-label={`OTP digit ${
                    index + 1
                  }`}
                />
              )
            )}
          </div>

          {/* Timer */}

          <div
            className="
              mt-5
              text-center
              text-sm
              text-gray-400
            "
          >
            {timeLeft > 0 ? (
              <>
                Code expires in{' '}

                <span
                  className="
                    font-medium
                    text-white
                  "
                >
                  {minutes}:
                  {seconds}
                </span>
              </>
            ) : (
              <span
                className="
                  text-red-400
                "
              >
                OTP expired
              </span>
            )}
          </div>

          {/* Verify */}

          <button
            type="submit"
            disabled={
              loading ||
              otp.join('').length !== 6
            }
            className="
              mt-6
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-white
              px-4
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-gray-200
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        {/* Resend */}

        <div
          className="
            mt-6
            text-center
            text-sm
            text-gray-400
          "
        >
          Didn't receive the code?

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="
              ml-1
              font-medium
              text-white
              transition
              hover:underline
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {resending
              ? 'Sending...'
              : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;