import React, { useState, useEffect, useRef } from 'react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('');
  const timerRef = useRef(null);
  const audioRef = useRef(null);

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
    <div
      className="pomodoro-container"
      style={{
        background:
          'linear-gradient(135deg, rgba(106,17,203,0.1) 0%, rgba(37,117,252,0.1) 100%)',
        borderRadius: '8px',
        padding: '1.5rem',
        maxWidth: '400px',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3
        className="text-center fw-bold"
        style={{ color: '#6a11cb', marginBottom: '1rem' }}
      >
        <i className="fas fa-clock me-2"></i>
        Pomodoro Timer
      </h3>

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
            background: `conic-gradient(
            from 0deg,
            #f0f0f0 0% ${100 - getProgressPercentage()}%, 
            #6a11cb ${100 - getProgressPercentage()}% 100%
          )`,
          }}
        ></div>
        <div
          className="inner-circle"
          style={{
            position: 'absolute',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#6a11cb',
          }}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Custom time input */}
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
            borderColor: '#6a11cb',
          }}
          disabled={isActive}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
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
                  ? 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
                  : 'white',
              borderColor: '#6a11cb',
              color: selectedTime === option.value ? 'white' : '#6a11cb',
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
            background: isActive
              ? '#e74c3c'
              : 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
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
            background: '#f0f0f0',
            color: '#555',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
          }}
        >
          <i className="fas fa-redo-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
