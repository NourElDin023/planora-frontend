import React from 'react';
import PomodoroTimer from './PomodoroTimer';

const PomodoroSection = ({ showPomodoro, setShowPomodoro }) => {
  if (!showPomodoro) return null;

  return (
    <div style={{
      marginBottom: '1rem',
      padding: '0.75rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, rgba(125,38,205,0.05) 0%, rgba(125,38,205,0.1) 100%)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
      }}>
        <h5 style={{ margin: '0', fontSize: '0.9rem', color: '#0d6efd' }}>
          <i className="fas fa-clock me-1"></i> Focus Timer
        </h5>
        <button
          onClick={() => setShowPomodoro(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '0.9rem',
            padding: 0,
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <PomodoroTimer />
    </div>
  );
};

export default PomodoroSection;