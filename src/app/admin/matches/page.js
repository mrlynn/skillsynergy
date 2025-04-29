'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
  Rating
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { sampleMatches } from '@/data/sampleData';

const matchStatuses = ['pending', 'accepted', 'rejected', 'completed'];
const matchTypes = ['project', 'skill', 'collaboration'];

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [formData, setFormData] = useState({
    type: 'project',
    status: 'pending',
    project: '',
    user: '',
    score: 0,
    reason: '',
    feedback: {
      rating: 0,
      comment: ''
    }
  });
  const [loadingSample, setLoadingSample] = useState(false);
  const [sampleSuccess, setSampleSuccess] = useState(false);

  useEffect(() => {
    fetchMatches();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchMatches = async () => {
    const res = await fetch('/api/matches');
    const data = await res.json();
    setMatches(data);
  };

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const handleOpen = (match = null) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        type: match.type,
        status: match.status,
        project: match.project?._id || '',
        user: match.user?._id || '',
        score: match.score || 0,
        reason: match.reason || '',
        feedback: match.feedback || {
          rating: 0,
          comment: ''
        }
      });
    } else {
      setEditingMatch(null);
      setFormData({
        type: 'project',
        status: 'pending',
        project: '',
        user: '',
        score: 0,
        reason: '',
        feedback: {
          rating: 0,
          comment: ''
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMatch(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingMatch 
      ? `/api/matches?id=${editingMatch._id}`
      : '/api/matches';
    const method = editingMatch ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchMatches();
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      const res = await fetch(`/api/matches?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchMatches();
      }
    }
  };

  const handleLoadSampleData = async () => {
    setLoadingSample(true);
    try {
      // First, clear existing matches
      const deleteRes = await fetch('/api/matches', {
        method: 'DELETE'
      });
      
      if (!deleteRes.ok) {
        throw new Error('Failed to clear existing matches');
      }

      // Then, load sample matches
      for (const match of sampleMatches) {
        const res = await fetch('/api/matches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(match),
        });

        if (!res.ok) {
          throw new Error(`Failed to create match: ${match.type}`);
        }
      }

      setSampleSuccess(true);
      fetchMatches();
    } catch (error) {
      console.error('Error loading sample data:', error);
      setSampleSuccess(false);
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Matches</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLoadSampleData}
            disabled={loadingSample}
          >
            {loadingSample ? 'Loading...' : 'Load Sample Data'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Match
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match._id}>
                <TableCell>
                  <Chip 
                    label={match.type} 
                    color="primary" 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={match.status} 
                    color={
                      match.status === 'accepted' ? 'success' : 
                      match.status === 'rejected' ? 'error' :
                      match.status === 'completed' ? 'info' : 'default'
                    } 
                    size="small"
                  />
                </TableCell>
                <TableCell>{match.project?.title || '-'}</TableCell>
                <TableCell>{match.user?.name || '-'}</TableCell>
                <TableCell>
                  <Rating 
                    value={match.score} 
                    readOnly 
                    precision={0.5}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {match.feedback?.rating ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating 
                        value={match.feedback.rating} 
                        readOnly 
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {match.feedback.comment?.slice(0, 30)}...
                      </Typography>
                    </Box>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(match)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(match._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMatch ? 'Edit Match' : 'Add Match'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                {matchTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                {matchStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Project</InputLabel>
              <Select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>User</InputLabel>
              <Select
                value={formData.user}
                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Typography>Score:</Typography>
              <Rating
                value={formData.score}
                onChange={(e, newValue) => setFormData({ ...formData, score: newValue })}
                precision={0.5}
              />
            </Box>
            <TextField
              margin="dense"
              label="Reason"
              fullWidth
              multiline
              rows={2}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Feedback</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Typography>Rating:</Typography>
                <Rating
                  value={formData.feedback.rating}
                  onChange={(e, newValue) => setFormData({
                    ...formData,
                    feedback: { ...formData.feedback, rating: newValue }
                  })}
                  precision={0.5}
                />
              </Box>
              <TextField
                margin="dense"
                label="Comment"
                fullWidth
                multiline
                rows={2}
                value={formData.feedback.comment}
                onChange={(e) => setFormData({
                  ...formData,
                  feedback: { ...formData.feedback, comment: e.target.value }
                })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingMatch ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={sampleSuccess}
        autoHideDuration={6000}
        onClose={() => setSampleSuccess(false)}
      >
        <Alert severity="success">
          Sample matches loaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 