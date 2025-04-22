import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from '../utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    bio: '',
    phone_number: '',
    birthdate: '',
    facebook_profile: '',
    country: '',
    profile_picture: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/users/profile/');
      const userData = response.data;
      
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        bio: userData.bio || '',
        phone_number: userData.phone_number || '',
        birthdate: userData.birthdate || '',
        facebook_profile: userData.facebook_profile || '',
        country: userData.country || '',
        profile_picture: null
      });
      
      if (userData.profile_picture) {
        setPreviewUrl(userData.profile_picture);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        profile_picture: file
      }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined && key !== 'profile_picture') {
          formData.append(key, profileData[key]);
        }
      });
      
      // Only append file if it exists
      if (profileData.profile_picture) {
        formData.append('profile_picture', profileData.profile_picture);
      }

      console.log('Submitting profile data:', Object.fromEntries(formData));

      const response = await axios.put('/users/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Profile update response:', response.data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show more detailed error message
      let errorMessage = 'Failed to update profile';
      if (error.response) {
        console.log('Error response data:', error.response.data);
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'object') {
          // Format validation errors from DRF
          const validationErrors = [];
          for (const field in error.response.data) {
            validationErrors.push(`${field}: ${error.response.data[field]}`);
          }
          if (validationErrors.length > 0) {
            errorMessage = validationErrors.join(', ');
          }
        }
      }
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Submitting password change data');
      const response = await axios.post('/users/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      console.log('Password change response:', response.data);
      
      // If tokens are returned in the response, update them
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      
      toast.success('Password changed successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error changing password:', error);
      
      // Show more detailed error message
      let errorMessage = 'Failed to change password';
      if (error.response) {
        console.log('Error response data:', error.response.data);
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'object') {
          // Format validation errors
          const validationErrors = [];
          for (const field in error.response.data) {
            if (Array.isArray(error.response.data[field])) {
              validationErrors.push(`${field}: ${error.response.data[field].join(', ')}`);
            } else {
              validationErrors.push(`${field}: ${error.response.data[field]}`);
            }
          }
          if (validationErrors.length > 0) {
            errorMessage = validationErrors.join(', ');
          }
        }
      }
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  if (loading && !profileData.username) {
    return (
      <div className="container mt-5 d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <ToastContainer />
      
      <div className="row">
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile" 
                  className="rounded-circle img-fluid" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: '150px', height: '150px' }}
                >
                  <i className="fas fa-user fa-5x text-white"></i>
                </div>
              )}
              <h5 className="my-3">{profileData.first_name} {profileData.last_name}</h5>
              <p className="text-muted mb-1">@{profileData.username}</p>
              {profileData.bio && <p className="text-muted mb-4" style={{
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>{profileData.bio}</p>}
              
              {!isEditing && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          {isEditing ? (
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="mb-4">Edit Profile</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Profile Picture</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Username</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="username" 
                        value={profileData.username}
                        onChange={handleInputChange}
                        readOnly // Username should typically not be changed
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        value={profileData.email}
                        onChange={handleInputChange}
                        readOnly // Email changes often require verification
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="first_name" 
                        value={profileData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="last_name" 
                        value={profileData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea 
                      className="form-control" 
                      name="bio" 
                      rows="3" 
                      value={profileData.bio || ''}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text">+20</span>
                        <input 
                          type="tel" 
                          className="form-control" 
                          name="phone_number" 
                          value={profileData.phone_number || ''}
                          onChange={handleInputChange}
                          placeholder="1XXXXXXXXX"
                          maxLength="10"
                          pattern="^\d{10}$"
                        />
                      </div>
                      <small className="form-text text-muted">
                        Egyptian phone number format (10 digits)
                      </small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Birthdate</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        name="birthdate" 
                        value={profileData.birthdate || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Facebook Profile</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        name="facebook_profile" 
                        value={profileData.facebook_profile || ''}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/yourusername"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Country</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="country" 
                        value={profileData.country || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span className="ms-2">Saving...</span>
                        </>
                      ) : "Save Changes"}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        fetchUserProfile(); // Reset form with original data
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Full Name</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{profileData.first_name} {profileData.last_name}</p>
                  </div>
                </div>
                <hr />
                
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Username</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{profileData.username}</p>
                  </div>
                </div>
                <hr />
                
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{profileData.email}</p>
                  </div>
                </div>
                <hr />
                
                {profileData.phone_number && (
                  <>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Phone</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">+20 {profileData.phone_number}</p>
                      </div>
                    </div>
                    <hr />
                  </>
                )}
                
                {profileData.birthdate && (
                  <>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Birthdate</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{profileData.birthdate}</p>
                      </div>
                    </div>
                    <hr />
                  </>
                )}
                
                {profileData.country && (
                  <>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Country</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{profileData.country}</p>
                      </div>
                    </div>
                    <hr />
                  </>
                )}
                
                {profileData.facebook_profile && (
                  <>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Facebook</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">
                          <a href={profileData.facebook_profile} target="_blank" rel="noreferrer">
                            {profileData.facebook_profile}
                          </a>
                        </p>
                      </div>
                    </div>
                    <hr />
                  </>
                )}
                
                {profileData.bio && (
                  <>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Bio</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{profileData.bio}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="mb-4">Change Password</h4>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="current_password" 
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="new_password" 
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="confirm_password" 
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-2">Changing Password...</span>
                    </>
                  ) : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;