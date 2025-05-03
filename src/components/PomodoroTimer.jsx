import React, { useState, useEffect, useRef } from 'react';

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'var(--card-bg)',
    color: 'var(--text-color)',
    padding: '2rem',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: '0.5rem',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
  },
};

const PomodoroTimer = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('');
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const modalContentRef = useRef(null);

  // Handle clicking on overlay to close the modal
  const handleOverlayClick = (e) => {
    // Only close if the click was directly on the overlay and not on its children
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  // Preset time options in minutes
  const timeOptions = [
    { label: '10 min', value: 10 * 60 },
    { label: '15 min', value: 15 * 60 },
    { label: '30 min', value: 30 * 60 },
    { label: '1 hour', value: 60 * 60 },
  ];

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            playAlarm();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const selectTime = (seconds) => {
    setSelectedTime(seconds);
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
    setCustomMinutes(''); // Clear custom input when preset is selected
  };

  const handleCustomTimeChange = (e) => {
    const value = e.target.value;
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setCustomMinutes(value);
    }
  };

  const handleCustomTimeSubmit = (e) => {
    e.preventDefault();
    if (customMinutes && !isNaN(customMinutes)) {
      const seconds = parseInt(customMinutes) * 60;
      // Set a reasonable limit (max 180 minutes = 3 hours)
      if (seconds > 0 && seconds <= 10800) {
        selectTime(seconds);
        // Reset selected preset
        setSelectedTime(seconds);
      }
    }
  };

  const toggleTimer = () => {
    if (timeLeft === 0 && !isActive) {
      setTimeLeft(initialTime);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(initialTime);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (initialTime === 0) return 0;
    // Reverse the calculation: return percentage of time remaining instead of time elapsed
    return (timeLeft / initialTime) * 100;
  };

  // Helper function to generate the conic gradient based on progress
  const getProgressGradient = () => {
    if (initialTime === 0) {
      // Return a slightly lighter background color when no time is set
      // Check if we're in dark mode and use a lighter shade
      const isDarkMode = document.body.className.includes('dark');
      return isDarkMode ? '#3a4a5e' : '#f0f0f0'; // Lighter than card-bg in dark mode
    }
    
    const percentage = getProgressPercentage();
    return `conic-gradient(
      from 0deg,
      var(--card-bg) 0% ${100 - percentage}%, 
      var(--button-bg) ${100 - percentage}% 100%
    )`;
  };

  const playAlarm = () => {
    // Create audio element dynamically if not exists
    if (!audioRef.current) {
      audioRef.current = new Audio('/src/assets/sounds/timer-end.mp3');
    }

    // Fall back to system beep if audio file fails
    audioRef.current.play().catch(() => {
      console.log('Using system beep as fallback');
      // Fallback to system beep using Web Audio API
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, context.currentTime);

      const gainNode = context.createGain();
      gainNode.gain.setValueAtTime(1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 1
      );

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 1);
    });
  };

  return (
    <div style={styles.modalOverlay} onClick={handleOverlayClick}>
      <div style={styles.modalContent} ref={modalContentRef}>
        <button style={styles.closeButton} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <h2
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--button-bg)',
            fontSize: '1.75rem',
            fontWeight: 600,
          }}
        >
          Focus Timer
        </h2>

        <div
          className="timer-display"
          style={{
            position: 'relative',
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div
            className="progress-circle"
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: getProgressGradient(),
            }}
          ></div>
          <div
            className="inner-circle"
            style={{
              position: 'absolute',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'var(--card-bg)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'var(--button-bg)',
            }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        <form
          onSubmit={handleCustomTimeSubmit}
          className="mb-3"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <input
            type="text"
            value={customMinutes}
            onChange={handleCustomTimeChange}
            placeholder="Minutes"
            className="form-control"
            style={{
              borderRadius: '20px',
              maxWidth: '150px',
              borderColor: 'var(--button-bg)',
              background: 'var(--card-bg)',
              color: 'var(--text-color)',
            }}
            disabled={isActive}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              borderRadius: '20px',
              background: 'var(--button-bg)',
              border: 'none',
            }}
            disabled={!customMinutes || isActive}
          >
            Set
          </button>
        </form>

        <div
          className="preset-times"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {timeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => selectTime(option.value)}
              className={`btn ${
                selectedTime === option.value
                  ? 'btn-primary'
                  : 'btn-outline-primary'
              }`}
              style={{
                borderRadius: '20px',
                padding: '0.4rem 1rem',
                background:
                  selectedTime === option.value
                    ? 'var(--button-bg)'
                    : 'var(--card-bg)',
                borderColor: 'var(--button-bg)',
                color:
                  selectedTime === option.value ? 'white' : 'var(--button-bg)',
              }}
              disabled={isActive}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div
          className="controls"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <button
            onClick={toggleTimer}
            className="btn btn-lg"
            disabled={initialTime === 0}
            style={{
              background: isActive ? '#e74c3c' : 'var(--button-bg)',
              color: 'white',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: 'none',
            }}
          >
            <i className={`fas fa-${isActive ? 'pause' : 'play'}`}></i>
          </button>
          <button
            onClick={resetTimer}
            className="btn btn-lg"
            disabled={initialTime === 0}
            style={{
              background: 'var(--card-bg)',
              color: 'var(--text-muted)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid var(--text-muted)',
            }}
          >
            <i className="fas fa-redo-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
