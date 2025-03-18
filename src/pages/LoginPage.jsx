import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    
    // Add animation classes after component mounts
    const loginBox = document.querySelector(".login-box");
    setTimeout(() => {
      loginBox.classList.add("animate-in");
    }, 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      console.log("Logging in with:", email, password, "Remember me:", rememberMe);
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigate("/reset-password");
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo"></div>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue your journey</p>
          </div>
          
          {error && (
            <div className="error-message">
              <i className="error-icon">!</i>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <FaUser className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={error && !validateEmail(email) ? "has-error" : ""}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <FaLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={error && password.length < 6 ? "has-error" : ""}
                  required
                />
                <div className="toggle-password" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
            
            <div className="form-options">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember">
                  <span className="checkbox-custom"></span>
                  Remember me
                </label>
              </div>
              <button 
                type="button" 
                className="forgot-password"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>
            
            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <span className="button-text">{isLoading ? 'Signing in...' : 'Sign In'}</span>
              <span className="button-loader"></span>
            </button>
          </form>
          
          <div className="divider">
            <span>or continue with</span>
          </div>
          
          <div className="social-login">
            <button className="social-button google">
              <FaGoogle />
              <span>Google</span>
            </button>
            <button className="social-button facebook">
              <FaFacebookF />
              <span>Facebook</span>
            </button>
          </div>
          
          <div className="signup-prompt">
            <p>Don't have an account? <button onClick={() => navigate("/signup")}>Sign up</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;