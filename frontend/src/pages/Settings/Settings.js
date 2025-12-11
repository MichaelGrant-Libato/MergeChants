// src/pages/Settings/Settings.js

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Camera, UserX } from "lucide-react";
import "./Settings.css";

const API_BASE = "http://localhost:8080";

/* ---------- constants ---------- */
const YEAR_LEVEL_OPTIONS = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "1st Year College",
  "2nd Year College",
  "3rd Year College",
  "4th Year College",
  "5th Year College",
];

const COLLEGE_COURSE_OPTIONS = [
  "(CEA) BS Architecture",
  "(CEA) BS Chemical Engineering",
  "(CEA) BS Civil Engineering",
  "(CEA) BS Computer Engineering",
  "(CEA) BS Electrical Engineering",
  "(CEA) BS Electronics Engineering",
  "(CEA) BS Industrial Engineering",
  "(CEA) BS Mechanical Engineering",
  "(CEA) BS Mining Engineering",
  "(CCS) BS Computer Science",
  "(CCS) BS Information Technology",
  "(CCS) Associate in Computer Technology",
  "(CASE) AB Communication",
  "(CASE) AB English Language",
  "(CASE) BS Mathematics",
  "(CASE) BS Biology",
  "(CASE) BS Psychology",
  "(CASE) Bachelor of Elementary Education",
  "(CASE) Bachelor of Secondary Education",
  "(CASE) Bachelor of Multimedia Arts",
  "(CMBA) BS Hospitality Management",
  "(CMBA) BS Tourism Management",
  "(CMBA) BS Accountancy",
  "(CMBA) BS Management Accounting",
  "(CMBA) BS Business Administration",
  "(CMBA) Bachelor in Public Administration",
  "(CMBA) BS Office Administration",
  "(CMBA) Associate in Office Administration",
  "(CCJ) BS Criminology",
  "(CNAHS) BS Nursing",
  "(CNAHS) BS Pharmacy",
  "(CNAHS) Diploma in Midwifery",
  "(CNAHS) Medical Technology",
];

