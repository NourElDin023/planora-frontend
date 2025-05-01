import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const SharePageComponent = ({ pageId, onClose  }) => {
  const [usernames, setUsernames] = useState([]);
  const [selectedUsernames, setSelectedUsernames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [permission, setPermission] = useState('view');
  const [mode, setMode] = useState('user');
  const [linkSettings, setLinkSettings] = useState({});
  const [sharedPageUrl, setSharedPageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch usernames
    axios
      .get('users/all-usernames/')
      .then((res) => {
        setUsernames(res.data.usernames);
      })
      .catch((err) => {
        console.error('Failed to fetch usernames', err);
      });

    // Fetch current sharing state
    axios
      .get(`/collections/${pageId}/get-share-settings/`)
      .then((res) => {
        setLinkSettings(res.data);
        if (res.data.is_link_shareable) {
          setMode('link');
        } else {
          axios
            .get(`/collections/${pageId}/shared-users/`)
            .then((resShared) => {
              if (resShared.data.shared_users.length > 0) {
                setMode('user');
                setSelectedUsernames(resShared.data.shared_users);
              } else {
                setMode('private');
              }
            })
            .catch((err) => console.error('Failed to fetch shared users', err));
        }
      })
      .catch((err) => console.error('Failed to fetch link settings', err));
  }, [pageId]);

  const handleMakePrivate = async () => {
    try {
      await axios.post(`/collections/${pageId}/share-settings/`, {
        is_link_shareable: false,
        shareable_permission: permission,
      });
      await axios.post(`/collections/${pageId}/unshare-all/`);
      alert('Page is now private.');
      setMode('private');
      setLinkSettings({ is_link_shareable: false });
      setSelectedUsernames([]);
    } catch (err) {
      console.error('Error making page private:', err);
    }
  };

  const handleAddUsername = (username) => {
    if (!selectedUsernames.includes(username)) {
      setSelectedUsernames([...selectedUsernames, username]);
    }
  };

  const handleShareableLink = async () => {
    try {
      await axios.post(`/collections/${pageId}/unshare-all/`);
      const res = await axios.post(`/collections/${pageId}/share-settings/`, {
        is_link_shareable: true,
        shareable_permission: permission,
      });
      setLinkSettings(res.data);
      setMode('link');
      alert("Link sharing enabled!");
    } catch (err) {
      console.error("Error generating shareable link:", err);
    }
  };

  const handleShareWithUsers = async () => {
    try {
      await axios.post(`/collections/${pageId}/share-settings/`, {
        is_link_shareable: false,
        shareable_permission: permission,
      });
      const res = await axios.post("/collections/share/", {
        page_id: pageId,
        usernames: selectedUsernames,
        permission: permission,
      });
      alert("Page shared with: " + res.data.shared_with.join(", "));
      setMode('user');
    } catch (err) {
      console.error("Error sharing page:", err);
    }
  };

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    // Extract the path from the full URL
    const url = new URL(link);
    navigate(url.pathname);
  };

  const filteredUsers = Array.isArray(usernames)
    ? usernames.filter((username) =>
        username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="card mt-4 mx-auto" style={{ maxWidth: '600px' }}>
    {/* Add header with back button */}
    <div className="card-header d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Share Settings</h5>
      <button 
        onClick={onClose}
        className="btn btn-link text-decoration-none"
        style={{ color: '#7D26CD' }}
      >
        <i className="fas fa-arrow-left me-2"></i>
        Back to Collection
      </button>
    </div>

      <div className="card-body">
        <div className="d-flex justify-content-center mb-3 gap-2">
          <div
            className="btn-group d-flex justify-content-center mb-3"
            role="group"
          >
            <button
              className={`btn ${
                mode === 'private' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setMode('private')}
            >
              Private
            </button>
            <button
              className={`btn ${
                mode === 'link' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setMode('link')}
            >
              Link
            </button>
            <button
              className={`btn ${
                mode === 'user' ? 'btn-primary' : 'btn-outline-info'
              }`}
              onClick={() => setMode('user')}
            >
              Users
            </button>
          </div>
        </div>
        {mode === 'private' && (
          <div className="mt-3">
            <p className="text-muted">This page is private and only accessible by you.</p>
            <button className="btn btn-success" onClick={handleMakePrivate}>
              Confirm Private
            </button>
          </div>
        )}
{mode === 'user' && (
  <>
    <label className="form-label">Search Usernames </label>
    <input
      type="text"
      className="form-control mb-2"
      placeholder="Start typing to search users..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      minLength={2}
    />

    {/* Only show user list when 3+ characters entered */}
    {searchTerm.length >= 2 && (
      <div
        className="border p-2 mb-2"
        style={{ maxHeight: '150px', overflowY: 'auto' }}
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((username, idx) => (
            <div
              key={idx}
              className="p-1 rounded hover bg-light cursor-pointer"
              onClick={() => handleAddUsername(username)}
            >
              {username}
            </div>
          ))
        ) : (
          <div className="p-1 text-muted">
            {usernames.length === 0 
              ? "Loading users..." 
              : "No matching users found"}
          </div>
        )}
      </div>
    )}

    <div className="mb-2">
      <label className="form-label">Selected Users:</label>
      <div className="d-flex flex-wrap gap-2">
        {selectedUsernames.map((u, i) => (
          <span key={i} className="badge bg-secondary d-flex align-items-center">
            {u}
            <button 
              onClick={() => setSelectedUsernames(selectedUsernames.filter(user => user !== u))}
              className="ms-2 btn btn-sm p-0"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">Permission</label>
      <select
        className="form-select"
        value={permission}
        onChange={(e) => setPermission(e.target.value)}
      >
        <option value="view">View</option>
        <option value="edit">Edit</option>
      </select>
    </div>

    <button 
      className="btn btn-success" 
      onClick={handleShareWithUsers}
      disabled={selectedUsernames.length === 0}
    >
      Share Page
    </button>
            {sharedPageUrl && (
              <div className="mt-3">
                <label className="form-label">Shared Page URL:</label>
                <div>
                  <a
                    href={sharedPageUrl}
                    onClick={(e) => handleLinkClick(e, sharedPageUrl)}
                    className="link-primary"
                  >
                    {sharedPageUrl}
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        {mode === 'link' && (
          <>
            <div className="mb-3">
              <label className="form-label">Permission</label>
              <select
                className="form-select"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
              </select>
            </div>

            <button className="btn btn-warning" onClick={handleShareableLink}>
              Generate Link
            </button>

            {linkSettings.shareable_link_url && (
              <div className="mt-3">
                <label className="form-label">Shareable Link:</label>
                <div>
                  <a
                    href={linkSettings.shareable_link_url}
                    onClick={(e) => handleLinkClick(e, linkSettings.shareable_link_url)}
                    className="link-primary"
                  >
                    {linkSettings.shareable_link_url}
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SharePageComponent;