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
  Checkbox,
  FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { sampleMessages } from '@/data/sampleData';

const messageTypes = ['project', 'match', 'user', 'system'];

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [matches, setMatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [formData, setFormData] = useState({
    sender: '',
    recipient: '',
    content: '',
    type: 'user',
    contextType: '',
    contextReference: '',
    isRead: false,
    metadata: {
      priority: 'normal',
      tags: []
    }
  });
  const [loadingSample, setLoadingSample] = useState(false);
  const [sampleSuccess, setSampleSuccess] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
    fetchProjects();
    fetchMatches();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch('/api/messages');
    const data = await res.json();
    setMessages(data);
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  const fetchMatches = async () => {
    const res = await fetch('/api/matches');
    const data = await res.json();
    setMatches(data);
  };

  const handleOpen = (message = null) => {
    if (message) {
      setEditingMessage(message);
      setFormData({
        sender: message.sender?._id || '',
        recipient: message.recipient?._id || '',
        content: message.content,
        type: message.type,
        contextType: message.contextType || '',
        contextReference: message.contextReference || '',
        isRead: message.isRead,
        metadata: message.metadata || {
          priority: 'normal',
          tags: []
        }
      });
    } else {
      setEditingMessage(null);
      setFormData({
        sender: '',
        recipient: '',
        content: '',
        type: 'user',
        contextType: '',
        contextReference: '',
        isRead: false,
        metadata: {
          priority: 'normal',
          tags: []
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingMessage 
      ? `/api/messages?id=${editingMessage._id}`
      : '/api/messages';
    const method = editingMessage ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchMessages();
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchMessages();
      }
    }
  };

  const handleLoadSampleData = async () => {
    setLoadingSample(true);
    try {
      // First, clear existing messages
      const deleteRes = await fetch('/api/messages', {
        method: 'DELETE'
      });
      
      if (!deleteRes.ok) {
        throw new Error('Failed to clear existing messages');
      }

      // Then, load sample messages
      for (const message of sampleMessages) {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });

        if (!res.ok) {
          throw new Error(`Failed to create message: ${message.type}`);
        }
      }

      setSampleSuccess(true);
      fetchMessages();
    } catch (error) {
      console.error('Error loading sample data:', error);
      setSampleSuccess(false);
    } finally {
      setLoadingSample(false);
    }
  };

  const getContextLabel = (message) => {
    if (!message.contextType || !message.contextReference) return '-';
    
    switch (message.contextType) {
      case 'project':
        return projects.find(p => p._id === message.contextReference)?.title || '-';
      case 'match':
        const match = matches.find(m => m._id === message.contextReference);
        return match ? `${match.type} match` : '-';
      default:
        return '-';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Messages</Typography>
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
            Add Message
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Sender</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Context</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message._id}>
                <TableCell>
                  <Chip 
                    label={message.type} 
                    color="primary" 
                    size="small"
                  />
                </TableCell>
                <TableCell>{message.sender?.name || '-'}</TableCell>
                <TableCell>{message.recipient?.name || '-'}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {message.content.slice(0, 50)}...
                  </Typography>
                </TableCell>
                <TableCell>{getContextLabel(message)}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    {message.isRead ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(message)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(message._id)}>
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
          {editingMessage ? 'Edit Message' : 'Add Message'}
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
                {messageTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Sender</InputLabel>
              <Select
                value={formData.sender}
                onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                required
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Recipient</InputLabel>
              <Select
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                required
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Context Type</InputLabel>
              <Select
                value={formData.contextType}
                onChange={(e) => setFormData({ ...formData, contextType: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="project">Project</MenuItem>
                <MenuItem value="match">Match</MenuItem>
              </Select>
            </FormControl>
            {formData.contextType && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Context Reference</InputLabel>
                <Select
                  value={formData.contextReference}
                  onChange={(e) => setFormData({ ...formData, contextReference: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  {formData.contextType === 'project' && 
                    projects.map((project) => (
                      <MenuItem key={project._id} value={project._id}>
                        {project.title}
                      </MenuItem>
                    ))}
                  {formData.contextType === 'match' && 
                    matches.map((match) => (
                      <MenuItem key={match._id} value={match._id}>
                        {match.type} match
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isRead}
                  onChange={(e) => setFormData({ ...formData, isRead: e.target.checked })}
                />
              }
              label="Mark as read"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Metadata</Typography>
              <FormControl fullWidth margin="dense">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.metadata.priority}
                  onChange={(e) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, priority: e.target.value }
                  })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingMessage ? 'Update' : 'Add'}
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
          Sample messages loaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 