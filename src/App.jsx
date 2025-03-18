import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TemplateSelection from "./pages/TemplateSelection";
import ResumeEditor from "./pages/ResumeEditor";
import ResumePreview from "./pages/ResumePreview";
import ResumePage from "./pages/ResumePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/resume-preview" element={<ResumePreview />} />
        <Route path="/resume-home" element={<ResumePage />} />
        <Route path="/templates" element={<TemplateSelection />} />
        <Route path="/resume-editor" element={<ResumeEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
