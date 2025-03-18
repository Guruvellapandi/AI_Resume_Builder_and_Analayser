import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/ResumeEditor.css";

const ResumeEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTemplate = location.state?.template;
  const resumeRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [formErrors, setFormErrors] = useState({});
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);
  
  // Initialize selectedTemplate state from location or localStorage
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const savedTemplate = localStorage.getItem("selectedTemplate");
    return initialTemplate || (savedTemplate ? JSON.parse(savedTemplate) : null);
  });

  // Initialize resumeData from localStorage or default values
  const [resumeData, setResumeData] = useState(() => {
    const savedData = localStorage.getItem("resumeData");
    return savedData ? JSON.parse(savedData) : {
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        address: "",
        linkedIn: "",
        website: ""
      },
      summary: "",
      experience: [
        {
          id: 1,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [""]
        }
      ],
      education: [
        {
          id: 1,
          institution: "",
          degree: "",
          graduationDate: "",
          gpa: "",
          description: ""
        }
      ],
      skills: [""]
    };
  });

  // Fetch templates on component mount
  useEffect(() => {
    // Mock API call - replace with actual API in production
    fetchTemplates();
  }, []);

  // Auto-save on resumeData or selectedTemplate change
  useEffect(() => {
    const autoSaveData = () => {
      setSaveStatus("Saving...");
      try {
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
        localStorage.setItem("selectedTemplate", JSON.stringify(selectedTemplate));
        setTimeout(() => setSaveStatus("Saved"), 600);
      } catch (error) {
        console.error("Error saving data:", error);
        setSaveStatus("Save failed");
      }
    };

    const timeoutId = setTimeout(autoSaveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [resumeData, selectedTemplate]);

  // Mock function to fetch available templates
  const fetchTemplates = async () => {
    // In a real app, this would be an API call
    const mockTemplates = [
      { id: 1, name: "Professional", image: "/assets/professional.jpg", primaryColor: "#0070f3" },
      { id: 2, name: "Creative", image: "/assets/creative.jpg", primaryColor: "#6b46c1" },
      { id: 3, name: "Minimal", image: "/assets/classic.jpg", primaryColor: "#2c3e50" },
      { id: 4, name: "Modern", image: "/assets/modern.jpg", primaryColor: "#38a169" }
    ];
    setAvailableTemplates(mockTemplates);
  };

  // Handle when no template is selected
  if (!selectedTemplate) {
    return (
      <div className="text-center mt-10 text-red-500 text-xl font-semibold">
        ⚠ No template selected. <br />
        <button 
          onClick={() => navigate("/")} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back & Select Template
        </button>
      </div>
    );
  }

  // Handle form field validation
  const validateField = (field, value) => {
    if (!value || value.trim() === "") {
      return `${field} is required`;
    }
    
    if (field === "Email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Invalid email format";
      }
    }
    
    if (field === "Phone" && value) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(value)) {
        return "Invalid phone format";
      }
    }
    
    return null;
  };

  // Personal info changes with validation
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    
    // Validate field
    const fieldName = name.charAt(0).toUpperCase() + name.slice(1);
    const error = validateField(fieldName, value);
    
    setFormErrors({
      ...formErrors,
      [name]: error
    });
    
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [name]: value
      }
    });
  };

  // Handle summary changes
  const handleSummaryChange = (e) => {
    setResumeData({
      ...resumeData,
      summary: e.target.value
    });
  };

  // Handle experience changes with validation
  const handleExperienceChange = (id, field, value) => {
    // Validate required fields
    if (["company", "position", "startDate"].includes(field)) {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      const error = validateField(fieldName, value);
      
      setFormErrors({
        ...formErrors,
        [`exp_${id}_${field}`]: error
      });
    }
    
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  // Add new experience entry
  const addExperience = () => {
    const newId = resumeData.experience.length > 0 
      ? Math.max(...resumeData.experience.map(exp => exp.id)) + 1 
      : 1;
    
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: newId,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [""]
        }
      ]
    });
  };

  // Remove experience entry
  const removeExperience = (id) => {
    // Clear any validation errors for this experience
    const newErrors = { ...formErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`exp_${id}_`)) {
        delete newErrors[key];
      }
    });
    setFormErrors(newErrors);
    
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  // Add achievement to experience
  const addAchievement = (expId) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => {
        if (exp.id === expId) {
          return {
            ...exp,
            achievements: [...exp.achievements, ""]
          };
        }
        return exp;
      })
    });
  };

  // Update achievement
  const handleAchievementChange = (expId, index, value) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => {
        if (exp.id === expId) {
          const updatedAchievements = [...exp.achievements];
          updatedAchievements[index] = value;
          return {
            ...exp,
            achievements: updatedAchievements
          };
        }
        return exp;
      })
    });
  };

  // Remove achievement
  const removeAchievement = (expId, index) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => {
        if (exp.id === expId) {
          const updatedAchievements = [...exp.achievements];
          updatedAchievements.splice(index, 1);
          return {
            ...exp,
            achievements: updatedAchievements
          };
        }
        return exp;
      })
    });
  };

  // Handle education changes with validation
  const handleEducationChange = (id, field, value) => {
    // Validate required fields
    if (["institution", "degree"].includes(field)) {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      const error = validateField(fieldName, value);
      
      setFormErrors({
        ...formErrors,
        [`edu_${id}_${field}`]: error
      });
    }
    
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  // Add new education entry
  const addEducation = () => {
    const newId = resumeData.education.length > 0 
      ? Math.max(...resumeData.education.map(edu => edu.id)) + 1 
      : 1;
    
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: newId,
          institution: "",
          degree: "",
          graduationDate: "",
          gpa: "",
          description: ""
        }
      ]
    });
  };

  // Remove education entry
  const removeEducation = (id) => {
    // Clear any validation errors for this education
    const newErrors = { ...formErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`edu_${id}_`)) {
        delete newErrors[key];
      }
    });
    setFormErrors(newErrors);
    
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  // Handle skills changes
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills[index] = value;
    setResumeData({
      ...resumeData,
      skills: updatedSkills
    });
  };

  // Add new skill
  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ""]
    });
  };

  // Remove skill
  const removeSkill = (index) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills.splice(index, 1);
    setResumeData({
      ...resumeData,
      skills: updatedSkills
    });
  };

  // Switch template
  const switchTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateSwitcher(false);
    toast.success(`Template switched to ${template.name}`);
  };

  // Export to PDF
  const exportToPDF = async () => {
    if (!resumeRef.current) return;
    
    try {
      setIsExporting(true);
      
      // Validate required fields before export
      const requiredFieldsErrors = validateRequiredFields();
      if (Object.keys(requiredFieldsErrors).length > 0) {
        setFormErrors(requiredFieldsErrors);
        toast.error("Please fill in all required fields before exporting");
        setIsExporting(false);
        return;
      }
      
      // Navigate to preview with current data and capture PDF there
      navigate("/resume-preview", { 
        state: { 
          template: selectedTemplate, 
          resumeData,
          exportPDF: true
        } 
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF. Please try again.");
      setIsExporting(false);
    }
  };

  // Validate all required fields
  const validateRequiredFields = () => {
    const errors = {};
    
    // Personal info validation
    ["name", "email", "phone"].forEach(field => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      const error = validateField(fieldName, resumeData.personalInfo[field]);
      if (error) errors[field] = error;
    });
    
    // Experience validation
    resumeData.experience.forEach(exp => {
      ["company", "position", "startDate"].forEach(field => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        const error = validateField(fieldName, exp[field]);
        if (error) errors[`exp_${exp.id}_${field}`] = error;
      });
    });
    
    // Education validation
    resumeData.education.forEach(edu => {
      ["institution", "degree"].forEach(field => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        const error = validateField(fieldName, edu[field]);
        if (error) errors[`edu_${edu.id}_${field}`] = error;
      });
    });
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const errors = validateRequiredFields();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the errors before proceeding");
      return;
    }
    
    // If validation passes, navigate to preview
    navigate("/resume-preview", { state: { template: selectedTemplate, resumeData } });
  };

  // Reset form data
  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset all form data? This cannot be undone.")) {
      localStorage.removeItem("resumeData");
      setResumeData({
        personalInfo: {
          name: "",
          title: "",
          email: "",
          phone: "",
          address: "",
          linkedIn: "",
          website: ""
        },
        summary: "",
        experience: [
          {
            id: 1,
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
            achievements: [""]
          }
        ],
        education: [
          {
            id: 1,
            institution: "",
            degree: "",
            graduationDate: "",
            gpa: "",
            description: ""
          }
        ],
        skills: [""]
      });
      setFormErrors({});
      toast.info("Form data has been reset");
    }
  };

  return (
    <div className="resume-editor">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="editor-header">
        <h1 className="editor-title">📝 Edit Your Resume</h1>
        <div className="save-status">
          <span className={`save-indicator ${saveStatus === 'Saved' ? 'saved' : saveStatus === 'Saving...' ? 'saving' : 'error'}`}></span>
          {saveStatus}
        </div>
      </div>
      
      <div className="editor-actions-top">
        <button 
          type="button" 
          onClick={() => setShowTemplateSwitcher(!showTemplateSwitcher)}
          className="action-button template-switch-button"
        >
          <span className="button-icon">🎨</span> Switch Template
        </button>
        <button 
          type="button" 
          onClick={exportToPDF}
          className="action-button export-button"
          disabled={isExporting}
        >
          <span className="button-icon">📄</span> {isExporting ? 'Exporting...' : 'Export to PDF'}
        </button>
        <button 
          type="button" 
          onClick={resetForm}
          className="action-button reset-button"
        >
          <span className="button-icon">🔄</span> Reset Form
        </button>
      </div>

      {showTemplateSwitcher && (
        <div className="template-switcher">
          <h3>Select a Template</h3>
          <div className="template-grid">
            {availableTemplates.map(template => (
              <div 
                key={template.id} 
                className={`template-card ${selectedTemplate.id === template.id ? 'selected' : ''}`}
                onClick={() => switchTemplate(template)}
              >
                <img src={template.image} alt={template.name} />
                <div className="template-name">{template.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="editor-container">
        <div className="editor-form">
          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="section">
              <h2 className="section-title">Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="name" 
                    value={resumeData.personalInfo.name} 
                    onChange={handlePersonalInfoChange} 
                    placeholder="John Doe"
                    className={formErrors.name ? "error" : ""}
                  />
                  {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Professional Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={resumeData.personalInfo.title} 
                    onChange={handlePersonalInfoChange}
                    placeholder="Software Engineer" 
                  />
                </div>
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input 
                    type="email" 
                    name="email" 
                    value={resumeData.personalInfo.email} 
                    onChange={handlePersonalInfoChange}
                    placeholder="john.doe@example.com"
                    className={formErrors.email ? "error" : ""}
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Phone <span className="required">*</span></label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={resumeData.personalInfo.phone} 
                    onChange={handlePersonalInfoChange}
                    placeholder="(123) 456-7890"
                    className={formErrors.phone ? "error" : ""}
                  />
                  {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={resumeData.personalInfo.address} 
                    onChange={handlePersonalInfoChange}
                    placeholder="City, State" 
                  />
                </div>
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input 
                    type="text" 
                    name="linkedIn" 
                    value={resumeData.personalInfo.linkedIn} 
                    onChange={handlePersonalInfoChange}
                    placeholder="linkedin.com/in/johndoe" 
                  />
                </div>
                <div className="form-group">
                  <label>Website/Portfolio</label>
                  <input 
                    type="text" 
                    name="website" 
                    value={resumeData.personalInfo.website} 
                    onChange={handlePersonalInfoChange}
                    placeholder="johndoe.com" 
                  />
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="section">
              <h2 className="section-title">Professional Summary</h2>
              <div className="form-group">
                <textarea 
                  name="summary" 
                  value={resumeData.summary} 
                  onChange={handleSummaryChange}
                  placeholder="Brief overview of your qualifications and career objectives..."
                  rows="4"
                />
              </div>
            </div>

            {/* Experience Section */}
            <div className="section">
              <h2 className="section-title">Work Experience</h2>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="subsection">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Company <span className="required">*</span></label>
                      <input 
                        type="text" 
                        value={exp.company} 
                        onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                        placeholder="Company Name"
                        className={formErrors[`exp_${exp.id}_company`] ? "error" : ""}
                      />
                      {formErrors[`exp_${exp.id}_company`] && 
                        <span className="error-message">{formErrors[`exp_${exp.id}_company`]}</span>}
                    </div>
                    <div className="form-group">
                      <label>Position <span className="required">*</span></label>
                      <input 
                        type="text" 
                        value={exp.position} 
                        onChange={(e) => handleExperienceChange(exp.id, "position", e.target.value)}
                        placeholder="Job Title"
                        className={formErrors[`exp_${exp.id}_position`] ? "error" : ""}
                      />
                      {formErrors[`exp_${exp.id}_position`] && 
                        <span className="error-message">{formErrors[`exp_${exp.id}_position`]}</span>}
                    </div>
                    <div className="form-group">
                      <label>Start Date <span className="required">*</span></label>
                      <input 
                        type="text" 
                        value={exp.startDate} 
                        onChange={(e) => handleExperienceChange(exp.id, "startDate", e.target.value)}
                        placeholder="MM/YYYY"
                        className={formErrors[`exp_${exp.id}_startDate`] ? "error" : ""}
                      />
                      {formErrors[`exp_${exp.id}_startDate`] && 
                        <span className="error-message">{formErrors[`exp_${exp.id}_startDate`]}</span>}
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input 
                        type="text" 
                        value={exp.endDate} 
                        onChange={(e) => handleExperienceChange(exp.id, "endDate", e.target.value)}
                        placeholder="MM/YYYY or Present" 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Job Description</label>
                    <textarea 
                      value={exp.description} 
                      onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                      placeholder="Describe your responsibilities..."
                      rows="3"
                    />
                  </div>
                  
                  <div className="nested-section">
                    <label>Key Achievements</label>
                    {exp.achievements.map((achievement, index) => (
                      <div key={index} className="achievement-entry">
                        <input 
                          type="text" 
                          value={achievement} 
                          onChange={(e) => handleAchievementChange(exp.id, index, e.target.value)}
                          placeholder="Achievement or contribution" 
                        />
                        {exp.achievements.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeAchievement(exp.id, index)}
                            className="small-button remove-button"
                          >
                            -
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addAchievement(exp.id)}
                      className="small-button add-button"
                    >
                      + Add Achievement
                    </button>
                  </div>
                  
                  {resumeData.experience.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeExperience(exp.id)}
                      className="remove-section-button"
                    >
                      Remove Job
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addExperience}
                className="add-section-button"
              >
                + Add Work Experience
              </button>
            </div>

            {/* Education Section */}
            <div className="section">
              <h2 className="section-title">Education</h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="subsection">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Institution <span className="required">*</span></label>
                      <input 
                        type="text" 
                        value={edu.institution} 
                        onChange={(e) => handleEducationChange(edu.id, "institution", e.target.value)}
                        placeholder="University Name"
                        className={formErrors[`edu_${edu.id}_institution`] ? "error" : ""}
                      />
                      {formErrors[`edu_${edu.id}_institution`] && 
                        <span className="error-message">{formErrors[`edu_${edu.id}_institution`]}</span>}
                    </div>
                    <div className="form-group">
                      <label>Degree <span className="required">*</span></label>
                      <input 
                        type="text" 
                        value={edu.degree} 
                        onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                        placeholder="Bachelor of Science in Computer Science"
                        className={formErrors[`edu_${edu.id}_degree`] ? "error" : ""}
                      />
                      {formErrors[`edu_${edu.id}_degree`] && 
                        <span className="error-message">{formErrors[`edu_${edu.id}_degree`]}</span>}
                    </div>
                    <div className="form-group">
                      <label>Graduation Date</label>
                      <input 
                        type="text" 
                        value={edu.graduationDate} 
                        onChange={(e) => handleEducationChange(edu.id, "graduationDate", e.target.value)}
                        placeholder="MM/YYYY" 
                      />
                    </div>
                    <div className="form-group">
                      <label>GPA (Optional)</label>
                      <input 
                        type="text" 
                        value={edu.gpa} 
                        onChange={(e) => handleEducationChange(edu.id, "gpa", e.target.value)}
                        placeholder="3.8/4.0" 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description (Optional)</label>
                    <textarea 
                      value={edu.description} 
                      onChange={(e) => handleEducationChange(edu.id, "description", e.target.value)}
                      placeholder="Relevant coursework, honors, activities..."
                      rows="3"
                    />
                  </div>
                  
                  {resumeData.education.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEducation(edu.id)}
                      className="remove-section-button"
                    >
                      Remove Education
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addEducation}
                className="add-section-button"
              >
                + Add Education
              </button>
            </div>

            {/* Skills Section */}
            <div className="section">
              <h2 className="section-title">Skills</h2>
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="skill-entry">
                  <input 
                    type="text" 
                    value={skill} 
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="Enter a skill (e.g., JavaScript, Project Management)" 
                  />
                  {resumeData.skills.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeSkill(index)}
                      className="small-button remove-button"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addSkill}
                className="small-button add-button"
              >
                + Add Skill
              </button>
            </div>

            <div className="editor-actions">
              <button 
                type="button" 
                onClick={() => navigate("/")}
                className="secondary-button"
              >
                Back to Templates
              </button>
              <button 
                type="submit"
                className="primary-button"
              >
                Preview Resume
              </button>
            </div>
          </form>
        </div>
        
        <div className="resume-preview">
          <h3 className="preview-title">Template Preview</h3>
          <div ref={resumeRef} className="template-preview-container">
            <img
              src={selectedTemplate.image}
              alt="Selected Template"
              className="template-background"
            />
            <div className="template-overlay">
            <p className="template-name">{selectedTemplate.name}</p>
              <div className="template-info">
                <span className="template-badge" style={{ backgroundColor: selectedTemplate.primaryColor }}>
                  Selected
                </span>
              </div>
            </div>
          </div>
          
          <div className="preview-data">
            <h4>Resume Content Preview</h4>
            <div className="preview-data-content">
              <div className="preview-section">
                <strong>Name:</strong> {resumeData.personalInfo.name || "Not provided"}
              </div>
              <div className="preview-section">
                <strong>Title:</strong> {resumeData.personalInfo.title || "Not provided"}
              </div>
              <div className="preview-section">
                <strong>Contact:</strong> {resumeData.personalInfo.email || "No email"} | {resumeData.personalInfo.phone || "No phone"}
              </div>
              <div className="preview-section">
                <strong>Experience:</strong> {resumeData.experience.length} entries
              </div>
              <div className="preview-section">
                <strong>Education:</strong> {resumeData.education.length} entries
              </div>
              <div className="preview-section">
                <strong>Skills:</strong> {resumeData.skills.filter(skill => skill.trim()).length} skills
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;