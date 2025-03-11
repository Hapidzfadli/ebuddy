import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  CircularProgress, 
  Alert,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip
} from '@mui/material';
import { 
  StarRate as StarIcon,
  MonetizationOn as RentIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Typography from '../atoms/Typography';
import axios from '../../apis/axiosInstance';
import { User } from '@ebuddy/shared';

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/fetch-all-users');
      setUsers(response.data.users);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const formatDate = (timestamp?: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      let date;
      
      if (timestamp._seconds !== undefined) {
        date = new Date(timestamp._seconds * 1000);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        date = new Date(timestamp);
      }
      
      // Format as "March 11, 2025 at 10:06 AM"
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) + ' at ' + 
      date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
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
          sx={{ color: 'primary.main' }} 
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        All Users ({users.length})
      </Typography>
      
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rating</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rents</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ mr: 2, bgcolor: 'secondary.main' }}
                    >
                      {user.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography>{user.name || 'Unknown'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ color: 'gold', mr: 0.5 }} />
                    <Typography>{user.totalAverageWeightRatings?.toFixed(1) || 'N/A'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.numberOfRents || '0'} 
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>{formatDate(user.recentlyActive)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 3, 
          bgcolor: 'rgba(25, 118, 210, 0.05)', 
          maxWidth: 500,
          border: '1px dashed rgba(25, 118, 210, 0.3)',
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            This table shows all registered users along with their activity statistics.
            Active users are highlighted, and users are sorted by their most recent activity.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AllUsers;