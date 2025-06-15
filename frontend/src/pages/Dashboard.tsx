import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, useTheme } from '@mui/material';
import { People, TrendingUp, AssignmentTurnedIn } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  // In a real app, fetch these stats from the backend
  const stats = [
    {
      label: 'Total Employees',
      value: 42,
      icon: <People fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Avg. Attendance',
      value: '96%',
      icon: <AssignmentTurnedIn fontSize="large" />,
      color: theme.palette.success.main || '#4caf50',
    },
    {
      label: 'Growth',
      value: '+8%',
      icon: <TrendingUp fontSize="large" />,
      color: theme.palette.secondary.main,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Welcome to the Employee Dashboard
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 4,
        }}
      >
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Card sx={{ borderRadius: 4, boxShadow: 6, p: 2, background: 'linear-gradient(135deg, #f4f6fb 60%, #e0e7ff 100%)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
