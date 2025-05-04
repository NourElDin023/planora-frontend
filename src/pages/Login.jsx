import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for email verification query params (when user comes from verification link)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const verificationStatus = searchParams.get('verificationStatus');
    const email = searchParams.get('email');
    
    if (verificationStatus === 'failed' && email) {
      setVerificationEmail(email);
      setFormError('Your email verification failed or the link has expired. Please request a new verification link.');
    } else if (verificationStatus === 'success') {
      setFormError('');
      setResendMessage('Your email has been verified successfully! You can now log in.');
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleResendVerification = async () => {
    if (!verificationEmail) return;
    
    setResendingEmail(true);
    setResendMessage('');
    
    try {
      const response = await axiosInstance.post(`users/resend-verification/`, 
        { email: verificationEmail },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      setResendMessage(response.data.message);
    } catch (error) {
      setResendMessage('Failed to resend verification email. Please try again.');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);
    setVerificationEmail(''); // Reset verification email state
    setResendMessage('');

    try {
      // Pass the rememberMe preference to login function
      await login(formData.username, formData.password, rememberMe);
      
      // Check if there's a saved redirect path
      const redirectPath = localStorage.getItem('lifetracker_redirectPath');
      
      // Navigate to the saved path or home page
      navigate(redirectPath || '/');
      
      // Remove the saved path after use
      localStorage.removeItem('lifetracker_redirectPath');
    } catch (err) {
      console.log("Login error:", err.response?.data);
      if (err.response?.data?.verification_required) {
        // Handle case where email verification is required
        setVerificationEmail(err.response.data.email);
        setFormError('Your email address has not been verified. Please check your inbox for the verification link or request a new one.');
      } else {
        setFormError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-in__wrapper pt-5">
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img 
                    src="/src/assets/Life-Tracker-logo-Blue.png" 
                    alt="Life Tracker Logo" 
                    className="img-fluid mb-3" 
                    style={{ maxHeight: '80px' }} 
                  />
                  <h2 className="fw-bold">Welcome Back</h2>
                  <p className="text-muted">Sign in to your Planora account</p>
                </div>
                
                {formError && !verificationEmail && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {formError}
                  </div>
                )}
                
                {/* Success Message */}
                {resendMessage && !verificationEmail && (
                  <div className="alert alert-success" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {resendMessage}
                  </div>
                )}
                
                {/* Email Verification Required Message */}
                {verificationEmail && (
                  <div className="alert alert-warning" role="alert">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-envelope me-2"></i>
                      <strong>Email verification required</strong>
                    </div>
                    <p>{formError}</p>
                    
                    <div className="mt-3">
                      <button 
                        type="button" 
                        className="btn btn-primary w-100"
                        onClick={handleResendVerification}
                        disabled={resendingEmail}
                      >
                        {resendingEmail ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                          </>
                        ) : 'Resend Verification Email'}
                      </button>
                      
                      {resendMessage && (
                        <div className="alert alert-info mt-2 mb-0 py-2">
                          {resendMessage}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3 form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="rememberMe" 
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 mt-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </button>
                  
                  <div className="text-end mt-2">
                    <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                  </div>
                </form>
                
                <div className="mt-4 text-center">
                  <p>Don't have an account? <Link to="/register" className="text-decoration-none">Create an account</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;