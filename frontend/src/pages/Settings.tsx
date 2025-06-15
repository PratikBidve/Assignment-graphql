import React, { useState, useContext } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Divider, Button, Snackbar } from '@mui/material';
import { ThemeModeContext } from '../theme/ThemeModeContext';

const Settings: React.FC = () => {
  const { mode, toggleMode } = useContext(ThemeModeContext);
  const [notifications, setNotifications] = useState(true);
  const [snackbar, setSnackbar] = useState(false);

  const handleSave = () => {
    setSnackbar(true);
  };

  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h4" fontWeight={700} mb={4}>
        Settings
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 6 }}>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleMode} color="primary" />}
          label="Dark Mode"
        />
        <Divider sx={{ my: 2 }} />
        <FormControlLabel
          control={<Switch checked={notifications} onChange={() => setNotifications(!notifications)} color="primary" />}
          label="Enable Notifications"
        />
        <Divider sx={{ my: 2 }} />
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </Paper>
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
        message="Settings saved!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Settings;
