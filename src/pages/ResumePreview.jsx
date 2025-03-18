import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/ResumePreview.css";

// Template components
const DefaultTemplate = ({ data, template }) => (
  <div className="resume-template default-template" style={{ backgroundColor: "#fff", color: "#333" }}>
    <div className="resume-header" style={{ backgroundColor: template.primaryColor }}>
      <h1>{data.personalInfo.name}</h1>
      <h2>{data.personalInfo.title}</h2>
      <div className="contact-info">
        <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
        <p>{data.personalInfo.address}</p>
        {data.personalInfo.linkedIn && <p>LinkedIn: {data.personalInfo.linkedIn}</p>}
        {data.personalInfo.website && <p>Website: {data.personalInfo.website}</p>}
      </div>
    </div>
    
    {data.summary && (
      <div className="resume-section">
        <h3>Professional Summary</h3>
        <p>{data.summary}</p>
      </div>
    )}
    
    <div className="resume-section">
      <h3>Experience</h3>
      {data.experience.map((exp) => (
        <div className="experience-item" key={exp.id}>
          <div className="job-header">
            <h4>{exp.position}</h4>
            <div className="company-dates">
              <span className="company">{exp.company}</span>
              <span className="dates">{exp.startDate} - {exp.endDate || "Present"}</span>
            </div>
          </div>
          {exp.description && <p>{exp.description}</p>}
          {exp.achievements.length > 0 && exp.achievements[0] !== "" && (
            <div className="achievements">
              <h5>Key Achievements:</h5>
              <ul>
                {exp.achievements.map((achievement, index) => (
                  achievement.trim() !== "" && <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
    
    <div className="resume-section">
      <h3>Education</h3>
      {data.education.map((edu) => (
        <div className="education-item" key={edu.id}>
          <div className="education-header">
            <h4>{edu.degree}</h4>
            <div className="institution-dates">
              <span className="institution">{edu.institution}</span>
              {edu.graduationDate && <span className="graduation-date">{edu.graduationDate}</span>}
            </div>
          </div>
          {edu.gpa && <p>GPA: {edu.gpa}</p>}
          {edu.description && <p>{edu.description}</p>}
        </div>
      ))}
    </div>
    
    <div className="resume-section">
      <h3>Skills</h3>
      <div className="skills-list">
        {data.skills.filter(skill => skill.trim() !== "").map((skill, index) => (
          <span className="skill-tag" key={index} style={{ backgroundColor: template.primaryColor + "33" }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Professional template
const ProfessionalTemplate = ({ data, template }) => (
  <div className="resume-template professional-template" style={{ backgroundColor: "#fff", color: "#333" }}>
    {/* Similar structure to DefaultTemplate with professional styling */}
    <div className="resume-header" style={{ borderBottom: `3px solid ${template.primaryColor}` }}>
      <h1 style={{ color: template.primaryColor }}>{data.personalInfo.name}</h1>
      <h2>{data.personalInfo.title}</h2>
      <div className="contact-info">
        <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
        <p>{data.personalInfo.address}</p>
        {data.personalInfo.linkedIn && <p>LinkedIn: {data.personalInfo.linkedIn}</p>}
        {data.personalInfo.website && <p>Website: {data.personalInfo.website}</p>}
      </div>
    </div>
    
    {/* Rest of resume sections similar to DefaultTemplate with professional styling */}
    {/* ... */}
    {data.summary && (
      <div className="resume-section">
        <h3 style={{ color: template.primaryColor }}>Professional Summary</h3>
        <div className="section-divider" style={{ backgroundColor: template.primaryColor }}></div>
        <p>{data.summary}</p>
      </div>
    )}
    
    <div className="resume-section">
      <h3 style={{ color: template.primaryColor }}>Experience</h3>
      <div className="section-divider" style={{ backgroundColor: template.primaryColor }}></div>
      {data.experience.map((exp) => (
        <div className="experience-item" key={exp.id}>
          <div className="job-header">
            <h4>{exp.position}</h4>
            <div className="company-dates">
              <span className="company">{exp.company}</span>
              <span className="dates">{exp.startDate} - {exp.endDate || "Present"}</span>
            </div>
          </div>
          {exp.description && <p>{exp.description}</p>}
          {exp.achievements.length > 0 && exp.achievements[0] !== "" && (
            <div className="achievements">
              <h5>Key Achievements:</h5>
              <ul>
                {exp.achievements.map((achievement, index) => (
                  achievement.trim() !== "" && <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
    
    <div className="resume-section">
      <h3 style={{ color: template.primaryColor }}>Education</h3>
      <div className="section-divider" style={{ backgroundColor: template.primaryColor }}></div>
      {/* Education items as in DefaultTemplate */}
      {data.education.map((edu) => (
        <div className="education-item" key={edu.id}>
          <div className="education-header">
            <h4>{edu.degree}</h4>
            <div className="institution-dates">
              <span className="institution">{edu.institution}</span>
              {edu.graduationDate && <span className="graduation-date">{edu.graduationDate}</span>}
            </div>
          </div>
          {edu.gpa && <p>GPA: {edu.gpa}</p>}
          {edu.description && <p>{edu.description}</p>}
        </div>
      ))}
    </div>
    
    <div className="resume-section">
      <h3 style={{ color: template.primaryColor }}>Skills</h3>
      <div className="section-divider" style={{ backgroundColor: template.primaryColor }}></div>
      <div className="skills-list">
        {data.skills.filter(skill => skill.trim() !== "").map((skill, index) => (
          <span className="skill-tag professional" key={index}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Creative template
const CreativeTemplate = ({ data, template }) => (
  <div className="resume-template creative-template" style={{ backgroundColor: "#fff" }}>
    {/* Creative styling with sidebar */}
    <div className="sidebar" style={{ backgroundColor: template.primaryColor }}>
      <div className="profile-section">
        <h1>{data.personalInfo.name}</h1>
        <h2>{data.personalInfo.title}</h2>
      </div>
      
      <div className="sidebar-section">
        <h3>Contact</h3>
        <ul className="contact-list">
          <li>{data.personalInfo.email}</li>
          <li>{data.personalInfo.phone}</li>
          {data.personalInfo.address && <li>{data.personalInfo.address}</li>}
          {data.personalInfo.linkedIn && <li>{data.personalInfo.linkedIn}</li>}
          {data.personalInfo.website && <li>{data.personalInfo.website}</li>}
        </ul>
      </div>
      
      <div className="sidebar-section">
        <h3>Skills</h3>
        <ul className="skills-list">
          {data.skills.filter(skill => skill.trim() !== "").map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
    
    <div className="main-content">
      {data.summary && (
        <div className="resume-section">
          <h3>About Me</h3>
          <p>{data.summary}</p>
        </div>
      )}
      
      <div className="resume-section">
        <h3>Experience</h3>
        {data.experience.map((exp) => (
          <div className="experience-item" key={exp.id}>
            <div className="job-header">
              <h4>{exp.position}</h4>
              <div className="company-dates">
                <span className="company">{exp.company}</span>
                <span className="dates">{exp.startDate} - {exp.endDate || "Present"}</span>
              </div>
            </div>
            {exp.description && <p>{exp.description}</p>}
            {exp.achievements.length > 0 && exp.achievements[0] !== "" && (
              <div className="achievements">
                <h5>Key Achievements:</h5>
                <ul>
                  {exp.achievements.map((achievement, index) => (
                    achievement.trim() !== "" && <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="resume-section">
        <h3>Education</h3>
        {data.education.map((edu) => (
          <div className="education-item" key={edu.id}>
            <div className="education-header">
              <h4>{edu.degree}</h4>
              <div className="institution-dates">
                <span className="institution">{edu.institution}</span>
                {edu.graduationDate && <span className="graduation-date">{edu.graduationDate}</span>}
              </div>
            </div>
            {edu.gpa && <p>GPA: {edu.gpa}</p>}
            {edu.description && <p>{edu.description}</p>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Modern template
const ModernTemplate = ({ data, template }) => (
  <div className="resume-template modern-template" style={{ backgroundColor: "#fff", color: "#333" }}>
    <div className="resume-header" style={{ borderLeft: `5px solid ${template.primaryColor}` }}>
      <h1>{data.personalInfo.name}</h1>
      <h2>{data.personalInfo.title}</h2>
      <div className="contact-info">
        <div className="contact-row">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        </div>
        <div className="contact-row">
          {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
          {data.personalInfo.linkedIn && <span>{data.personalInfo.linkedIn}</span>}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </div>
      </div>
    </div>
    
    {data.summary && (
      <div className="resume-section">
        <h3>
          <span className="section-icon" style={{ backgroundColor: template.primaryColor }}>●</span>
          Professional Summary
        </h3>
        <p>{data.summary}</p>
      </div>
    )}
    
    <div className="resume-section">
      <h3>
        <span className="section-icon" style={{ backgroundColor: template.primaryColor }}>●</span>
        Experience
      </h3>
      {data.experience.map((exp) => (
        <div className="experience-item" key={exp.id}>
          <div className="job-header">
            <h4>{exp.position}</h4>
            <div className="company-dates">
              <span className="company">{exp.company}</span>
              <span className="dates">{exp.startDate} - {exp.endDate || "Present"}</span>
            </div>
          </div>
          {exp.description && <p>{exp.description}</p>}
          {exp.achievements.length > 0 && exp.achievements[0] !== "" && (
            <div className="achievements">
              <h5>Key Achievements:</h5>
              <ul>
                {exp.achievements.map((achievement, index) => (
                  achievement.trim() !== "" && <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
    
    <div className="resume-section">
      <h3>
        <span className="section-icon" style={{ backgroundColor: template.primaryColor }}>●</span>
        Education
      </h3>
      {data.education.map((edu) => (
        <div className="education-item" key={edu.id}>
          <div className="education-header">
            <h4>{edu.degree}</h4>
            <div className="institution-dates">
              <span className="institution">{edu.institution}</span>
              {edu.graduationDate && <span className="graduation-date">{edu.graduationDate}</span>}
            </div>
          </div>
          {edu.gpa && <p>GPA: {edu.gpa}</p>}
          {edu.description && <p>{edu.description}</p>}
        </div>
      ))}
    </div>
    
    <div className="resume-section">
      <h3>
        <span className="section-icon" style={{ backgroundColor: template.primaryColor }}>●</span>
        Skills
      </h3>
      <div className="skills-list modern">
        {data.skills.filter(skill => skill.trim() !== "").map((skill, index) => (
          <span className="skill-tag" key={index} style={{ borderColor: template.primaryColor }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Simple template
const SimpleTemplate = ({ data, template }) => (
  <div className="resume-template simple-template" style={{ backgroundColor: "#fff", color: "#333" }}>
    <div className="resume-header">
      <h1>{data.personalInfo.name}</h1>
      {data.personalInfo.title && <h2>{data.personalInfo.title}</h2>}
      <div className="contact-info">
        <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
        {data.personalInfo.address && <p>{data.personalInfo.address}</p>}
        <p>
          {data.personalInfo.linkedIn && <span>LinkedIn: {data.personalInfo.linkedIn} </span>}
          {data.personalInfo.website && <span>| Website: {data.personalInfo.website}</span>}
        </p>
      </div>
    </div>
    
    {data.summary && (
      <div className="resume-section">
        <h3>Summary</h3>
        <div className="simple-divider"></div>
        <p>{data.summary}</p>
      </div>
    )}
    
    <div className="resume-section">
      <h3>Experience</h3>
      <div className="simple-divider"></div>
      {data.experience.map((exp) => (
        <div className="experience-item" key={exp.id}>
          <div className="job-header">
            <h4>{exp.position} | {exp.company}</h4>
            <span className="dates">{exp.startDate} - {exp.endDate || "Present"}</span>
          </div>
          {exp.description && <p>{exp.description}</p>}
          {exp.achievements.length > 0 && exp.achievements[0] !== "" && (
            <div className="achievements">
              <ul>
                {exp.achievements.map((achievement, index) => (
                  achievement.trim() !== "" && <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
    
    <div className="resume-section">
      <h3>Education</h3>
      <div className="simple-divider"></div>
      {data.education.map((edu) => (
        <div className="education-item" key={edu.id}>
          <div className="education-header">
            <h4>{edu.degree} | {edu.institution}</h4>
            {edu.graduationDate && <span className="graduation-date">{edu.graduationDate}</span>}
          </div>
          {edu.gpa && <p>GPA: {edu.gpa}</p>}
          {edu.description && <p>{edu.description}</p>}
        </div>
      ))}
    </div>
    
    <div className="resume-section">
      <h3>Skills</h3>
      <div className="simple-divider"></div>
      <p className="simple-skills">
        {data.skills.filter(skill => skill.trim() !== "").join(" • ")}
      </p>
    </div>
  </div>
);

const ResumePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef(null);
  const { template, resumeData, exportPDF } = location.state || {};

  useEffect(() => {
    // If exportPDF is true, automatically export the PDF
    if (exportPDF && resumeRef.current) {
      setTimeout(() => {
        handleExportPDF();
      }, 1000); // Small delay to ensure rendering is complete
    }
  }, [exportPDF]);

  // Handle when no template or data is provided
  if (!template || !resumeData) {
    return (
      <div className="no-data-container">
        <h2>No resume data available</h2>
        <p>Please go back and create a resume first.</p>
        <button 
          className="back-button" 
          onClick={() => navigate("/create")}
        >
          Create Resume
        </button>
      </div>
    );
  }

  const handleExportPDF = async () => {
    try {
      toast.info("Preparing your PDF...", { autoClose: 2000 });
      
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      
      // Add image to PDF, potentially across multiple pages if needed
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      
      // If the resume is longer than one page
      let heightLeft = imgHeight - pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF with proper name from resumeData
      const fileName = `${resumeData.personalInfo.name.split(' ').join('-')}-Resume.pdf`;
      pdf.save(fileName);
      
      toast.success("PDF exported successfully!", { autoClose: 3000 });
      
      // If this was an automatic export, navigate back
      if (exportPDF) {
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.", { autoClose: 4000 });
    }
  };

  const renderTemplate = () => {
    // Dynamically render the selected template with the resume data
    switch (template.name.toLowerCase()) {
      case "modern":
        return <ModernTemplate data={resumeData} template={template} />;
      case "professional":
        return <ProfessionalTemplate data={resumeData} template={template} />;
      case "creative":
        return <CreativeTemplate data={resumeData} template={template} />;
      case "minimal":
        return <SimpleTemplate data={resumeData} template={template} />;
      default:
        return <DefaultTemplate data={resumeData} template={template} />;
    }
  };

  return (
    <div className="resume-preview-container">
      <ToastContainer position="top-center" />
      
      <div className="preview-header">
        <h1>Resume Preview</h1>
        <div className="preview-actions">
          <button onClick={() => navigate(-1)} className="back-button">
            Back to Editor
          </button>
          <button onClick={handleExportPDF} className="export-button">
            Export as PDF
          </button>
        </div>
      </div>
      
      <div className="resume-preview-content">
        <div className="resume-document" ref={resumeRef}>
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;