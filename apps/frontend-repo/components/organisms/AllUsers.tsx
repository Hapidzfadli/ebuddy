import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CircularProgress, 
  Alert,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  SelectChangeEvent
} from '@mui/material';
import { 
  StarRate as StarIcon
} from '@mui/icons-material';
import Typography from '../atoms/Typography';
import { fetchAllUsers } from '../../apis/userApi';
import { User } from '@ebuddy/shared';

// Extend the User interface to include potentialScore
interface ExtendedUser extends User {
  potentialScore?: number;
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocId, setLastDocId] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'potential' | 'ratings' | 'rents' | 'activity'>('potential');

  const fetchUsersList = async (reset = false) => {
    try {
      setLoading(true);
      // If reset is true or lastDocId is null, we pass undefined, otherwise we pass lastDocId
      const newLastDocId = reset ? undefined : lastDocId;
      
      const result = await fetchAllUsers(10, newLastDocId, sortBy);
      
      if (reset) {
        setUsers(result.users as ExtendedUser[]);
      } else {
        setUsers(prev => [...prev, ...(result.users as ExtendedUser[])]);
      }
      
      // Store the lastDocId for pagination
      setLastDocId(result.pagination.lastDocId || undefined);
      setHasMore(result.pagination.hasMore);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchUsersList(false);
    }
  };

  // Explicitly typed function to handle sort change
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    console.log('Sort changed to:', event.target.value);
    // Type cast the value to our specific type
    const newSortValue = event.target.value as 'potential' | 'ratings' | 'rents' | 'activity';
    setSortBy(newSortValue);
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

  if (loading && users.length === 0) {
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

  if (error && users.length === 0) {
    return (
      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          All Users ({users.length})
        </Typography>
        
        <FormControl 
          variant="outlined" 
          size="small" 
          sx={{ 
            minWidth: 200, 
            zIndex: 100, // Ensure it's above other elements
            position: 'relative' // Establish a stacking context
          }}
        >
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by-select"
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
            MenuProps={{
              // Ensure the dropdown menu appears above other elements
              sx: { zIndex: 9999 }
            }}
          >
            <MenuItem value="potential">Potential Score</MenuItem>
            <MenuItem value="ratings">Ratings</MenuItem>
            <MenuItem value="rents">Number of Rents</MenuItem>
            <MenuItem value="activity">Recent Activity</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rating</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rents</TableCell>
              {sortBy === 'potential' && (
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Potential Score</TableCell>
              )}
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
                {sortBy === 'potential' && (
                  <TableCell>
                    <Chip 
                      label={user.potentialScore?.toFixed(2) || 'N/A'} 
                      color="success"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                )}
                <TableCell>{formatDate(user.recentlyActive)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        {hasMore && (
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </Box>
      
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
            {sortBy === 'potential' && ' Users are ranked by their potential score based on ratings, number of rents, and recent activity.'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AllUsers;