// src/pages/Settings/Settings.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, Shield, LogOut } from "lucide-react";
import "./Settings.css";

const API_BASE = "http://localhost:8080";

const ToggleItem = ({ title, description, enabled = false }) => {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="toggle-item">
      <div>
        <h4 className="toggle-title">{title}</h4>
        <p className="toggle-description">{description}</p>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={isOn}
          onChange={() => setIsOn(!isOn)}
          className="toggle-checkbox"
        />
        <div className="toggle-bg">
          <span className="toggle-dot" />
        </div>
      </label>
    </div>
  );
};

const PersonalInformation = ({
  userData,
  firstName,
  lastName,
  course,
  about,
  setFirstName,
  setLastName,
  setCourse,
  setAbout,
  onSave,
  onCancel,
  saving,
}) => {
  const studentNumber = userData?.studentNumber || "";

  return (
    <>
      <header className="mc-settings__header">
        <h1 className="mc-settings__heading">Personal Information</h1>
        <p className="mc-settings__subheading">
          Update your personal details and profile information
        </p>
      </header>

      <section className="mc-profileCard">
        <div className="mc-profileCard__left">
          <div className="mc-avatar">
            <div className="mc-avatar__ring">
              <div className="mc-avatar__img" aria-hidden="true">
                <User size={52} color="#333" />
              </div>
            </div>
          </div>

          <button className="mc-btn mc-btn--primary" type="button">
            Change Photo
          </button>

          <div className="mc-studentIdBlock">
            <div className="mc-studentIdLabel">Student ID</div>
            <div className="mc-studentIdValue">{studentNumber || "—"}</div>
          </div>
        </div>

        <form
          className="mc-profileForm"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="mc-grid2">
            <div className="mc-field">
              <label className="mc-label">First Name</label>
              <input
                className="mc-input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mc-field">
              <label className="mc-label">Last Name</label>
              <input
                className="mc-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="mc-field">
            <label className="mc-label">Course / Department</label>
            <input
              className="mc-input"
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </div>

          <div className="mc-field">
            <label className="mc-label">About Me</label>
            <textarea
              className="mc-textarea"
              rows={5}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="mc-actions">
            <button className="mc-btn mc-btn--save" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="mc-btn mc-btn--cancel"
              type="button"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

const NotificationSettings = () => (
  <>
    <header className="mc-settings__header">
      <h1 className="mc-settings__heading">Notification Settings</h1>
      <p className="mc-settings__subheading">Manage your notification preferences</p>
    </header>

    <section className="mc-genericCard">
      <div className="mc-cardSection">
        <h3 className="mc-cardSubheader">Email Notifications</h3>
        <ToggleItem title="Email Notifications" description="Receive notifications via email" enabled />
        <ToggleItem title="New Messages" description="Get notified when you receive new messages" enabled />
        <ToggleItem title="Weekly Digest" description="Summary of marketplace activity" enabled />
        <ToggleItem title="Promotional Emails" description="Feature updates" enabled />
      </div>

      <div className="mc-cardSection">
        <h3 className="mc-cardSubheader">Push Notifications</h3>
        <ToggleItem title="Push Notifications" description="Enable push notifications" enabled />
        <ToggleItem title="Marketplace Updates" description="New listing alerts" enabled />
        <ToggleItem title="Bid Updates" description="Bid notifications" enabled />
      </div>

      <div className="mc-actions mc-actions--right">
        <button className="mc-btn mc-btn--cancel" type="button">
          Cancel
        </button>
        <button className="mc-btn mc-btn--save" type="button">
          Save Changes
        </button>
      </div>
    </section>
  </>
);

const SecuritySettings = () => (
  <>
    <header className="mc-settings__header">
      <h1 className="mc-settings__heading">Security and Privacy</h1>
      <p className="mc-settings__subheading">
        Manage your security settings and privacy preferences
      </p>
    </header>

    <section className="mc-genericCard">
      <div className="mc-cardSection">
        <h3 className="mc-cardSubheader">Account Security</h3>
        <ToggleItem title="Two-Factor Authentication" description="Add extra security" enabled />
        <ToggleItem title="Login Alerts" description="Get login alerts" enabled />
        <ToggleItem title="Auto Logout" description="Logout automatically" enabled />
        <ToggleItem title="Strong Password Requirements" description="Force strong passwords" enabled />
        <ToggleItem title="Device Management" description="Manage logged-in devices" enabled />
      </div>

      <div className="mc-cardSection">
        <h3 className="mc-cardSubheader">Privacy Settings</h3>
        <ToggleItem title="Profile Visibility" description="Make profile visible" enabled />
        <ToggleItem title="Activity Tracking" description="Track your activity" />
        <ToggleItem title="Data Sharing" description="Share anonymous usage data" />
        <ToggleItem title="Cookie Preferences" description="Manage cookies" />
      </div>

      <div className="mc-actions mc-actions--right">
        <button className="mc-btn mc-btn--cancel" type="button">
          Cancel
        </button>
        <button className="mc-btn mc-btn--save" type="button">
          Save Changes
        </button>
      </div>
    </section>
  </>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [userData, setUserData] = useState({});
  const [profileId, setProfileId] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [course, setCourse] = useState("");
  const [about, setAbout] = useState("");

  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");

  const resetToLoadedValues = async () => {
    if (!studentId) return;

    try {
      const resStudent = await fetch(`${API_BASE}/api/students/${encodeURIComponent(studentId)}`);
      if (!resStudent.ok) {
        const text = await resStudent.text();
        throw new Error(text || "Failed to load student data");
      }
      const student = await resStudent.json();
      setUserData(student);

      setFirstName(student.firstName || "");
      setLastName(student.lastName || "");
      setCourse(student.course || "");
      setAbout("");

      const studentNumber = student.studentNumber;
      if (!studentNumber) {
        setProfileId(null);
        return;
      }

      const resProfile = await fetch(
        `${API_BASE}/api/profiles/student/${encodeURIComponent(studentNumber)}`
      );

      if (resProfile.ok) {
        const prof = await resProfile.json();
        setProfileId(prof.id);

        const parts = (prof.fullName || "").trim().split(" ").filter(Boolean);
        const fn = parts[0] || "";
        const ln = parts.slice(1).join(" ");

        setFirstName(fn || student.firstName || "");
        setLastName(ln || student.lastName || "");
        setCourse(prof.campus || student.course || "");
        setAbout(prof.bio || "");
      } else {
        setProfileId(null);
      }
    } catch (err) {
      console.error("Failed to reload student/profile:", err);
      setProfileId(null);
    }
  };

  useEffect(() => {
    resetToLoadedValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const handleSaveProfile = async () => {
    if (saving) return;

    const studentNumber = userData?.studentNumber;
    if (!studentNumber) {
      alert("No student ID found for this user.");
      return;
    }

    const payload = {
      studentId: studentNumber,
      fullName: `${firstName} ${lastName}`.trim(),
      campus: course,
      bio: about,
    };

    try {
      setSaving(true);

      let res;
      if (profileId) {
        res = await fetch(`${API_BASE}/api/profiles/${profileId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/profiles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        alert(text || "Failed to save profile.");
        return;
      }

      const saved = await res.json();
      setProfileId(saved.id);
      alert("Profile saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fullName =
    userData.firstName || userData.lastName
      ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
      : "Loading...";

  return (
    <div className="mc-settings">
      <aside className="mc-settings__sidebar">
        <h2 className="mc-settings__title">Settings</h2>

        <div className="mc-sidebarProfile">
          <div className="mc-sidebarAvatar">
            <User size={28} color="#555" />
          </div>
          <div className="mc-sidebarMeta">
            <div className="mc-sidebarName">{fullName}</div>
            <div className="mc-sidebarId">{userData.studentNumber || ""}</div>
          </div>
        </div>

        <nav className="mc-settings__nav">
          <button
            className={`mc-settings__navItem ${activeTab === "personal" ? "is-active" : ""}`}
            onClick={() => setActiveTab("personal")}
            type="button"
          >
            <span className="mc-settings__navIcon">
              <User size={18} />
            </span>
            <span>Personal Information</span>
          </button>

          <button
            className={`mc-settings__navItem ${activeTab === "notifications" ? "is-active" : ""}`}
            onClick={() => setActiveTab("notifications")}
            type="button"
          >
            <span className="mc-settings__navIcon">
              <Bell size={18} />
            </span>
            <span>Notifications</span>
          </button>

          <button
            className={`mc-settings__navItem ${activeTab === "security" ? "is-active" : ""}`}
            onClick={() => setActiveTab("security")}
            type="button"
          >
            <span className="mc-settings__navIcon">
              <Shield size={18} />
            </span>
            <span>Security and Privacy</span>
          </button>
        </nav>

        <div className="mc-sidebarFooter">
          <button className="mc-settings__navItem mc-logout" onClick={handleLogout} type="button">
            <span className="mc-settings__navIcon">
              <LogOut size={18} />
            </span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="mc-settings__main">
        {activeTab === "personal" && (
          <PersonalInformation
            userData={userData}
            firstName={firstName}
            lastName={lastName}
            course={course}
            about={about}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setCourse={setCourse}
            setAbout={setAbout}
            onSave={handleSaveProfile}
            onCancel={resetToLoadedValues}
            saving={saving}
          />
        )}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "security" && <SecuritySettings />}
      </main>
    </div>
  );
}
