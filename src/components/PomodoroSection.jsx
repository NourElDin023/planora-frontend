import React from 'react';
import PomodoroTimer from './PomodoroTimer';

const PomodoroSection = ({ showPomodoro, setShowPomodoro }) => {
  if (!showPomodoro) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowPomodoro(false);
        }
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          width: '90%',
          maxWidth: '500px',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={() => setShowPomodoro(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '0.5rem',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#f0f0f0')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            ×
          </button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '0.5rem',
            }}
          >
            Pomodoro Timer
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            Stay focused and productive with timed work sessions
          </p>
        </div>
        <PomodoroTimer onClose={() => setShowPomodoro(false)} />
      </div>
    </div>
  );
};

export default PomodoroSection;
