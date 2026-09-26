import React, { useEffect, useState } from 'react';
import { Send, X } from 'lucide-react';
import './special.css';

const REQUIRED_MESSAGE = 'I LOVE YOU TOO';

const SpecialMessage = ({
  userName = 'Mayank',
  backgroundImage = '/special/special-wallpaper.jpeg',
  onComplete,
  onClose,
}) => {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  /*
    Prevent the main Sukoon page
    from scrolling while popup is active.
  */
  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  /*
    =====================================================
    PAGE 1 CLOSE

    Blink effect:
    Popup disappears
    ↓
    250ms
    ↓
    Page 2 appears
    =====================================================
  */

  const handleFirstPageClose = () => {
    setShowPopup(false);

    setTimeout(() => {
      setPage(2);
      setShowPopup(true);

      setAnimationKey(
        (previous) => previous + 1
      );
    }, 250);
  };

  /*
    =====================================================
    PAGE 2 CLOSE

    Blink effect:
    Popup disappears
    ↓
    250ms
    ↓
    Page 2 comes back
    =====================================================
  */

  const handleSecondPageClose = () => {
    setShowPopup(false);

    setTimeout(() => {
      setShowPopup(true);

      setAnimationKey(
        (previous) => previous + 1
      );
    }, 250);
  };

  /*
    =====================================================
    INPUT CHANGE
    =====================================================
  */

  const handleMessageChange = (event) => {
    setMessage(event.target.value);

    if (error) {
      setError('');
    }
  };

  /*
    =====================================================
    CHECK MESSAGE

    Case insensitive.
    Multiple spaces are ignored.
    =====================================================
  */

  const handleSubmit = () => {
    const normalizedMessage =
      message
        .trim()
        .replace(/\s+/g, ' ')
        .toUpperCase();

    if (
      normalizedMessage !==
      REQUIRED_MESSAGE
    ) {
      setError(
        'Please write I LOVE YOU TOO na 🥺❤️'
      );

      return;
    }

    setError('');

    if (onComplete) {
      onComplete();
    }

    setPage(3);

    setAnimationKey(
      (previous) => previous + 1
    );
  };

  /*
    =====================================================
    FINAL PAGE CLOSE

    This one really closes the popup.
    =====================================================
  */

  const handleFinalClose = () => {
    setShowPopup(false);

    if (onClose) {
      onClose();
    }
  };

  /*
    During the 250ms blink,
    don't render the popup.
  */

  if (!showPopup) {
    return null;
  }

  /*
    =====================================================
    PAGE 1
    =====================================================
  */

  if (page === 1) {
    return (
      <div
        key={animationKey}
        className="
          special-overlay
          special-no-image
        "
      >
        <div className="special-dark-overlay" />

        <div
          className="
            special-card
            special-page-enter
          "
        >
          {/* Close */}

          <button
            type="button"
            onClick={
              handleFirstPageClose
            }
            className="special-close"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Sorry animation */}

          <div className="special-sorry-heart">
            <span className="special-sorry-emoji">
              🥺
            </span>

            <span className="special-sorry-heart-emoji">
              ❤️
            </span>
          </div>

          <h1 className="special-title">
            I'm really sorry 🥺❤️
          </h1>

          <p className="special-text">
            I know you're angry with
            me, and I know that a
            simple sorry can't fix
            everything.
          </p>

          <p className="special-text">
            But I genuinely want you
            to know that I'm sorry
            for hurting you. I miss
            talking to you and I
            really don't like being
            away from you.
          </p>

          <div className="special-sorry">
            I'm really, really sorry
            🥺🙏❤️
          </div>

          <p className="special-text">
            I don't want to argue.
            I just want to say that
            I'm sorry and that you
            mean a lot to me. ❤️
          </p>

          <p className="special-small">
            Please read this once...
            🥺❤️
          </p>
        </div>
      </div>
    );
  }

  /*
    =====================================================
    PAGE 2
    =====================================================
  */

  if (page === 2) {
    return (
      <div
        key={animationKey}
        className="
          special-overlay
          special-no-image
        "
      >
        <div className="special-dark-overlay" />

        <div
          className="
            special-card
            special-page-enter
          "
        >
          {/* Close */}

          <button
            type="button"
            onClick={
              handleSecondPageClose
            }
            className="special-close"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Sorry animation */}

          <div
            className="
              special-sorry-heart
              small
            "
          >
            <span className="special-sorry-emoji">
              🥺
            </span>

            <span className="special-sorry-heart-emoji">
              ❤️
            </span>
          </div>

          <h1 className="special-title">
            One more thing...
          </h1>

          <p className="special-text">
            I know saying sorry again
            and again won't magically
            make everything okay.
          </p>

          <p className="special-text">
            I just want you to know
            that you mean a lot to me.
            I miss you, I care about
            you, and I really want to
            talk to you.
          </p>

          <div className="special-love">
            Please don't stay angry
            with me forever 🥺❤️
          </div>

          {/* Input */}

          <div className="special-input-wrapper">
            <textarea
              value={message}
              onChange={
                handleMessageChange
              }
              placeholder="I LOVE YOU TOO ❤️"
              rows={2}
              className="special-input"
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          {/* Error */}

          {error && (
            <div className="special-error">
              {error}
            </div>
          )}

          {/* Send */}

          <button
            type="button"
            onClick={handleSubmit}
            className="special-button"
          >
            Send it

            <Send size={17} />
          </button>

          <p className="special-hint">
            Write:
            <br />

            <span className="special-required">
              I LOVE YOU TOO ❤️
            </span>
          </p>
        </div>
      </div>
    );
  }

  /*
    =====================================================
    PAGE 3
    =====================================================
  */

  return (
    <div
      key={animationKey}
      className="
        special-overlay
        special-final-page
      "
    >
      <div
        className="
          special-card
          special-final-card
          special-page-enter
        "
      >
        {/* ===============================================
            PHOTO FILLS THE WHOLE POPUP
        =============================================== */}

        <div className="special-photo-container">
          <img
            src={backgroundImage}
            alt="Special memory"
            className="special-photo"
          />
        </div>

        {/* ===============================================
            SORRY WORD HEART
        =============================================== */}

        <div className="sorry-word-heart">
          <svg
            viewBox="0 0 300 250"
            className="sorry-heart-svg"
            aria-label="Sorry heart"
          >
            <defs>
              <clipPath id="sorryHeartClip">
                <path
                  d="
                    M150 235
                    C130 215 35 165 35 90
                    C35 48 62 25 96 25
                    C122 25 141 40 150 62
                    C159 40 178 25 204 25
                    C238 25 265 48 265 90
                    C265 165 170 215 150 235
                    Z
                  "
                />
              </clipPath>
            </defs>

            <g clipPath="url(#sorryHeartClip)">
              <text
                x="22"
                y="55"
                className="heart-word"
              >
                SORRY SORRY SORRY
              </text>

              <text
                x="8"
                y="78"
                className="heart-word-small"
              >
                SORRY SORRY SORRY SORRY
              </text>

              <text
                x="20"
                y="101"
                className="heart-word"
              >
                SORRY SORRY SORRY
              </text>

              <text
                x="5"
                y="124"
                className="heart-word-small"
              >
                SORRY SORRY SORRY SORRY
              </text>

              <text
                x="22"
                y="147"
                className="heart-word"
              >
                SORRY SORRY SORRY
              </text>

              <text
                x="35"
                y="170"
                className="heart-word-small"
              >
                SORRY SORRY SORRY
              </text>

              <text
                x="62"
                y="193"
                className="heart-word"
              >
                SORRY SORRY
              </text>

              <text
                x="105"
                y="216"
                className="heart-word-small"
              >
                SORRY
              </text>
            </g>
          </svg>
        </div>

        {/* ===============================================
            FINAL MESSAGE
        =============================================== */}

        <h1 className="special-title">
          I'm really sorry ❤️
        </h1>

        <p className="special-text">
          I love you too.
        </p>

        <p className="special-text">
          I'm really sorry for
          hurting you.
        </p>

        <div className="special-final-message">
          Please unblock me when
          you're ready. 🥺
        </div>

        <p className="special-text">
          I just want to talk to you.
          ❤️
        </p>

        <div className="special-signature">
          — {userName}
        </div>

        {/* Final Close */}

        <button
          type="button"
          onClick={handleFinalClose}
          className="special-button"
        >
          Close ❤️
        </button>
      </div>
    </div>
  );
};

export default SpecialMessage;