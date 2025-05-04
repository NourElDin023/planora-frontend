import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, failed
  const [message, setMessage] = useState('Verifying your email...');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  // Add a ref to track if verification has been attempted
  const verificationAttempted = useRef(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (!token) {
        setVerificationStatus('failed');
        setError('Verification token is missing.');
        return;
      }
      
      // Skip if verification was already attempted to prevent duplicate requests
      if (verificationAttempted.current) {
        return;
      }
      
      // Mark that verification has been attempted
      verificationAttempted.current = true;
      
      try {
        const response = await axiosInstance.get(`users/verify-email/?token=${token}`);
        
        if (response.data.success) {
          setVerificationStatus('success');
          setMessage(response.data.message);
          setUsername(response.data.username);
        } else {
          setVerificationStatus('failed');
          setError(response.data.error);
          if (response.data.email) {
            setEmail(response.data.email);
          }
        }
      } catch (err) {
        setVerificationStatus('failed');
        setError(err.response?.data?.error || 'Verification failed. Please try again.');
        if (err.response?.data?.email) {
          setEmail(err.response?.data?.email);
        }
      }
    };

    verifyEmail();
  }, [location.search]);

  const handleResendVerification = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendMessage('');
    
    try {
      const response = await axiosInstance.post(`users/resend-verification/`, 
        { email }, 
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
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3>Verifying your email...</h3>
            <p>This may take a moment. Please wait.</p>
          </div>
        );
        
      case 'success':
        return (
          <div className="text-center">
            <div className="verification-icon text-success mb-4">
              <i className="fas fa-check-circle fa-5x"></i>
            </div>
            <h2 className="mb-4">Email Verification Successful!</h2>
            <p className="lead mb-4">
              Congratulations, {username}! Your email has been verified and your Planora account is now active.
            </p>
            <div className="d-grid gap-2 col-md-8 mx-auto">
              <Link to="/login" className="btn btn-primary btn-lg">
                Go to Login
              </Link>
            </div>
          </div>
        );
        
      case 'failed':
        return (
          <div className="text-center">
            <div className="verification-icon text-danger mb-4">
              <i className="fas fa-times-circle fa-5x"></i>
            </div>
            <h2 className="mb-3">Email Verification Failed</h2>
            <div className="alert alert-danger mb-4">
              {error}
            </div>
            
            <p className="mb-4">
              This could be because:
            </p>
            <ul className="list-group mb-4">
              <li className="list-group-item border-0">
                <i className="fas fa-circle-exclamation me-2 text-danger"></i>
                The verification link has expired
              </li>
              <li className="list-group-item border-0">
                <i className="fas fa-circle-exclamation me-2 text-danger"></i>
                The link has already been used
              </li>
              <li className="list-group-item border-0">
                <i className="fas fa-circle-exclamation me-2 text-danger"></i>
                The verification token is invalid
              </li>
            </ul>
            
            {email && (
              <div className="mt-4 p-4 bg-light rounded">
                <h5>Need a new verification link?</h5>
                <p>We can send a new verification email to: <strong>{email}</strong></p>
                
                <button
                  className="btn btn-primary"
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending...
                    </>
                  ) : 'Resend Verification Email'}
                </button>
                
                {resendMessage && (
                  <div className="alert alert-info mt-3">
                    {resendMessage}
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4">
              <Link to="/login" className="btn btn-outline-secondary me-2">
                Back to Login
              </Link>
              <Link to="/register" className="btn btn-outline-secondary">
                Back to Register
              </Link>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="sign-in__wrapper pt-5">
      <div className="sign-in__backdrop"></div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img 
                    src="/src/assets/Life-Tracker-logo-Blue.png" 
                    alt="Life Tracker Logo" 
                    className="img-fluid mb-3" 
                    style={{ maxHeight: '80px' }} 
                  />
                  <h2 className="fw-bold">Email Verification</h2>
                </div>
                
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;