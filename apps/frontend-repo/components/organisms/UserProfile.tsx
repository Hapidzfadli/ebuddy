import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  Divider, 
  CircularProgress, 
  Alert, 
  Chip,
  Stack
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Star as StarIcon, 
  AccessTime as TimeIcon, 
  ShoppingCart as CartIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon 
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchUserStart, fetchUserSuccess, fetchUserFailure, updateUserStart, updateUserSuccess, updateUserFailure, resetUserState } from '../../store/slices/userSlice';
import { fetchUserData, updateUserData, updateUserActivity } from '../../apis/userApi';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { User } from '@ebuddy/shared';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { userData, loading, success, error } = useSelector((state: RootState) => state.user);
  
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Function to fetch user data
  const handleFetchUserData = async () => {
    if (!user?.uid) return;
    
    try {
      dispatch(fetchUserStart());
      const data = await fetchUserData(user.uid);
      dispatch(fetchUserSuccess(data));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data';
      dispatch(fetchUserFailure(errorMessage));
    }
  };

  useEffect(() => {
    if (user?.uid) {
      handleFetchUserData();
      
      // Update user activity once when component mounts
      updateUserActivity();
      
      // Set up interval to update activity every 5 minutes
      const activityInterval = setInterval(() => {
        updateUserActivity();
      }, 5 * 60 * 1000);
      
      return () => clearInterval(activityInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
    }
  }, [userData]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetUserState());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleUpdateUserData = async () => {
    if (!user?.uid) return;
    
    try {
      dispatch(updateUserStart());
      
      const updatedData: Partial<User> = {
        name,
        email
      };
      
      const data = await updateUserData(user.uid, updatedData);
      dispatch(updateUserSuccess(data));
      setEditMode(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user data';
      dispatch(updateUserFailure(errorMessage));
    }
  };

  const formatDate = (timestamp?: unknown) => {
    if (!timestamp) return 'N/A';
    
    try {
      let date: Date;
      
      if (typeof timestamp === 'object' && timestamp !== null && '_seconds' in timestamp) {
        const timestampObj = timestamp as { _seconds: number };
        date = new Date(timestampObj._seconds * 1000);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        date = new Date(String(timestamp));
      }
      
      // Format date in a more readable way
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check if date is today
      if (date.toDateString() === today.toDateString()) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // Check if date is yesterday
      if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // Check if date is within this year
      const isThisYear = date.getFullYear() === today.getFullYear();
      
      if (isThisYear) {
        return date.toLocaleDateString([], { month: 'long', day: 'numeric' }) + 
               ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // For older dates, include the year
      return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      console.error('Error formatting date:', error, timestamp);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress 
          size={60} 
          thickness={4} 
          sx={{ 
            color: 'primary.main',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            }
          }} 
        />
      </Box>
    );
  }

  return (
    <>
      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: 2, 
            boxShadow: '0 6px 20px rgba(0,0,0,0.05)', 
            animation: 'slideDown 0.5s ease-out',
            '@keyframes slideDown': {
              '0%': { transform: 'translateY(-20px)', opacity: 0 },
              '100%': { transform: 'translateY(0)', opacity: 1 },
            }
          }}
        >
          Profile updated successfully!
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
            animation: 'shake 0.5s ease-out',
            '@keyframes shake': {
              '0%, 100%': { transform: 'translateX(0)' },
              '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
              '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
            }
          }}
        >
          {error}
        </Alert>
      )}
    
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              }
            }}
          >
            <Box 
              sx={{ 
                height: 120, 
                background: 'linear-gradient(120deg, #1976d2, #64b5f6)',
                position: 'relative'
              }}
            />
            
            <CardContent sx={{ position: 'relative', mt: -8, pt: 0, textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 110, 
                  height: 110, 
                  bgcolor: 'secondary.main', 
                  mx: 'auto',
                  border: '4px solid white',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  fontSize: '2.5rem',
                  mb: 2
                }}
              >
                {userData?.name?.substring(0, 1) || user?.email?.substring(0, 1) || 'U'}
              </Avatar>
              
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontWeight: 'bold', mb: 0.5 }}
              >
                {userData?.name || 'User'}
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ mb: 2 }}
              >
                {userData?.email || user?.email || 'No email available'}
              </Typography>

              {!editMode ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                  sx={{ 
                    borderRadius: 8, 
                    px: 3,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleUpdateUserData}
                    sx={{ borderRadius: 8 }}
                  >
                    Save
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setEditMode(false)}
                    sx={{ borderRadius: 8 }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                  <StarIcon color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1, textAlign: 'left' }}>
                    Average Rating
                  </Typography>
                  <Chip 
                    label={userData?.totalAverageWeightRatings?.toFixed(1) || 'N/A'} 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                  <CartIcon color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1, textAlign: 'left' }}>
                    Total Rents
                  </Typography>
                  <Chip 
                    label={userData?.numberOfRents || '0'} 
                    color="secondary" 
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                  <TimeIcon color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1, textAlign: 'left' }}>
                    Last Active
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(userData?.recentlyActive)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 4, 
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)', 
              mb: 3,
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Profile Details
                </Typography>
                
                {editMode && (
                  <Chip 
                    label="Editing" 
                    color="primary"
                    size="small"
                    sx={{ animation: 'pulse 2s infinite' }}
                  />
                )}
              </Box>
              
              <Divider sx={{ mb: 4 }} />
              
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Box mb={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                      Full Name
                    </Typography>
                    
                    {editMode ? (
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        fullWidth
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {userData?.name || 'Not set'}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box mb={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                      Email Address
                    </Typography>
                    
                    {editMode ? (
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        type="email"
                        fullWidth
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {userData?.email || 'Not set'}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Activity Statistics
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box 
                      sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'white', 
                        borderRadius: 3, 
                        p: 2, 
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <StarIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {userData?.totalAverageWeightRatings?.toFixed(1) || '0.0'}
                      </Typography>
                      <Typography variant="body2">Average Rating</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box 
                      sx={{ 
                        bgcolor: 'secondary.light', 
                        color: 'white', 
                        borderRadius: 3, 
                        p: 2, 
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <CartIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {userData?.numberOfRents || '0'}
                      </Typography>
                      <Typography variant="body2">Total Rents</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box 
                      sx={{ 
                        bgcolor: 'success.light', 
                        color: 'white', 
                        borderRadius: 3, 
                        p: 2, 
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <TimeIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Last Active
                      </Typography>
                      <Typography variant="caption">
                        {formatDate(userData?.recentlyActive)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              <Box 
                sx={{ 
                  mt: 4, 
                  bgcolor: 'rgba(0,0,0,0.02)', 
                  p: 2, 
                  borderRadius: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: { xs: 2, md: 4 }
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(userData?.createdAt)}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(userData?.updatedAt)}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {userData?.id || user?.uid || 'Unknown'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default UserProfile;