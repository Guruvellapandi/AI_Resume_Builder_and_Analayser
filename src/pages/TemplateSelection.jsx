import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import modernTemplate from "../assets/modern.jpg";
import classicTemplate from "../assets/classic.jpg";
import { Heart, Filter, Search, CheckCircle, Grid, Maximize, Star } from "lucide-react";
import "./../styles/TemplateSelection.css";

// Extended template collection
const templates = [
  { 
    id: "modern", 
    name: "Modern Template", 
    image: modernTemplate,
    description: "Clean and contemporary design with a focus on skills and achievements.",
    category: "professional",
    popular: true,
    new: false,
  },
  { 
    id: "classic", 
    name: "Classic Template", 
    image: classicTemplate,
    description: "Traditional layout ideal for experienced professionals across industries.",
    category: "professional",
    popular: true,
    new: false,
  },
  { 
    id: "creative", 
    name: "Creative Template", 
    image: modernTemplate, // Using modernTemplate as a placeholder
    description: "Bold design with unique sections to showcase your creative portfolio.",
    category: "creative",
    popular: false,
    new: true,
  },
  { 
    id: "minimal", 
    name: "Minimal Template", 
    image: classicTemplate, // Using classicTemplate as a placeholder
    description: "Sleek and simple design focusing on clarity and readability.",
    category: "minimal",
    popular: true,
    new: false,
  },
  { 
    id: "tech", 
    name: "Tech Template", 
    image: modernTemplate,
    description: "Perfect for IT professionals with sections for technical skills and projects.",
    category: "specialized",
    popular: false,
    new: true,
  },
  { 
    id: "academic", 
    name: "Academic Template", 
    image: classicTemplate,
    description: "Structured format for academic positions, with focus on publications and research.",
    category: "specialized",
    popular: false,
    new: false,
  },
  { 
    id: "executive", 
    name: "Executive Template", 
    image: modernTemplate,
    description: "Sophisticated design for senior-level professionals and executives.",
    category: "professional",
    popular: true,
    new: false,
  },
  { 
    id: "infographic", 
    name: "Infographic Template", 
    image: classicTemplate,
    description: "Visual resume with charts and graphs to highlight your accomplishments.",
    category: "creative",
    popular: false,
    new: true,
  },
  { 
    id: "ats-friendly", 
    name: "ATS-Friendly Template", 
    image: modernTemplate,
    description: "Optimized for Applicant Tracking Systems with clean formatting.",
    category: "specialized",
    popular: true,
    new: false,
  },
  { 
    id: "startup", 
    name: "Startup Template", 
    image: classicTemplate,
    description: "Dynamic and versatile design for entrepreneurs and startup professionals.",
    category: "professional",
    popular: false,
    new: true,
  },
];

