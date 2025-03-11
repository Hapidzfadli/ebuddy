'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import UserProfile from '../../components/organisms/UserProfile';
import AllUsers from '../../components/organisms/AllUsers';
import { RootState } from '../../store';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import Typography from '../../components/atoms/Typography';
import { updateUserActivity } from '../../apis/userApi';
import { Person as PersonIcon, Group as GroupIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.uid) {
      updateUserActivity(user.uid);
    }
  }, [isAuthenticated, router, user?.uid]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardTemplate>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            backgroundImage: 'linear-gradient(to right, #1976d2, #64b5f6)',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            display: 'inline-block'
          }}
        >
          Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem' }}
        >
          Manage your profile and view all users from this dashboard.
        </Typography>
      </Box>
      
      <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 60,
              fontWeight: 600
            },
            '& .Mui-selected': {
              color: 'primary.main',
            },
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: 2
            }
          }}
        >
          <Tab 
            icon={<PersonIcon />} 
            label="My Profile" 
            iconPosition="start"
          />
          <Tab 
            icon={<GroupIcon />} 
            label="All Users" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>
      
      <TabPanel value={tabValue} index={0}>
        <UserProfile />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <AllUsers />
      </TabPanel>
    </DashboardTemplate>
  );
}