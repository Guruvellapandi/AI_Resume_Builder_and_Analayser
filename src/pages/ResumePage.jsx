import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography, Paper, Fade, Grid, Divider } from "@mui/material";
import { DocumentScanner, CreateNewFolder, Timeline, Star } from "@mui/icons-material";
import "../styles/ResumePage.css";
import backgroundImg from "../assets/visual_resume_templates_14.jpg";

const ResumePage = ({ navigateTo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const handleButtonClick = (action) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigateTo(action);
    }, 800);
  };

  const features = [
    { 
      icon: <CreateNewFolder fontSize="large" sx={{ color: "#0056b3" }} />,
      title: "Easy Creation",
      description: "Build a professional resume in minutes with our guided templates"
    },
    { 
      icon: <DocumentScanner fontSize="large" sx={{ color: "#0056b3" }} />,
      title: "AI Analysis",
      description: "Get instant feedback on how to improve your existing resume"
    },
    { 
      icon: <Timeline fontSize="large" sx={{ color: "#0056b3" }} />,
      title: "Career Insights",
      description: "Understand how your skills align with job market demands"
    },
    { 
      icon: <Star fontSize="large" sx={{ color: "#0056b3" }} />,
      title: "Expert Tips",
      description: "Access curated advice from hiring professionals"
    }
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={8}
          sx={{
            textAlign: "center",
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: "rgba(255, 255, 255, 0.95)",
            maxWidth: 800,
            mx: "auto",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              color: "#0056b3", 
              mb: 1, 
              fontWeight: "bold",
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }
            }}
          >
            Resume Manager
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: "#666", 
              mb: 4,
              maxWidth: "80%",
              mx: "auto"
            }}
          >
            Create, analyze, and perfect your resume with our AI-powered tools
          </Typography>
          
          {isLoading ? (
            <Box sx={{ my: 6, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <CircularProgress size={60} thickness={4} sx={{ color: "#0056b3" }} />
              <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
                Preparing your workspace...
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: 3, 
                flexWrap: "wrap",
                mb: 5
              }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CreateNewFolder />}
                  sx={{
                    borderRadius: 30,
                    px: 4,
                    py: 1.5,
                    backgroundColor: "#007bff",
                    ":hover": { 
                      backgroundColor: "#0056b3",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 12px rgba(0,86,179,0.2)"
                    },
                    transition: "all 0.2s ease",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => handleButtonClick("create")}
                >
                  Create Resume
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<DocumentScanner />}
                  sx={{
                    borderRadius: 30,
                    px: 4,
                    py: 1.5,
                    backgroundColor: "#007bff",
                    ":hover": { 
                      backgroundColor: "#0056b3",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 12px rgba(0,86,179,0.2)"
                    },
                    transition: "all 0.2s ease",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => handleButtonClick("analyze")}
                >
                  Analyze Resume
                </Button>
              </Box>
              
              <Divider sx={{ mb: 4, width: "70%", mx: "auto" }} />
              
              <Typography variant="h6" sx={{ mb: 3, color: "#333", fontWeight: "500" }}>
                Why use our Resume Manager?
              </Typography>
              
              <Grid container spacing={3} sx={{ px: { xs: 0, sm: 2 } }}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={hoveredFeature === index ? 4 : 1}
                      sx={{
                        p: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        ":hover": {
                          transform: "translateY(-5px)",
                          bgcolor: "rgba(0,86,179,0.03)"
                        },
                        cursor: "pointer"
                      }}
                      onMouseEnter={() => setHoveredFeature(index)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <Box sx={{ mb: 1 }}>{feature.icon}</Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: "500", color: "#0056b3" }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default ResumePage;