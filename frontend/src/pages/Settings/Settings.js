import React, { useState } from "react";
import { User, Bell, Shield } from "lucide-react";
import "./Settings.css";

/* ================================
   Toggle Component
================================ */
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

/* ================================
   PERSONAL INFO
================================ */
const PersonalInformation = () => (
  <>
    <h2 className="content-title">Personal Information</h2>
    <p className="content-subtitle">
      Update your personal details and profile information
    </p>

    <div className="settings-card">
      <div className="pi-grid">
        <div className="pi-photo-col">
          <div className="pi-photo-circle">
            <User size={90} color="#333" />
          </div>
          <button className="btn btn-primary pi-btn">Change Photo</button>
        </div>

        <div className="pi-form-col">
          <div className="input-grid">
            <div>
              <label>First Name</label>
              <input type="text" defaultValue="Ralph Keane" />
            </div>

            <div>
              <label>Last Name</label>
              <input type="text" defaultValue="Maestrado" />
            </div>

            <div className="col-span-2">
              <label>Email Address</label>
              <input type="email" defaultValue="maestradoralphkeane@gmail.com" />
            </div>

            <div className="col-span-2">
              <label>Contact Number</label>
              <input type="tel" defaultValue="0916-726-9581" />
            </div>

            <div className="col-span-2">
              <label>About Me</label>
              <textarea
                rows="5"
                defaultValue="I am a 3rd-year Bachelor of Science in Information Technology student at Cebu Institute of Technology – University. Passionate about technology, innovation, and community-driven solutions, I strive to create projects that improve student life and promote collaboration. With my background in software development and problem-solving, I aim to use my skills to design systems that are practical, user-friendly, and impactful."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn btn-secondary">Cancel</button>
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  </>
);

/* ================================
   NOTIFICATIONS
================================ */
const NotificationSettings = () => (
  <>
    <h2 className="content-title">Notification Settings</h2>
    <p className="content-subtitle">Manage your notification preferences</p>

    <div className="settings-card">
      <div className="card-section">
        <h3 className="card-subheader">Email Notifications</h3>
        <ToggleItem title="Email Notifications" description="Receive notifications via email" enabled />
        <ToggleItem title="New Messages" description="Get notified when you receive new messages" enabled />
        <ToggleItem title="Weekly Digest" description="Summary of marketplace activity" enabled />
        <ToggleItem title="Promotional Emails" description="Feature updates" enabled />
      </div>

      <div className="card-section">
        <h3 className="card-subheader">Push Notifications</h3>
        <ToggleItem title="Push Notifications" description="Enable push notifications" enabled />
        <ToggleItem title="Marketplace Updates" description="New listing alerts" enabled />
        <ToggleItem title="Bid Updates" description="Bid notifications" enabled />
      </div>

      <div className="card-section">
        <h3 className="card-subheader">SMS Notifications</h3>
        <ToggleItem title="SMS Notifications" description="Text notifications" enabled />
        <ToggleItem title="Security Alerts" description="Security warnings" enabled />
        <ToggleItem title="Payment Confirmations" description="Payment messages" enabled />
      </div>

      <div className="card-actions">
        <button className="btn btn-secondary">Cancel</button>
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  </>
);

/* ================================
   SECURITY & PRIVACY
================================ */
const SecuritySettings = () => (
  <>
    <h2 className="content-title">Security and Privacy</h2>
    <p className="content-subtitle">
      Manage your security settings and privacy preferences
    </p>

    <div className="settings-card">
      <div className="card-section">
        <h3 className="card-subheader">Account Security</h3>
        <ToggleItem title="Two-Factor Authentication" description="Add extra security" enabled />
        <ToggleItem title="Login Alerts" description="Get login alerts" enabled />
        <ToggleItem title="Auto Logout" description="Logout automatically" enabled />
        <ToggleItem title="Strong Password Requirements" description="Force strong passwords" enabled />
        <ToggleItem title="Device Management" description="Manage logged-in devices" enabled />
      </div>

      <div className="card-section">
        <h3 className="card-subheader">Privacy Settings</h3>
        <ToggleItem title="Profile Visibility" description="Make profile visible" enabled />
        <ToggleItem title="Activity Tracking" description="Track your activity" />
        <ToggleItem title="Data Sharing" description="Share anonymous usage data" />
        <ToggleItem title="Cookie Preferences" description="Manage cookies" />
      </div>

      <div className="card-actions">
        <button className="btn btn-secondary">Cancel</button>
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  </>
);

/* ================================
   MAIN SETTINGS PAGE
================================ */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="settings-wrapper">
      <aside className="settings-sidebar">
        <h1 className="sidebar-title">Settings</h1>

        <button className={`sidebar-item ${activeTab === "personal" ? "active" : ""}`} onClick={() => setActiveTab("personal")}>
          <User size={20} /> Personal Information
        </button>

        <button className={`sidebar-item ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
          <Bell size={20} /> Notifications
        </button>

        <button className={`sidebar-item ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
          <Shield size={20} /> Security and Privacy
        </button>
      </aside>

      <main className="settings-content">
        {activeTab === "personal" && <PersonalInformation />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "security" && <SecuritySettings />}
      </main>
    </div>
  );
}
