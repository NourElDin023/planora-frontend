import { FaHeartbeat, FaBook, FaRunning, FaTasks, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    { 
      icon: <FaHeartbeat />, 
      title: 'Health Tracker', 
      desc: 'Monitor your vital stats & wellness',
      collectionName: 'Health Tracker'
    },
    { 
      icon: <FaBook />, 
      title: 'Journal', 
      desc: 'Record daily thoughts & experiences',
      collectionName: 'Journal'
    },
    { 
      icon: <FaRunning />, 
      title: 'Fitness Log', 
      desc: 'Track workouts & physical activities',
      collectionName: 'Fitness Log'
    },
    { 
      icon: <FaTasks />, 
      title: 'Task Manager', 
      desc: 'Organize daily tasks & goals',
      collectionName: 'Task Manager'
    },
    { 
      icon: <FaChartLine />, 
      title: 'Habit Builder', 
      desc: 'Build and track positive habits',
      collectionName: 'Habit Builder'
    },
    { 
      icon: <FaMoneyBillWave />, 
      title: 'Finance Tracker', 
      desc: 'Manage expenses & budgeting',
      collectionName: 'Finance Tracker'
    },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to Life Tracker</h1>
        <p style={styles.subtitle}>Your All-in-One Personal Development Companion</p>
      </header>

      <div style={styles.quoteBox}>
        <p style={styles.quoteText}>"The key to mastering life is first to master your habits."</p>
      </div>

      <div style={styles.gridContainer}>
        {features.map((feature, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.icon}>{feature.icon}</div>
            <h3 style={styles.cardTitle}>{feature.title}</h3>
            <p style={styles.cardDesc}>{feature.desc}</p>
            <Link 
              to={`/viewcollections?collection=${encodeURIComponent(feature.collectionName)}`}
              style={styles.cardButton}
            >
              Explore
            </Link>
          </div>
        ))}
      </div>

      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Start Your Journey Today</h2>
        <p style={styles.ctaText}>Take control of your life one day at a time</p>
        <Link 
          to="/viewcollections"
          style={{ 
            ...styles.ctaButton,
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: 'var(--header-bg)',
    borderRadius: '15px',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    color: 'var(--text-color)',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
  },
  quoteBox: {
    backgroundColor: 'var(--quote-bg)',
    padding: '20px',
    borderRadius: '10px',
    margin: '30px 0',
    textAlign: 'center',
    border: '1px solid var(--quote-border)',
  },
  quoteText: {
    fontSize: '1.1rem',
    color: 'var(--quote-text)',
    fontStyle: 'italic',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    padding: '20px 0',
  },
  card: {
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  },
  icon: {
    fontSize: '2.5rem',
    color: 'var(--icon-color)',
    marginBottom: '15px',
  },
  cardTitle: {
    color: 'var(--text-color)',
    marginBottom: '10px',
    fontSize: '1.25rem'
  },
  cardDesc: {
    color: 'var(--text-muted)',
    minHeight: '60px',
    marginBottom: '15px'
  },
  cardButton: {
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '15px',
    width: '100%',
    display: 'block',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--button-hover)',
      transform: 'translateY(-2px)'
    }
  },
  ctaSection: {
    textAlign: 'center',
    padding: '50px 20px',
    marginTop: '40px',
    backgroundColor: 'var(--cta-bg)',
    borderRadius: '15px',
  },
  ctaTitle: {
    fontSize: '2rem',
    color: 'var(--text-color)',
    marginBottom: '15px',
  },
  ctaText: {
    color: 'var(--text-muted)',
    marginBottom: '25px',
    fontSize: '1.1rem'
  },
  ctaButton: {
    backgroundColor: 'var(--cta-button-bg)',
    color: 'var(--button-text)',
    padding: '15px 40px',
    fontSize: '1.1rem',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'var(--cta-button-hover)',
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }
  },
};

export default Home;