const TemplateSelection = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [animateEntry, setAnimateEntry] = useState(false);

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Templates" },
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" },
    { id: "minimal", name: "Minimal" },
    { id: "specialized", name: "Specialized" },
    { id: "favorites", name: "Favorites" },
    { id: "new", name: "New" },
    { id: "popular", name: "Popular" }
  ];

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("templateFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Animate cards on entry
    setTimeout(() => {
      setAnimateEntry(true);
    }, 100);
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("templateFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    if (previewMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      navigate("/resume-editor", { state: { template: selectedTemplate } });
    }
  };

  const toggleFavorite = (e, templateId) => {
    e.stopPropagation();
    if (favorites.includes(templateId)) {
      setFavorites(favorites.filter(id => id !== templateId));
    } else {
      setFavorites([...favorites, templateId]);
    }
  };

  // Filter templates based on search query and active filter
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeFilter === "all") return true;
    if (activeFilter === "favorites") return favorites.includes(template.id);
    if (activeFilter === "new") return template.new;
    if (activeFilter === "popular") return template.popular;
    return template.category === activeFilter;
  });

  return (
    <div className="template-selection-container">
      <header className="template-header">
        <h1 className="template-title">Choose Your Resume Template</h1>
        <p className="template-subtitle">Select the perfect template to showcase your professional experience</p>
      </header>

      {!previewMode && (
        <div className="template-controls">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-container">
            <div className="filter-categories">
              {categories.map(category => (
                <button 
                  key={category.id}
                  className={`filter-button ${activeFilter === category.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="view-controls">
        <div className="view-toggle">
          <button 
            className={`toggle-button ${!previewMode ? 'active' : ''}`}
            onClick={() => setPreviewMode(false)}
          >
            <Grid size={16} />
            Grid View
          </button>
          <button 
            className={`toggle-button ${previewMode ? 'active' : ''}`}
            onClick={() => {
              setPreviewMode(true);
              if (!selectedTemplate && filteredTemplates.length > 0) {
                setSelectedTemplate(filteredTemplates[0]);
              }
            }}
          >
            <Maximize size={16} />
            Preview Mode
          </button>
        </div>

        {!previewMode && (
          <div className="layout-toggle">
            <button 
              className={`layout-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid size={16} />
            </button>
            <button 
              className={`layout-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
      </div>

      {!previewMode ? (
        <div className={`templates-${viewMode} ${animateEntry ? 'animate-entry' : ''}`}>
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template, index) => (
              <div 
                key={template.id} 
                className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''} ${viewMode === 'list' ? 'list-view' : ''}`}
                onClick={() => handleTemplateSelect(template)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="image-container">
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    className="template-image" 
                    loading="lazy"
                  />
                  {selectedTemplate?.id === template.id && (
                    <div className="selected-indicator">
                      <CheckCircle size={16} />
                    </div>
                  )}
                  <button 
                    className={`favorite-button ${favorites.includes(template.id) ? 'favorited' : ''}`}
                    onClick={(e) => toggleFavorite(e, template.id)}
                    aria-label={favorites.includes(template.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart size={16} fill={favorites.includes(template.id) ? "#ef4444" : "none"} />
                  </button>
                  {template.new && <div className="template-badge new">New</div>}
                  {template.popular && <div className="template-badge popular">Popular</div>}
                </div>
                <div className="template-info">
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-description">{template.description}</p>
                  <div className="template-actions">
                    <button 
                      className={`select-button ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateSelect(template);
                      }}
                    >
                      {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                    </button>
                    <button 
                      className="preview-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template);
                        setPreviewMode(true);
                      }}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <h3>No templates found</h3>
              <p>Try adjusting your search or filters</p>
              <button 
                className="reset-button"
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="preview-container">
          {selectedTemplate ? (
            <div className="preview-content">
              <div className="preview-header">
                <h2 className="preview-title">{selectedTemplate.name}</h2>
                <div className="preview-actions">
                  <button 
                    className={`favorite-button-large ${favorites.includes(selectedTemplate.id) ? 'favorited' : ''}`}
                    onClick={(e) => toggleFavorite(e, selectedTemplate.id)}
                  >
                    <Heart size={20} fill={favorites.includes(selectedTemplate.id) ? "#ef4444" : "none"} />
                    {favorites.includes(selectedTemplate.id) ? 'Favorited' : 'Add to Favorites'}
                  </button>
                </div>
              </div>
              
              <div className="preview-image-container">
                <img 
                  src={selectedTemplate.image} 
                  alt={selectedTemplate.name} 
                  className="preview-image" 
                />
                {selectedTemplate.new && <div className="preview-badge new">New</div>}
                {selectedTemplate.popular && <div className="preview-badge popular">Popular</div>}
              </div>
              
              <div className="preview-details">
                <div className="preview-description-container">
                  <h3>Description</h3>
                  <p className="preview-description">{selectedTemplate.description}</p>
                </div>
                
                <div className="preview-features">
                  <h3>Features</h3>
                  <ul className="features-list">
                    <li><CheckCircle size={16} /> ATS-friendly format</li>
                    <li><CheckCircle size={16} /> Customizable sections</li>
                    <li><CheckCircle size={16} /> Professional typography</li>
                    <li><CheckCircle size={16} /> Optimized spacing</li>
                  </ul>
                </div>
              </div>
              
              <div className="preview-navigation">
                <button 
                  className="nav-button prev"
                  disabled={filteredTemplates.indexOf(selectedTemplate) === 0}
                  onClick={() => {
                    const currentIndex = filteredTemplates.indexOf(selectedTemplate);
                    if (currentIndex > 0) {
                      setSelectedTemplate(filteredTemplates[currentIndex - 1]);
                    }
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Previous
                </button>
                <div className="indicator">
                  {filteredTemplates.indexOf(selectedTemplate) + 1} of {filteredTemplates.length}
                </div>
                <button 
                  className="nav-button next"
                  disabled={filteredTemplates.indexOf(selectedTemplate) === filteredTemplates.length - 1}
                  onClick={() => {
                    const currentIndex = filteredTemplates.indexOf(selectedTemplate);
                    if (currentIndex < filteredTemplates.length - 1) {
                      setSelectedTemplate(filteredTemplates[currentIndex + 1]);
                    }
                  }}
                >
                  Next
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
              
              <div className="button-group">
                <button 
                  className="action-button secondary"
                  onClick={() => setPreviewMode(false)}
                >
                  Back to Gallery
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
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p className="empty-state-text">Please select a template to preview</p>
              <button 
                className="action-button secondary"
                onClick={() => setPreviewMode(false)}
              >
                Back to Gallery
              </button>
            </div>
          )}
        </div>
      )}

      {!previewMode && filteredTemplates.length > 0 && (
        <div className="continue-button-container">
          <button 
            className={`continue-button ${selectedTemplate ? 'active' : 'disabled'}`}
            disabled={!selectedTemplate}
            onClick={handleContinue}
          >
            Continue with {selectedTemplate?.name || 'Selected Template'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateSelection;