import React from "react";
import { useNavigate } from "react-router-dom";
import modernTemplate from "../assets/modern.jpg";
import classicTemplate from "../assets/classic.jpg";
import "./../styles/TemplateSelection.css";

const templates = [
  { id: "modern", name: "Modern Template", image: modernTemplate },
  { id: "classic", name: "Classic Template", image: classicTemplate },
];

const TemplateSelection = () => {
  const navigate = useNavigate();

  const handleTemplateSelect = (template) => {
    console.log("Navigating with template:", template);  // Debugging line
    navigate("/resume-editor", { state: { template } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Choose a Resume Template</h1>
      <div className="flex gap-6">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => handleTemplateSelect(template)}
          >
            <img src={template.image} alt={template.name} className="w-48 h-auto rounded-lg" />
            <p className="text-center font-semibold mt-2">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;