/* ---------- PersonalInformation component ---------- */
const PersonalInformation = ({
  userData,
  firstName,
  lastName,
  course,
  outlookEmail,
  yearLevel,
  about,
  profilePic,
  setFirstName,
  setLastName,
  setCourse,
  setYearLevel,
  setAbout,
  onSaveClick,
  onCancel,
  onUploadPhoto,
  saving,
  isEditing,
  onStartEdit,
  errors,
}) => {
  const studentNumber = userData?.studentNumber || "";
  const fileInputRef = useRef(null);

  const isJuniorHigh = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
    yearLevel
  );
  const isSeniorHigh = ["Grade 11", "Grade 12"].includes(yearLevel);
  const isCollege = [
    "1st Year College",
    "2nd Year College",
    "3rd Year College",
    "4th Year College",
    "5th Year College",
  ].includes(yearLevel);

  const autoDept =
    isJuniorHigh
      ? "Junior High School Department"
      : isSeniorHigh
      ? "Senior High School Department"
      : "";

  const displayCourse = isCollege ? course : autoDept || course || "";

  const handlePhotoClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUploadPhoto(file);
    }
  };

  const handleYearLevelChange = (e) => {
    const value = e.target.value;
    setYearLevel(value);

    if (["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(value)) {
      setCourse("Junior High School Department");
    } else if (["Grade 11", "Grade 12"].includes(value)) {
      setCourse("Senior High School Department");
    } else if (
      [
        "1st Year College",
        "2nd Year College",
        "3rd Year College",
        "4th Year College",
        "5th Year College",
      ].includes(value)
    ) {
      if (!COLLEGE_COURSE_OPTIONS.includes(course)) {
        setCourse("");
      }
    } else {
      setCourse("");
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
                  <img
                    src={`${API_BASE}${profilePic}`}
                    alt="Profile"
                    className="mc-avatar-img-element"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User size={52} color="#333" />
                )}
              </div>
            </div>
          </div>

          {/* Change Photo only visible while editing */}
          {isEditing && (
            <>
              <button
                className="mc-btn mc-btn--primary"
                type="button"
                onClick={handlePhotoClick}
              >
                <Camera size={16} style={{ marginRight: "8px" }} />
                Change Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </>
          )}

          {/* Student ID pill */}
          <div className="mc-studentIdText">
            <div className="mc-studentIdLabel">Student ID</div>
            <div className="mc-studentIdValue">{studentNumber || "—"}</div>
          </div>
        </div>

        <form className="mc-profileForm">
          <div className="mc-grid2">
            <div className="mc-field">
              <label className="mc-label">First Name</label>
              <input
                className={
                  "mc-input" +
                  (!isEditing ? " mc-input--disabled" : "") +
                  (errors.firstName ? " mc-input--error" : "")
                }
                type="text"
                value={firstName}
                disabled={!isEditing}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <p className="mc-error-field">{errors.firstName}</p>
              )}
            </div>

            <div className="mc-field">
              <label className="mc-label">Last Name</label>
              <input
                className={
                  "mc-input" +
                  (!isEditing ? " mc-input--disabled" : "") +
                  (errors.lastName ? " mc-input--error" : "")
                }
                type="text"
                value={lastName}
                disabled={!isEditing}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <p className="mc-error-field">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Year Level dropdown */}
          <div className="mc-field">
            <label className="mc-label">Year Level</label>
            <select
              className={
                "mc-input" +
                (!isEditing ? " mc-input--disabled" : "") +
                (errors.yearLevel ? " mc-input--error" : "")
              }
              value={yearLevel}
              disabled={!isEditing}
              onChange={handleYearLevelChange}
            >
              <option value="">Select year level</option>
              {YEAR_LEVEL_OPTIONS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            {errors.yearLevel && (
              <p className="mc-error-field">{errors.yearLevel}</p>
            )}
          </div>

          <div className="mc-field">
            <label className="mc-label">Course / Department</label>

            {!isCollege ? (
              <>
                <input
                  className={
                    "mc-input mc-input--disabled" +
                    (errors.course ? " mc-input--error" : "")
                  }
                  type="text"
                  value={displayCourse}
                  disabled
                  readOnly
                />
                {errors.course && (
                  <p className="mc-error-field">{errors.course}</p>
                )}
              </>
            ) : (
              <>
                <select
                  className={
                    "mc-input" +
                    (!isEditing ? " mc-input--disabled" : "") +
                    (errors.course ? " mc-input--error" : "")
                  }
                  value={course}
                  disabled={!isEditing}
                  onChange={(e) => setCourse(e.target.value)}
                >
                  <option value="">Select course</option>
                  {COLLEGE_COURSE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.course && (
                  <p className="mc-error-field">{errors.course}</p>
                )}
              </>
            )}
          </div>

          <div className="mc-field">
            <label className="mc-label">CIT Outlook Email</label>
            <input
              className="mc-input mc-input--disabled"
              type="email"
              value={outlookEmail}
              disabled
            />
          </div>

          <div className="mc-field">
            <label className="mc-label">About Me</label>
            <textarea
              className={
                "mc-textarea" + (!isEditing ? " mc-input--disabled" : "")
              }
              rows={5}
              value={about}
              disabled={!isEditing}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="mc-actions">
            {isEditing ? (
              <>
                <button
                  className="mc-btn mc-btn--save"
                  type="button"
                  disabled={saving}
                  onClick={(e) => {
                    e.preventDefault();
                    onSaveClick();
                  }}
                >
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
              </>
            ) : (
              <button
                className="mc-btn mc-btn--save mc-btn--edit"
                type="button"
                onClick={onStartEdit}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

/* ---------- Blocked Users tab component ---------- */
const BlockedUsersTab = ({ blockedUsers, onUnblock }) => {
  return (
    <>
      <header className="mc-settings__header">
        <h1 className="mc-settings__heading">Blocked Users</h1>
        <p className="mc-settings__subheading">
          View and manage the people you&apos;ve blocked from messaging you.
        </p>
      </header>

      <section className="mc-blockedCard">
        {blockedUsers.length === 0 ? (
          <p className="mc-blocked-empty">
            You haven&apos;t blocked anyone yet.
          </p>
        ) : (
          <ul className="mc-blockedList">
            {blockedUsers.map((u) => (
              <li key={u.userId} className="mc-blockedItem">
                <div className="mc-blocked-left">
                  <div className="mc-blocked-avatar">
                    {u.profilePic ? (
                      <img
                        src={`${API_BASE}${u.profilePic}`}
                        alt={u.displayName}
                      />
                    ) : (
                      <UserX size={20} />
                    )}
                  </div>
                  <div className="mc-blocked-text">
                    <div className="mc-blocked-name">{u.displayName}</div>
                    <div className="mc-blocked-id">{u.userId}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mc-btn mc-btn--small"
                  onClick={() => onUnblock(u.userId)}
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        )}
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
  const [outlookEmail, setOutlookEmail] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [about, setAbout] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const [saving, setSaving] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    yearLevel: "",
    course: "",
  });

  const navigate = useNavigate();

  const clearErrors = () => {
    setErrors({
      firstName: "",
      lastName: "",
      yearLevel: "",
      course: "",
    });
  };

  /* ---------- load student + profile ---------- */
  const resetToLoadedValues = async () => {
    const storedStudentId = localStorage.getItem("studentId");
    const storedEmail = localStorage.getItem("outlookEmail");

    try {
      let resStudent = null;

      if (storedStudentId) {
        resStudent = await fetch(
          `${API_BASE}/api/students/${encodeURIComponent(storedStudentId)}`
        );

        if (!resStudent.ok && storedEmail) {
          resStudent = await fetch(
            `${API_BASE}/api/students/email/${encodeURIComponent(storedEmail)}`
          );
        }
      } else if (storedEmail) {
        resStudent = await fetch(
          `${API_BASE}/api/students/email/${encodeURIComponent(storedEmail)}`
        );
      }

      if (!resStudent || !resStudent.ok) {
        const text = resStudent ? await resStudent.text() : "";
        throw new Error(text || "Failed to load student data");
      }

      const student = await resStudent.json();
      setUserData(student);

      const initialFirstName = student.firstName || "";
      const initialLastName = student.lastName || "";
      const initialCourse = student.course || "";
      const initialOutlookEmail = student.outlookEmail || storedEmail || "";
      const initialYearLevel = student.yearLevel || "";
      const initialAbout = "";
      const initialProfilePic = "";

      const studentNumber = student.studentNumber;

      if (!studentNumber) {
        setProfileId(null);
        setFirstName(initialFirstName);
        setLastName(initialLastName);
        setCourse(initialCourse);
        setOutlookEmail(initialOutlookEmail);
        setYearLevel(initialYearLevel);
        setAbout(initialAbout);
        setProfilePic(initialProfilePic);
        clearErrors();
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
        setOutlookEmail(initialOutlookEmail);
        setYearLevel(initialYearLevel);
        setAbout(prof.bio || "");
        setProfilePic(prof.profilePic || "");
      } else {
        setProfileId(null);
        setFirstName(initialFirstName);
        setLastName(initialLastName);
        setCourse(initialCourse);
        setOutlookEmail(initialOutlookEmail);
        setYearLevel(initialYearLevel);
        setAbout(initialAbout);
        setProfilePic(initialProfilePic);
      }

      clearErrors();
    } catch (err) {
      console.error("Failed to reload student/profile:", err);
      const storedEmail2 = localStorage.getItem("outlookEmail") || "";
      setProfileId(null);
      setUserData({});
      setFirstName("");
      setLastName("");
      setCourse("");
      setOutlookEmail(storedEmail2);
      setYearLevel("");
      setAbout("");
      setProfilePic("");
      clearErrors();
    }
  };

  useEffect(() => {
    resetToLoadedValues();
  }, []);

  /* ---------- load blocked users when tab active ---------- */
  useEffect(() => {
    if (activeTab !== "blocked") return;

    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    fetch(`${API_BASE}/api/messages/blocked/${encodeURIComponent(studentId)}`)
      .then((res) => res.json())
      .then((data) => {
        setBlockedUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load blocked users:", err);
        setBlockedUsers([]);
      });
  }, [activeTab]);

  /* ---------- upload + save profile ---------- */
  const handleUploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch(`${API_BASE}/api/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const urls = await res.json();
      if (urls.length > 0) setProfilePic(urls[0]);
    } catch (err) {
      console.error(err);
    }
  };

  // validate before opening confirm modal
  const handleRequestSave = () => {
    const fn = firstName.trim();
    const ln = lastName.trim();

    const isJuniorHigh = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
      yearLevel
    );
    const isSeniorHigh = ["Grade 11", "Grade 12"].includes(yearLevel);

    let effectiveCourse = course;
    if (isJuniorHigh) {
      effectiveCourse = "Junior High School Department";
    } else if (isSeniorHigh) {
      effectiveCourse = "Senior High School Department";
    }

    const newErrors = {
      firstName: "",
      lastName: "",
      yearLevel: "",
      course: "",
    };
    let hasError = false;

    if (!fn) {
      newErrors.firstName = "First name is required.";
      hasError = true;
    }
    if (!ln) {
      newErrors.lastName = "Last name is required.";
      hasError = true;
    }
    if (!yearLevel || !YEAR_LEVEL_OPTIONS.includes(yearLevel)) {
      newErrors.yearLevel = "Please select a valid year level.";
      hasError = true;
    }

    if (!effectiveCourse || !effectiveCourse.trim()) {
      newErrors.course = "Course / Department is required.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (effectiveCourse !== course) {
      setCourse(effectiveCourse);
    }

    clearErrors();
    setShowSaveConfirm(true);
  };

  const handleSaveProfile = async () => {
    if (saving) return;

    const studentNumber = userData?.studentNumber;
    if (!studentNumber) return;

    const payload = {
      studentId: studentNumber,
      fullName:
        `${firstName}`.trim() +
        (lastName.trim() ? ` ${lastName.trim()}` : ""),
      campus: course,
      bio: about,
      profilePic: profilePic,
      yearLevel: yearLevel,
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
        console.error("Failed to save profile:", text);
        setShowSaveConfirm(false);
        return;
      }

      const saved = await res.json();
      setProfileId(saved.id);
      window.dispatchEvent(new Event("profileUpdated"));

      setIsEditing(false);
      setShowSaveConfirm(false);
      setShowSaveSuccess(true);
    } catch (err) {
      console.error(err);
      setShowSaveConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setShowSaveConfirm(false);
    setShowSaveSuccess(false);
    setIsEditing(false);
    clearErrors();
    resetToLoadedValues();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleUnblockFromSettings = async (blockedId) => {
    const myId = localStorage.getItem("studentId");
    if (!myId) return;

    if (!window.confirm(`Unblock ${blockedId}?`)) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/messages/unblock?blockerId=${encodeURIComponent(
          myId
        )}&blockedId=${encodeURIComponent(blockedId)}`,
        { method: "POST" }
      );

      if (!res.ok) return;

      setBlockedUsers((prev) => prev.filter((u) => u.userId !== blockedId));
    } catch (err) {
      console.error("Failed to unblock:", err);
    }
  };

  /* ---------- tab switching: cancel edit if needed ---------- */
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    if (isEditing) {
      setShowSaveConfirm(false);
      setShowSaveSuccess(false);
      setIsEditing(false);
      clearErrors();
      resetToLoadedValues();
    }

    setActiveTab(tab);
  };

  return (
    <div className="mc-settings">
      <aside className="mc-settings__sidebar">
        <h2 className="mc-settings__title">Settings</h2>

        <nav className="mc-settings__nav">
          <button
            className={`mc-settings__navItem ${
              activeTab === "personal" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("personal")}
            type="button"
          >
            <span className="mc-settings__navIcon">
              <User size={18} />
            </span>
            <span>Personal Information</span>
          </button>

          <button
            className={`mc-settings__navItem ${
              activeTab === "blocked" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("blocked")}
            type="button"
          >
            <span className="mc-settings__navIcon">
              <UserX size={18} />
            </span>
            <span>Blocked Users</span>
          </button>
        </nav>

        <div className="mc-sidebarFooter">
          <button
            className="mc-settings__navItem mc-logout"
            onClick={() => setShowLogoutConfirm(true)}
            type="button"
          >
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
            outlookEmail={outlookEmail}
            yearLevel={yearLevel}
            about={about}
            profilePic={profilePic}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setCourse={setCourse}
            setYearLevel={setYearLevel}
            setAbout={setAbout}
            onSaveClick={handleRequestSave}
            onCancel={handleCancelEdit}
            onUploadPhoto={handleUploadPhoto}
            saving={saving}
            isEditing={isEditing}
            onStartEdit={() => {
              clearErrors();
              setShowSaveConfirm(false);
              setShowSaveSuccess(false);
              setIsEditing(true);
            }}
            errors={errors}
          />
        )}

        {activeTab === "blocked" && (
          <BlockedUsersTab
            blockedUsers={blockedUsers}
            onUnblock={handleUnblockFromSettings}
          />
        )}
      </main>

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div className="mc-modalBackdrop">
          <div className="mc-modal">
            <h3 className="mc-modal__title">Log out</h3>
            <p className="mc-modal__text">
              Are you sure you want to log out?
            </p>
            <div className="mc-modal__actions">
              <button
                type="button"
                className="mc-btn mc-btn--cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mc-btn mc-btn--save"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save profile confirm modal */}
      {showSaveConfirm && (
        <div className="mc-modalBackdrop">
          <div className="mc-modal">
            <h3 className="mc-modal__title">Save changes?</h3>
            <p className="mc-modal__text">
              Are you sure you want to update your profile information?
            </p>
            <div className="mc-modal__actions">
              <button
                type="button"
                className="mc-btn mc-btn--cancel"
                onClick={() => setShowSaveConfirm(false)}
                disabled={saving}
              >
                No, go back
              </button>
              <button
                type="button"
                className="mc-btn mc-btn--save"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                Yes, save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save success modal */}
      {showSaveSuccess && (
        <div className="mc-modalBackdrop">
          <div className="mc-modal">
            <h3 className="mc-modal__title">Edit successful</h3>
            <p className="mc-modal__text">
              Your profile information has been updated.
            </p>
            <div className="mc-modal__actions">
              <button
                type="button"
                className="mc-btn mc-btn--save"
                onClick={() => setShowSaveSuccess(false)}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
