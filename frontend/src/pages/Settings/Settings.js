// src/pages/Settings/Settings.js

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Camera } from "lucide-react";
import "./Settings.css";

const API_BASE = "http://localhost:8080";

const PersonalInformation = ({
  userData,
  firstName,
  lastName,
  course,
  about,
  profilePic,
  setFirstName,
  setLastName,
  setCourse,
  setAbout,
  onSave,
  onCancel,
  onUploadPhoto,
  saving,
}) => {
  const studentNumber = userData?.studentNumber || "";
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUploadPhoto(file);
    }
  };

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
                {profilePic ? (
                  <img src={`${API_BASE}${profilePic}`} alt="Profile" className="mc-avatar-img-element" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={52} color="#333" />
                )}
              </div>
            </div>
          </div>

          <button className="mc-btn mc-btn--primary" type="button" onClick={handlePhotoClick}>
            <Camera size={16} style={{ marginRight: '8px' }} />
            Change Photo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [userData, setUserData] = useState({});
  const [profileId, setProfileId] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [course, setCourse] = useState("");
  const [about, setAbout] = useState("");
  const [profilePic, setProfilePic] = useState("");

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

      const initialFirstName = student.firstName || "";
      const initialLastName = student.lastName || "";
      const initialCourse = student.course || "";
      const initialAbout = "";
      const initialProfilePic = "";

      const studentNumber = student.studentNumber;
      if (!studentNumber) {
        setProfileId(null);
        setFirstName(initialFirstName);
        setLastName(initialLastName);
        setCourse(initialCourse);
        setAbout(initialAbout);
        setProfilePic(initialProfilePic);
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

        setFirstName(fn || initialFirstName);
        setLastName(ln || initialLastName);
        setCourse(prof.campus || initialCourse);
        setAbout(prof.bio || "");
        setProfilePic(prof.profilePic || "");
      } else {
        setProfileId(null);
        setFirstName(initialFirstName);
        setLastName(initialLastName);
        setCourse(initialCourse);
        setAbout(initialAbout);
        setProfilePic(initialProfilePic);
      }
    } catch (err) {
      console.error("Failed to reload student/profile:", err);
      setProfileId(null);
      setFirstName("");
      setLastName("");
      setCourse("");
      setAbout("");
      setProfilePic("");
    }
  };

  useEffect(() => {
    resetToLoadedValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const handleUploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch(`${API_BASE}/api/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const urls = await res.json();
      if (urls.length > 0) {
        setProfilePic(urls[0]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo");
    }
  };

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
      profilePic: profilePic,
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
      window.dispatchEvent(new Event("profileUpdated"));
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

  return (
    <div className="mc-settings">
      <aside className="mc-settings__sidebar">
        <h2 className="mc-settings__title">Settings</h2>

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
            profilePic={profilePic}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setCourse={setCourse}
            setAbout={setAbout}
            onSave={handleSaveProfile}
            onCancel={resetToLoadedValues}
            onUploadPhoto={handleUploadPhoto}
            saving={saving}
          />
        )}
      </main>
    </div>
  );
}