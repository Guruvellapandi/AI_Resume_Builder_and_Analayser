import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import modernTemplate from "../assets/modern.jpg";
import classicTemplate from "../assets/classic.jpg";
import "./../styles/TemplateSelection.css";

const templates = [
  { 
    id: "modern", 
    name: "Modern Template", 
    image: modernTemplate,
    description: "Clean and contemporary design with a focus on skills and achievements."
  },
  { 
    id: "classic", 
    name: "Classic Template", 
    image: classicTemplate,
    description: "Traditional layout ideal for experienced professionals across industries."
  },
  { 
    id: "creative", 
    name: "Creative Template", 
    image: modernTemplate, // Using modernTemplate as a placeholder
    description: "Bold design with unique sections to showcase your creative portfolio."
  },
  { 
    id: "minimal", 
    name: "Minimal Template", 
    image: classicTemplate, // Using classicTemplate as a placeholder
    description: "Sleek and simple design focusing on clarity and readability."
  },
];

const TemplateSelection = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      navigate("/resume-editor", { state: { template: selectedTemplate } });
    }
  };

  return (
    <div className="template-selection-container">
      <header className="template-header">
        <h1 className="template-title">Choose Your Resume Template</h1>
        <p className="template-subtitle">Select the perfect template to showcase your professional experience</p>
      </header>

      <div className="view-toggle">
        <button 
          className={`toggle-button ${!previewMode ? 'active' : ''}`}
          onClick={() => setPreviewMode(false)}
        >
          Grid View
        </button>
        <button 
          className={`toggle-button ${previewMode ? 'active' : ''}`}
          onClick={() => setPreviewMode(true)}
        >
          Preview Mode
        </button>
      </div>

      {!previewMode ? (
        <div className="templates-grid">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="image-container">
                <img 
                  src={template.image} 
                  alt={template.name} 
                  className="template-image" 
                />
                {selectedTemplate?.id === template.id && (
                  <div className="selected-indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="template-name">{template.name}</h3>
              <p className="template-description">{template.description}</p>
              <button 
                className={`select-button ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateSelect(template)}
              >
                {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="preview-container">
          {selectedTemplate ? (
            <div>
              <h2 className="template-name" style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
                {selectedTemplate.name}
              </h2>
              <img 
                src={selectedTemplate.image} 
                alt={selectedTemplate.name} 
                className="preview-image" 
              />
              <p className="preview-description">{selectedTemplate.description}</p>
              <div className="button-group">
                <button 
                  className="action-button secondary"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Back to Selection
                </button>
                <button 
                  className="action-button primary"
                  onClick={handleContinue}
                >
                  Use This Template
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">Please select a template to preview</p>
            </div>
          )}
        </div>
      )}

      <div className="continue-button-container">
        <button 
          className={`continue-button ${selectedTemplate ? 'active' : 'disabled'}`}
          disabled={!selectedTemplate}
          onClick={handleContinue}
        >
          Continue with {selectedTemplate?.name || 'Selected Template'}
        </button>
      </div>
    </div>
  );
};

export default TemplateSelection;
