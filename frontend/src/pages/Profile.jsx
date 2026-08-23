// src/pages/Profile.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserApi } from "../services/api";

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const payload = { name, email };
      if (password) payload.password = password;

      await updateUserApi(user._id, payload);
      setMessage("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>My Profile</h2>

        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>New Password (leave blank to keep current)</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <p>Role: {user?.role}</p>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
