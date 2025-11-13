// frontend/src/pages/Registration/registration.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./registration.css";

const COURSES = [
    // Junior/Senior High School
    "Junior High School Department",
    "(SHS) Senior High School Department",
    // College of Engineering and Architecture (CEA)
    "(CEA) BS Architecture",
    "(CEA) BS Chemical Engineering",
    "(CEA) BS Civil Engineering",
    "(CEA) BS Computer Engineering",
    "(CEA) BS Electrical Engineering",
    "(CEA) BS Electronics Engineering",
    "(CEA) BS Industrial Engineering",
    "(CEA) BS Mechanical Engineering",
    "(CEA) BS Mining Engineering",
    // College of Computer Studies (CCS)
    "(CCS) BS Computer Science",
    "(CCS) BS Information Technology",
    "(CCS) Associate in Computer Technology",
    // College of Arts, Sciences, and Education (CASE)
    "(CASE) AB Communication",
    "(CASE) AB English Language",
    "(CASE) BS Mathematics",
    "(CASE) BS Biology",
    "(CASE) BS Psychology",
    "(CASE) Bachelor of Elementary Education",
    "(CASE) Bachelor of Secondary Education",
    "(CASE) Bachelor of Multimedia Arts",
    // College of Management, Business, and Accountancy (CMBA)
    "(CMBA) BS Hospitality Management",
    "(CMBA) BS Tourism Management",
    "(CMBA) BS Accountancy",
    "(CMBA) BS Management Accounting",
    "(CMBA) BS Business Administration",
    "(CMBA) Bachelor in Public Administration",
    "(CMBA) BS Office Administration",
    "(CMBA) Associate in Office Administration",
    // College of Criminology (CCJ)
    "(CCJ) BS Criminology",
    // College of Nursing and Allied Health Sciences (CNAHS)
    "(CNAHS) BS Nursing",
    "(CNAHS) BS Pharmacy",
    "(CNAHS) Diploma in Midwifery",
    "(CNAHS) Medical Technology",
];

const YEAR_LEVELS = [
    "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
    "1st Year College", "2nd Year College", "3rd Year College", "4th Year College", "5th Year College"
];

const INITIAL_FORM_DATA = {
    studentNumber: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    yearLevel: "",
    course: "",
    password: "",
    confirmPassword: "",
};

