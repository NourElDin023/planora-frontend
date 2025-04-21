import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/users/password-reset/',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setIsSuccess(true);
      setMessage(response.data.message || 'If the email exists in our system, a password reset link has been sent.');
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.error || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password__wrapper pt-5">
      {/* Overlay */}
      <div className="forgot-password__backdrop"></div>
      
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
                  <h2 className="fw-bold">Forgot Password</h2>
                  <p className="text-muted">Enter your email to reset your password</p>
                </div>

                {message && (
                  <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`} role="alert">
                    <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                    {message}
                  </div>
                )}

                {!isSuccess && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                          Sending...
                        </>
                      ) : 'Send Reset Link'}
                    </button>
                  </form>
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

export default ForgotPassword;