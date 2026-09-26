import React, { useEffect } from 'react';
import {
  ArrowRight,
  Music2,
  X,
} from 'lucide-react';

const WelcomeModal = ({
  type = 'returning',
  userName = 'there',
  onClose,
}) => {
  const isFirstTime = type === 'first-time';

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [onClose]);

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-red-600/10
          blur-[120px]
        "
      />

      {/* Modal */}

      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#111317]
          shadow-[0_25px_80px_rgba(0,0,0,0.65)]
          animate-[welcomeModalIn_0.3s_ease-out]
        "
      >
        {/* Top glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-32
            w-64
            -translate-x-1/2
            rounded-full
            bg-red-600/15
            blur-[70px]
          "
        />

        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-4
            top-4
            z-10
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/5
            text-gray-400
            transition
            duration-200
            hover:bg-white/10
            hover:text-white
            active:scale-95
          "
        >
          <X size={18} />
        </button>

        {/* Content */}

        <div
          className="
            relative
            px-6
            pb-7
            pt-9
            text-center
            sm:px-8
          "
        >
          {/* Icon */}

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/10
              shadow-[0_0_45px_rgba(229,9,47,0.16)]
            "
          >
            <Music2
              size={29}
              className="text-red-400"
            />
          </div>

          {/* Heading */}

          <h2
            className="
              mt-6
              text-2xl
              font-bold
              tracking-tight
              text-white
              sm:text-3xl
            "
          >
            {isFirstTime
              ? `Welcome to Sukoon, ${userName}!`
              : `Welcome back, ${userName}!`}
          </h2>

          {/* Description */}

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
            {isFirstTime
              ? 'Your account is ready. Find your music, build your collection, and enjoy your personal space.'
              : 'Your music is waiting for you. Pick up where you left off and continue listening.'}
          </p>

          {/* First-time message */}

          {isFirstTime && (
            <div
              className="
                mx-auto
                mt-5
                rounded-xl
                border
                border-white/5
                bg-white/[0.03]
                px-4
                py-3
                text-xs
                leading-5
                text-gray-500
              "
            >
              Your Sukoon journey starts here.
            </div>
          )}

          {/* Continue */}

          <button
            type="button"
            onClick={onClose}
            className="
              group
              mt-6
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-600
              px-5
              text-sm
              font-semibold
              text-white
              shadow-[0_8px_25px_rgba(229,9,47,0.18)]
              transition-all
              duration-200
              hover:bg-red-500
              hover:shadow-[0_8px_30px_rgba(229,9,47,0.28)]
              active:scale-[0.99]
            "
          >
            {isFirstTime
              ? 'Start Listening'
              : 'Continue Listening'}

            <ArrowRight
              size={17}
              className="
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      </div>

      {/* Animation */}

      <style>
        {`
          @keyframes welcomeModalIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.96);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default WelcomeModal;