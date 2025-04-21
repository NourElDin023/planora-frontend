import React, { useEffect, useState } from "react";
import axios from "../utils/axios"; 

const SharePageComponent = ({ pageId }) => {
  const [usernames, setUsernames] = useState([]);
  const [selectedUsernames, setSelectedUsernames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [permission, setPermission] = useState("view");
  const [mode, setMode] = useState("user");
  const [linkSettings, setLinkSettings] = useState({});
  const [sharedPageUrl, setSharedPageUrl] = useState("");

  useEffect(() => {
    axios
      .get("users/all-usernames/")
      .then((res) => {
        console.log("Fetched usernames:", res.data);
        setUsernames(res.data.usernames);
      })
      .catch((err) => {
        console.error("Failed to fetch usernames", err);
      });
  }, []);
  

  const handleAddUsername = (username) => {
    if (!selectedUsernames.includes(username)) {
      setSelectedUsernames([...selectedUsernames, username]);
    }
  };

  const handleShareWithUsers = async () => {
    try {
      const res = await axios.post("/pages/share/", {
        page_id: pageId,
        usernames: selectedUsernames,
        permission: permission,
      });
      alert("Page shared with: " + res.data.shared_with.join(", "));
      setSharedPageUrl(res.data.shared_page_url);  // Save the URL to state
    } catch (err) {
      console.error("Error sharing page:", err);
    }
  };
  

  const handleShareableLink = async () => {
    try {
      const res = await axios.post(`/pages/${pageId}/share-settings/`, {
        is_link_shareable: true,
        shareable_permission: permission,
      });
      setLinkSettings(res.data);
    } catch (err) {
      console.error("Error generating shareable link:", err);
    }
  };

  const filteredUsers = Array.isArray(usernames)
  ? usernames.filter((username) =>
      username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  return (
    <div className="card mt-4 mx-auto" style={{ maxWidth: "600px" }}>
      <div className="card-body">
        <div className="d-flex justify-content-center mb-3 gap-2">
          <button className="btn btn-outline-primary" onClick={() => setMode("user")}>
            Share With Users
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setMode("link")}>
            Generate Shareable Link
          </button>
        </div>

        {mode === "user" && (
          <>
            <label className="form-label">Search Usernames</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="border p-2 mb-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
              {filteredUsers.map((username, idx) => (
                <div
                  key={idx}
                  className="p-1 rounded hover bg-light cursor-pointer"
                  onClick={() => handleAddUsername(username)}
                >
                  {username}
                </div>
              ))}
            </div>

            <div className="mb-2">
              <label className="form-label">Selected Users:</label>
              <div className="d-flex flex-wrap gap-2">
                {selectedUsernames.map((u, i) => (
                  <span key={i} className="badge bg-secondary">
                    {u}
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

            <button className="btn btn-success" onClick={handleShareWithUsers}>
              Share Page
            </button>
            {sharedPageUrl && (
                <div className="mt-3">
                    <label className="form-label">Shared Page URL:</label>
                    <div>
                    <a
                        href={sharedPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-primary"
                    >
                        {sharedPageUrl}
                    </a>
                    </div>
                </div>
                )}

          </>
        )}

        {mode === "link" && (
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
                    target="_blank"
                    rel="noopener noreferrer"
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
