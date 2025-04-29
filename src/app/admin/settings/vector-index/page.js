"use client";
import React, { useState, useEffect } from "react";
import { Button, Typography, Box, CircularProgress, Alert, Paper } from "@mui/material";

const checkIndexes = async () => {
  const res = await fetch("/api/settings/vector-index");
  return res.json();
};

const createIndexes = async () => {
  const res = await fetch("/api/settings/vector-index", { method: "POST" });
  return res.json();
};

export default function VectorIndexSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [userIndexExists, setUserIndexExists] = useState(null);
  const [projectIndexExists, setProjectIndexExists] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    handleCheck();
  }, []);

  const handleCheck = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await checkIndexes();
      setUserIndexExists(data.userIndexExists);
      setProjectIndexExists(data.projectIndexExists);
      setMessage(
        `User index: ${data.userIndexExists ? "Exists" : "Does not exist"}\n` +
        `Project index: ${data.projectIndexExists ? "Exists" : "Does not exist"}`
      );
    } catch (err) {
      setError("Failed to check indexes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await createIndexes();
      if (data.results) {
        const success = !data.results.users.error && !data.results.projects.error;
        if (success) {
          setUserIndexExists(true);
          setProjectIndexExists(true);
          setMessage("Vector indexes created successfully.");
        } else {
          const errors = [];
          if (data.results.users.error) errors.push("Users: " + data.results.users.error);
          if (data.results.projects.error) errors.push("Projects: " + data.results.projects.error);
          setError("Failed to create some indexes: " + errors.join(", "));
        }
      } else {
        setError("Failed to create indexes.");
      }
    } catch (err) {
      setError("Failed to create indexes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, p: 3 }}>
      <Paper sx={{ p: 3, boxShadow: 2, borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography variant="h5" gutterBottom>
          Vector Index Settings
        </Typography>
        
        <Typography variant="body1" paragraph>
          Vector indexes are required for semantic search functionality. They enable efficient similarity searches on user and project embeddings.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Current Status:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User Index: {userIndexExists === null ? "Checking..." : (userIndexExists ? "✓ Exists" : "✗ Missing")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Project Index: {projectIndexExists === null ? "Checking..." : (projectIndexExists ? "✓ Exists" : "✗ Missing")}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleCheck} 
            disabled={loading}
          >
            Check Indexes
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleCreate} 
            disabled={loading || (userIndexExists && projectIndexExists)}
          >
            Create Indexes
          </Button>
        </Box>

        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
} 