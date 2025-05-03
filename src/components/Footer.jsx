import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <div style={styles.footerColumns}>
          <div style={styles.footerColumn}>
            <h3 style={styles.columnTitle}>Life Tracker</h3>
            <p style={styles.columnText}>
              Your all-in-one personal development companion to help you track, manage, and improve every aspect of your life.
            </p>
          </div>
          
          <div style={styles.footerColumn}>
            <h3 style={styles.columnTitle}>Quick Links</h3>
            <ul style={styles.linkList}>
              <li style={styles.linkItem}>
                <Link to="/" style={styles.link}>Home</Link>
              </li>
              <li style={styles.linkItem}>
                <Link to="/features" style={styles.link}>Features</Link>
              </li>
              <li style={styles.linkItem}>
                <Link to="/pricing" style={styles.link}>Pricing</Link>
              </li>
              <li style={styles.linkItem}>
                <Link to="/about" style={styles.link}>About Us</Link>
              </li>
            </ul>
          </div>
          
          <div style={styles.footerColumn}>
            <h3 style={styles.columnTitle}>Resources</h3>
            <ul style={styles.linkList}>
              <li style={styles.linkItem}>
                <Link to="/blog" style={styles.link}>Blog</Link>
              </li>
              <li style={styles.linkItem}>
                <Link to="/help" style={styles.link}>Help Center</Link>
              </li>
              <li style={styles.linkItem}>
                <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
              </li>
              <li style={styles.linkItem}>
                <Link to="/terms" style={styles.link}>Terms of Service</Link>
              </li>
            </ul>
          </div>
          
          <div style={styles.footerColumn}>
            <h3 style={styles.columnTitle}>Connect With Us</h3>
            <div style={styles.socialLinks}>
              <a href="https://github.com" style={styles.socialLink} aria-label="GitHub">
                <FaGithub style={styles.socialIcon} />
              </a>
              <a href="https://twitter.com" style={styles.socialLink} aria-label="Twitter">
                <FaTwitter style={styles.socialIcon} />
              </a>
              <a href="https://linkedin.com" style={styles.socialLink} aria-label="LinkedIn">
                <FaLinkedin style={styles.socialIcon} />
              </a>
              <a href="mailto:contact@lifetracker.com" style={styles.socialLink} aria-label="Email">
                <FaEnvelope style={styles.socialIcon} />
              </a>
            </div>
            <p style={styles.contactText}>
              contact@lifetracker.com<br />
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>
            &copy; {new Date().getFullYear()} Life Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--footer-bg)',
    color: 'var(--footer-text)',
    padding: '60px 0 0',
    marginTop: '80px',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  footerColumns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '60px',
  },
  footerColumn: {
    padding: '0 15px',
  },
  columnTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'var(--footer-heading)',
  },
  columnText: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: 'var(--footer-text)',
    opacity: '0.8',
  },
  linkList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  linkItem: {
    marginBottom: '12px',
  },
  link: {
    color: 'var(--footer-link)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease',
    ':hover': {
      color: 'var(--footer-link-hover)',
    }
  },
  socialLinks: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  socialLink: {
    color: 'var(--footer-link)',
    fontSize: '1.2rem',
    transition: 'color 0.2s ease',
    ':hover': {
      color: 'var(--footer-link-hover)',
    }
  },
  socialIcon: {
    display: 'block',
  },
  contactText: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--footer-text)',
    opacity: '0.8',
    margin: '0',
  },
  footerBottom: {
    borderTop: '1px solid var(--footer-border)',
    padding: '25px 0',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '0.9rem',
    color: 'var(--footer-text)',
    opacity: '0.7',
    margin: '0',
  },
};

export default Footer;