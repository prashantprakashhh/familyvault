// client/src/components/Dashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Typography, Container, Card, CardContent } from '@mui/material';
import api from '../services/api';

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files.length) {
      setMessage('Please select at least one file.');
      return;
    }
    try {
      const formData = new FormData();
      // Append multiple files
      for (let i = 0; i < files.length; i++) {
        formData.append('photo', files[i]);
      }
      // Actually, your backend is set for one file at a time (single("photo")),
      // but we can adapt it to handle multiple if you want (array("photo", X)).
      // For now, we assume you'd adapt your backend or do multiple calls.
      // We'll do a single file approach here for demonstration:
      formData.append('photo', files[0]);

      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'File upload error');
    }
  };

  return (
    <Container component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      maxWidth="sm" 
      sx={{ mt: 6 }}
    >
      <Card variant="outlined" sx={{ p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Welcome to Your Dashboard</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Here you can upload multiple images (or adapt for single). Let’s dazzle it up!
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="contained" component="label">
              Select File(s)
              <input 
                type="file" 
                hidden 
                multiple
                onChange={handleFileChange} 
              />
            </Button>
            
            <Button variant="outlined" color="success" onClick={handleUpload}>
              Upload
            </Button>
            
            {message && (
              <Typography variant="body2" color="info.main">
                {message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Dashboard;
