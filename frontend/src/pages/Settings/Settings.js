import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import Navigation Hook
import { User, Bell, Shield, LogOut } from "lucide-react"; // 2. Import LogOut Icon
import "./Settings.css";

const ToggleItem = ({ title, description, enabled = false }) => {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="toggle-item">
      <div>
        <h4 className="toggle-title">{title}</h4>
        <p className="toggle-description">{description}</p>
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={isOn} onChange={() => setIsOn(!isOn)} className="toggle-checkbox" />
        <div className="toggle-bg"><span className="toggle-dot" /></div>
      </label>
    </div>
  );
};

// Note: Passing 'userData' prop to pre-fill the form
const PersonalInformation = ({ userData }) => (
  <>
    <h2 className="content-title">Personal Information</h2>
    <p className="content-subtitle">Update your personal details and profile information</p>

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
              <input type="text" defaultValue={userData.firstName || ""} />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" defaultValue={userData.lastName || ""} />
            </div>
            <div className="col-span-2">
              <label>Student ID</label>
              <input type="text" value={userData.studentNumber || ""} disabled className="disabled-input"/>
            </div>
            <div className="col-span-2">
              <label>Course / Department</label>
              <input type="text" defaultValue={userData.course || ""} />
            </div>
            <div className="col-span-2">
              <label>About Me</label>
              <textarea rows="5" placeholder="Tell us about yourself..." />
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







export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [userData, setUserData] = useState({}); // Store fetched user data
  const navigate = useNavigate();

  const studentId = localStorage.getItem("studentId");

  // 1. FETCH USER DATA ON LOAD
  useEffect(() => {
    if(studentId) {
        fetch(`http://localhost:8080/api/students/${studentId}`)
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error("Failed to load profile:", err));
    }
  }, [studentId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="settings-wrapper">
      <aside className="settings-sidebar">
        
        {/* 2. NEW: SIDEBAR PROFILE HEADER (The "Header type thing") */}
        <div className="sidebar-profile-header" style={{ padding: '20px', borderBottom: '1px solid #eee', marginBottom: '10px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ddd', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={30} color="#555" />
            </div>
            <h3 style={{ fontSize: '16px', margin: '0', fontWeight: 'bold' }}>{userData.firstName ? `${userData.firstName} ${userData.lastName}` : "Loading..."}</h3>
            <p style={{ fontSize: '12px', color: '#777', margin: '5px 0 0' }}>{userData.studentNumber}</p>
        </div>
        {/* ------------------------------------------------------- */}

        <button className={`sidebar-item ${activeTab === "personal" ? "active" : ""}`} onClick={() => setActiveTab("personal")}>
          <User size={20} /> Personal Information
        </button>

        <button className={`sidebar-item ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
          <Bell size={20} /> Notifications
        </button>

        <button className={`sidebar-item ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
          <Shield size={20} /> Security and Privacy
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <button 
                className="sidebar-item" 
                onClick={handleLogout}
                style={{ color: '#dc3545', fontWeight: 'bold' }}
            >
            <LogOut size={20} /> Log Out
            </button>
        </div>
      </aside>

      <main className="settings-content">
        {/* Pass userData to the form */}
        {activeTab === "personal" && <PersonalInformation userData={userData} />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "security" && <SecuritySettings />}
      </main>
    </div>
  );
}