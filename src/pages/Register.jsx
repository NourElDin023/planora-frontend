import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.password2) {
      setFormError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      setRegistrationSuccess(true);
      // Don't navigate away - show verification instructions instead
    } catch (err) {
      if (err.response?.data) {
        // Format error messages from the backend
        const errors = err.response.data;
        const errorMessages = [];
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            errorMessages.push(`${key}: ${errors[key].join(' ')}`);
          } else {
            errorMessages.push(`${key}: ${errors[key]}`);
          }
        }
        setFormError(errorMessages.join('\n'));
      } else {
        setFormError('Registration failed. Please try again.');
      }
      setRegistrationSuccess(false);
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
          <div className="col-md-8 col-lg-6">
            {registrationSuccess ? (
              <div className="card shadow-lg border-0">
                <div className="card-body p-5 text-center">
                  <div className="text-success mb-4">
                    <i className="fas fa-envelope-open-text fa-4x"></i>
                  </div>
                  <h2 className="fw-bold mb-3">Verify Your Email</h2>
                  <p className="mb-4">
                    Thanks for registering! We've sent a verification link to <strong>{formData.email}</strong>.
                  </p>
                  <p className="mb-4">
                    Please check your inbox and click on the verification link to activate your account.
                    If you don't see the email, please check your spam folder.
                  </p>
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    You must verify your email before you can log in to your account.
                  </div>
                </div>
              </div>
            ) : (
              <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <img 
                      src="/src/assets/Life-Tracker-logo-Blue.png" 
                      alt="Life Tracker Logo" 
                      className="img-fluid mb-3" 
                      style={{ maxHeight: '80px' }} 
                    />
                    <h2 className="fw-bold">Create Your Account</h2>
                    <p className="text-muted">Join Planora to organize your life</p>
                  </div>
                  
                  {formError && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{formError}</pre>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
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
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
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
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="first_name" className="form-label">First Name</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fas fa-id-card"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            name="first_name"
                            placeholder="Enter your first name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fas fa-id-card"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="last_name"
                            name="last_name"
                            placeholder="Enter your last name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
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
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
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
                            placeholder="Confirm your password"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3 form-check">
                      <input type="checkbox" className="form-check-input" id="termsAgree" required />
                      <label className="form-check-label" htmlFor="termsAgree">
                        I agree to the <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
                      </label>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 py-2 mt-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : 'Create Account'}
                    </button>
                    
                    <div className="mt-4 text-center">
                      <p>Already have an account? <Link to="/login" className="text-decoration-none">Sign in</Link></p>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;