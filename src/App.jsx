import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TemplateSelection from "./pages/TemplateSelection";
import ResumeEditor from "./pages/ResumeEditor";
import ResumePage from "./pages/ResumePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/templates" element={<TemplateSelection />} />
        <Route path="/resume-editor" element={<ResumeEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
