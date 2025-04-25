import React, { useEffect, useState } from "react";
import { useAuth } from "../store/AuthContext";

const API_BASE = "https://rasa-ai.onrender.com/api/profile";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm({ name: user.name, email: user.email, password: "" });
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {editMode ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Password (leave blank to keep unchanged)</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          <button type="button" className="ml-2 px-4 py-2 rounded border" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <div className="mb-2"><b>Name:</b> {user.name}</div>
          <div className="mb-2"><b>Email:</b> {user.email}</div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-2">Previous Analysis Reports</h3>
      <div className="space-y-4">
        {profile?.reports && profile.reports.length > 0 ? (
          profile.reports.map((report, idx) => (
            <div key={idx} className="border rounded p-4 bg-gray-50">
              <div><b>Skin Tone:</b> {report.skinTone}</div>
              <div><b>Preferences:</b> {JSON.stringify(report.preferences)}</div>
              <div><b>Recommendations:</b>
                <pre className="bg-gray-100 rounded p-2 overflow-x-auto text-xs mt-1">{JSON.stringify(report.recommendations, null, 2)}</pre>
              </div>
            </div>
          ))
        ) : (
          <div>No analysis reports found.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
