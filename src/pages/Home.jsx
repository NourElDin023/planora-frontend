import { FaHeartbeat, FaBook, FaRunning, FaTasks, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
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
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Welcome to Planora</h1>
          <p style={styles.subtitle}>Your All-in-One Personal Development Companion</p>
          <div style={styles.ctaContainer}>
            <Link 
              to="/viewcollections"
              style={styles.primaryButton}
            >
              Get Started
            </Link>
            {/* <Link 
              to="/features"
              style={styles.secondaryButton}
            >
              Learn More
            </Link> */}
          </div>
        </div>
      </header>

      <div style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Your Life, Organized</h2>
          <p style={styles.sectionSubtitle}>Comprehensive tools for every aspect of your personal growth</p>
        </div>
        
        <div style={styles.gridContainer}>
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={`/viewcollections/${feature.collectionName.replace(/\s+/g, '-').toLowerCase()}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={styles.card}>
                <div style={styles.iconContainer}>
                  <div style={styles.icon}>{feature.icon}</div>
                </div>
                <h3 style={styles.cardTitle}>{feature.title}</h3>
                <p style={styles.cardDesc}>{feature.desc}</p>
                <div style={styles.cardHoverIndicator}></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={styles.testimonialSection}>
        <div style={styles.quoteBox}>
          <p style={styles.quoteText}>"The key to mastering life is first to master your habits."</p>
          <p style={styles.quoteAuthor}>- James Clear</p>
        </div>
      </div>

      <div style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Transform Your Life?</h2>
          <p style={styles.ctaText}>Join thousands of users who are taking control of their personal development</p>
          <div style={styles.ctaButtonContainer}>
            <Link 
              to="/register"
              style={styles.ctaButton}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    overflowX: 'hidden',
  },
  header: {
    backgroundColor: 'var(--header-bg)',
    color: 'var(--header-text)',
    padding: '80px 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '20px',
    lineHeight: '1.2',
    color: 'var(--text-color)',
  },
  subtitle: {
    fontSize: '1.3rem',
    opacity: '0.9',
    marginBottom: '40px',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: 'var(--text-muted)',
  },
  ctaContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  },
  primaryButton: {
    backgroundColor: 'var(--cta-button-bg)',
    color: 'var(--button-text)',
    padding: '15px 30px',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    ':hover': {
      backgroundColor: 'var(--cta-button-hover)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    }
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'var(--header-text)',
    padding: '15px 30px',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '2px solid var(--header-text)',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateY(-2px)',
    }
  },
  featuresSection: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'var(--main-bg)',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '2.2rem',
    color: 'var(--text-color)',
    marginBottom: '15px',
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
    }
  },
  iconContainer: {
    marginBottom: '20px',
  },
  icon: {
    fontSize: '2.5rem',
    color: 'var(--icon-color)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: 'var(--icon-bg)',
  },
  cardTitle: {
    color: 'var(--text-color)',
    marginBottom: '15px',
    fontSize: '1.4rem',
    fontWeight: '600',
  },
  cardDesc: {
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  cardHoverIndicator: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '4px',
    backgroundColor: 'var(--icon-color)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'scaleX(1)',
    }
  },
  testimonialSection: {
    padding: '60px 20px',
    backgroundColor: 'var(--quote-bg)',
  },
  quoteBox: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '40px',
  },
  quoteText: {
    fontSize: '1.8rem',
    color: 'var(--quote-text)',
    fontStyle: 'italic',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  quoteAuthor: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  ctaSection: {
    backgroundColor: 'var(--cta-bg)',
    color: 'var(--cta-text)',
    padding: '80px 20px',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '2.2rem',
    marginBottom: '20px',
    color: 'var(--cta-text)',
  },
  ctaText: {
    fontSize: '1.2rem',
    opacity: '0.9',
    marginBottom: '40px',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: 'var(--cta-text)',
  },
  ctaButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  ctaButton: {
    backgroundColor: 'var(--cta-button-bg)',
    color: 'var(--button-text)',
    padding: '18px 40px',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '1.1rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    ':hover': {
      backgroundColor: 'var(--cta-button-hover)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    }
  },
};

export default Home;