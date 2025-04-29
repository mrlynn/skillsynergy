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
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    location: '',
    avatar: '',
    isOpenToCollab: true,
    social: {
      github: '',
      linkedin: ''
    }
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loadingSample, setLoadingSample] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || '',
        isOpenToCollab: user.isOpenToCollab ?? true,
        social: {
          github: user.social?.github || '',
          linkedin: user.social?.linkedin || ''
        }
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        bio: '',
        location: '',
        avatar: '',
        isOpenToCollab: true,
        social: {
          github: '',
          linkedin: ''
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', bio: '', location: '', avatar: '', isOpenToCollab: true, social: { github: '', linkedin: '' } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUser ? `/api/users?id=${editingUser._id}` : '/api/users';
    const method = editingUser ? 'PUT' : 'POST';
    const body = { ...formData };
    if (!body.password) delete body.password;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      fetchUsers();
      handleClose();
      setSnackbar({ open: true, message: editingUser ? 'User updated!' : 'User added!', severity: 'success' });
    } else {
      const data = await res.json();
      setSnackbar({ open: true, message: data.error || 'Error', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
        setSnackbar({ open: true, message: 'User deleted!', severity: 'success' });
      } else {
        const data = await res.json();
        setSnackbar({ open: true, message: data.error || 'Error', severity: 'error' });
      }
    }
  };

  const handleLoadSampleData = async () => {
    setLoadingSample(true);
    try {
      const res = await fetch('/api/users/sample-data', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.details || 'Failed to load sample users');
      }
      fetchUsers();
      setSnackbar({ open: true, message: 'Sample users loaded!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Users</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={handleLoadSampleData}
            disabled={loadingSample}
          >
            {loadingSample ? 'Loading...' : 'Load Sample Data'}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
            Add User
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatar} alt={user.name}>
                      {user.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }} noWrap>
                        {user.bio || 'No bio provided'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.email}</Typography>
                  {user.social && (
                    <Box sx={{ mt: 1 }}>
                      {user.social.github && (
                        <Chip
                          size="small"
                          label="GitHub"
                          variant="outlined"
                          sx={{ mr: 0.5 }}
                        />
                      )}
                      {user.social.linkedin && (
                        <Chip
                          size="small"
                          label="LinkedIn"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {user.location || 'Not specified'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {user.skills?.slice(0, 2).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill.name || 'Unknown Skill'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {user.skills?.length > 2 && (
                      <Tooltip title={user.skills.slice(2).map(s => s.name).join(', ')}>
                        <Chip
                          label={`+${user.skills.length - 2}`}
                          size="small"
                          variant="outlined"
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isOpenToCollab ? 'Open to Collab' : 'Not Available'}
                    color={user.isOpenToCollab ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar
                src={formData.avatar}
                alt={formData.name}
                sx={{ width: 64, height: 64 }}
              >
                {formData.name?.charAt(0)}
              </Avatar>
              <TextField
                label="Avatar URL"
                fullWidth
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </Box>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingUser ? 'Leave blank to keep current password' : ''}
            />
            <TextField
              margin="dense"
              label="Bio"
              fullWidth
              multiline
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="GitHub Username"
                fullWidth
                value={formData.social.github}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, github: e.target.value }
                })}
              />
              <TextField
                label="LinkedIn Username"
                fullWidth
                value={formData.social.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, linkedin: e.target.value }
                })}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant={formData.isOpenToCollab ? "contained" : "outlined"}
                color={formData.isOpenToCollab ? "success" : "default"}
                onClick={() => setFormData({ ...formData, isOpenToCollab: !formData.isOpenToCollab })}
              >
                {formData.isOpenToCollab ? "Open to Collaboration" : "Not Available"}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingUser ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 