export default function Registration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(0);

    // FIX: Static string path pointing to the public folder root
    const backgroundImageURL = '/cit-u_background_img.jpg'; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    useEffect(() => {
        const totalFields = Object.keys(INITIAL_FORM_DATA).length;
        const filledFields = Object.values(formData).filter(v => v.trim() !== "").length;
        setProgress(Math.round((filledFields / totalFields) * 100));
    }, [formData]);


    // --- Validation Logic (Full) ---

    const validate = () => {
        let newErrors = {};
        const {
            studentNumber, firstName, middleInitial, lastName, yearLevel, course, password, confirmPassword
        } = formData;

        // 🎯 UPDATED VALIDATION for xx-xxxx-xxx format (e.g., 20-0000-001)
        if (!studentNumber.trim()) { 
            newErrors.studentNumber = "Student Number is required."; 
        } else if (!/^\d{2}-\d{4}-\d{3}$/.test(studentNumber.trim())) { 
            newErrors.studentNumber = "Invalid format. Use XX-XXXX-XXX (e.g., 20-0000-001)."; 
        }

        if (!firstName.trim()) { newErrors.firstName = "First Name is required."; }
        
        // ✅ ESLINT FIX: Removed unnecessary escape character before the dot
        if (middleInitial.trim() && !/^[A-Za-z.\s]{1,3}$/.test(middleInitial.trim())) { 
            newErrors.middleInitial = "Middle Initial is invalid."; 
        }

        if (!lastName.trim()) { newErrors.lastName = "Last Name is required."; }

        if (!yearLevel) { newErrors.yearLevel = "Year Level is required."; }
        
        if (!course) { newErrors.course = "Course/Department is required."; }

        if (password.length < 8) { newErrors.password = "Min 8 chars (upper, lower, number)."; } 
        else if (!/(?=.*\d)/.test(password)) { newErrors.password = "Must contain one number."; } 
        else if (!/(?=.*[A-Z])/.test(password)) { newErrors.password = "Must contain one uppercase letter."; } 
        else if (!/(?=.*[a-z])/.test(password)) { newErrors.password = "Must contain one lowercase letter."; }

        if (confirmPassword !== password) { newErrors.confirmPassword = "Passwords do not match."; }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Submission Handler ---

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Registration successful:", formData);
            alert("Registration Successful! Please log in with your new account.");
            // ➡️ REDIRECT to the login page after success
            navigate("/login"); 
        } else {
            console.log("Validation failed", errors);
        }
    };

    // --- Render ---

    return (
        // FIX: Set background properties inline to bypass CSS loader error
        <div 
            className="registration-bg"
            style={{ 
                backgroundImage: `url(${backgroundImageURL})`,
                backgroundSize: 'cover', 
                backgroundAttachment: 'scroll',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top center'
            }}
        >
            {/* Header section outside the form card */}
            <div className="page-header">
                <h1 className="page-title">
                    Create Your <span>MergeChants</span> Account
                </h1>
                <p className="page-subtitle">
                    Join the exclusive CIT-University marketplace <br />
                    Already have an account?{" "}
                    <Link to="/login" className="signin-link">
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="registration-overlay">
                <div className="registration-card">
                    <div className="progress-section">
                        <label>Registration Progress</label>
                        <div className="progress-bar">
                            <div
                                className="progress"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="progress-value">{progress}%</p>
                    </div>

                    <form className="registration-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="studentNumber">Student ID Number</label>
                            <input 
                                type="text" 
                                id="studentNumber" 
                                name="studentNumber"
                                value={formData.studentNumber}
                                onChange={handleChange}
                                placeholder="e.g., 20-0000-001" 
                                className={errors.studentNumber ? 'input-error' : ''}
                            />
                            {errors.studentNumber && <p className="error">{errors.studentNumber}</p>}
                        </div>

                        <div className="name-row">
                            <div className="form-group half-width">
                                <label htmlFor="firstName">First Name</label>
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter your first name" 
                                    className={errors.firstName ? 'input-error' : ''}
                                />
                                {errors.firstName && <p className="error">{errors.firstName}</p>}
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="middleInitial">Middle Initial</label>
                                <input 
                                    type="text" 
                                    id="middleInitial" 
                                    name="middleInitial"
                                    value={formData.middleInitial}
                                    onChange={handleChange}
                                    placeholder="e.g., A or A." 
                                    className={errors.middleInitial ? 'input-error' : ''}
                                />
                                {errors.middleInitial && <p className="error">{errors.middleInitial}</p>}
                            </div>
                        </div>

                        <div className="name-row">
                            <div className="form-group half-width">
                                <label htmlFor="lastName">Last Name</label>
                                <input 
                                    type="text" 
                                    id="lastName" 
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter your last name" 
                                    className={errors.lastName ? 'input-error' : ''}
                                />
                                {errors.lastName && <p className="error">{errors.lastName}</p>}
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="yearLevel">Year Level</label>
                                <select
                                    id="yearLevel"
                                    name="yearLevel"
                                    value={formData.yearLevel}
                                    onChange={handleChange}
                                    className={errors.yearLevel ? 'input-error' : ''}
                                >
                                    <option value="">Select year level</option>
                                    {YEAR_LEVELS.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                                {errors.yearLevel && <p className="error">{errors.yearLevel}</p>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="course">Course/Department</label>
                            <select
                                id="course"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className={errors.course ? 'input-error' : ''}
                            >
                                <option value="">Select your course or department</option>
                                {COURSES.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                            {errors.course && <p className="error">{errors.course}</p>}
                        </div>

                        <div className="name-row">
                            <div className="form-group half-width">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password" 
                                    className={errors.password ? 'input-error' : ''}
                                />
                                {errors.password && <p className="error">{errors.password}</p>}
                            </div>
                            <div className="form-group half-width">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter password" 
                                    className={errors.confirmPassword ? 'input-error' : ''}
                                />
                                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">
                            Register Account →
                        </button>

                        <p className="terms">
                            By signing up, you agree to our{" "}
                            <a href="/" onClick={(e) => e.preventDefault()}>Terms and Conditions</a>.
                        </p>

                        <div className="footer-info">
                            <p>📞 266-8888 (Reception)</p>
                            <p>© CIT-U Verified Platform</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}