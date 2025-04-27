import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenError, setTokenError] = useState('');

  // Redirect to home if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!token) {
      setTokenError('Missing password reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password2) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axiosInstance.post(
        `users/password-reset/confirm/`,
        { 
          token: token,
          password: formData.password,
          password2: formData.password2
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setIsSuccess(true);
      setMessage('Password reset successful!');
      
      // Auto-login after successful password reset
      if (response.data.access && response.data.refresh && response.data.user) {
        // Store auth data in localStorage
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
          // Force page reload to ensure the auth context picks up the new localStorage data
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(
        error.response?.data?.error || 
        error.response?.data?.password?.[0] || 
        'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password__wrapper pt-5">
      {/* Overlay */}
      <div className="reset-password__backdrop"></div>
      
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
                  <h2 className="fw-bold">Reset Password</h2>
                  <p className="text-muted">Create a new password for your account</p>
                </div>

                {tokenError ? (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {tokenError}
                    <div className="mt-3">
                      <Link to="/forgot-password" className="btn btn-primary w-100">
                        Request New Password Reset
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {message && (
                      <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`} role="alert">
                        <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                        {message}
                        {isSuccess && (
                          <div className="mt-2">
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Redirecting to dashboard...
                          </div>
                        )}
                      </div>
                    )}

                    {!isSuccess && (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">New Password</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              name="password"
                              placeholder="Enter new password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <small className="form-text text-muted">
                            Password must be at least 8 characters long and contain letters and numbers.
                          </small>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="password2" className="form-label">Confirm Password</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              id="password2"
                              name="password2"
                              placeholder="Confirm new password"
                              value={formData.password2}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <button 
                          type="submit" 
                          className="btn btn-primary w-100 py-2 mt-3"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Resetting Password...
                            </>
                          ) : 'Reset Password'}
                        </button>
                      </form>
                    )}
                  </>
                )}
                
                <div className="mt-4 text-center">
                  <p>
                    <Link to="/login" className="text-decoration-none">
                      <i className="fas fa-arrow-left me-2"></i>Back to Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;