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
  FormControlLabel,
  Switch,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { sampleSkills } from '@/data/sampleData';

const skillCategories = [
  'development',
  'design',
  'marketing',
  'writing',
  'business',
  'data',
  'product',
  'other'
];

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    parent: '',
    complementarySkills: [],
    verification: {
      required: false,
      methods: []
    }
  });
  const [loadingSample, setLoadingSample] = useState(false);
  const [sampleSuccess, setSampleSuccess] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      if (!res.ok) {
        throw new Error('Failed to fetch skills');
      }
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleOpen = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        description: skill.description,
        parent: skill.parent?._id || '',
        complementarySkills: skill.complementarySkills?.map(s => s._id) || [],
        verification: {
          required: skill.verification?.required || false,
          methods: skill.verification?.methods || []
        }
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        category: '',
        description: '',
        parent: '',
        complementarySkills: [],
        verification: {
          required: false,
          methods: []
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingSkill 
      ? `/api/skills?id=${editingSkill._id}`
      : '/api/skills';
    const method = editingSkill ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchSkills();
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      const res = await fetch(`/api/skills?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchSkills();
      }
    }
  };

  const handleLoadSampleData = async () => {
    setLoadingSample(true);
    try {
      // First, clear existing skills
      const deleteRes = await fetch('/api/skills', {
        method: 'DELETE'
      });
      
      if (!deleteRes.ok) {
        throw new Error('Failed to clear existing skills');
      }

      // Then, load sample skills
      for (const skill of sampleSkills) {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(skill),
        });

        if (!res.ok) {
          throw new Error(`Failed to create skill: ${skill.name}`);
        }
      }

      setSampleSuccess(true);
      fetchSkills();
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
        <Typography variant="h5">Skills</Typography>
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
            Add Skill
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Complementary Skills</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill._id}>
                <TableCell>{skill.name}</TableCell>
                <TableCell>{skill.category}</TableCell>
                <TableCell>{skill.description}</TableCell>
                <TableCell>
                  {skill.parent ? (
                    <Chip 
                      label={skills.find(s => s._id === skill.parent)?.name || 'Unknown'} 
                      size="small"
                    />
                  ) : (
                    <Chip label="None" size="small" color="default" />
                  )}
                </TableCell>
                <TableCell>
                  {skill.complementarySkills?.map(skillId => {
                    const compSkill = skills.find(s => s._id === skillId);
                    return compSkill ? (
                      <Chip 
                        key={skillId} 
                        label={compSkill.name} 
                        size="small" 
                        sx={{ mr: 0.5 }}
                      />
                    ) : null;
                  }).filter(Boolean)}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(skill)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(skill._id)}>
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
          {editingSkill ? 'Edit Skill' : 'Add Skill'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {skillCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Parent Skill</InputLabel>
              <Select
                value={formData.parent}
                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {skills.map((skill) => (
                  <MenuItem key={skill._id} value={skill._id}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Complementary Skills</InputLabel>
              <Select
                multiple
                value={formData.complementarySkills}
                onChange={(e) => setFormData({ ...formData, complementarySkills: e.target.value })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const skill = skills.find(s => s._id === value);
                      return (
                        <Chip key={value} label={skill?.name} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {skills.map((skill) => (
                  <MenuItem key={skill._id} value={skill._id}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.verification.required}
                  onChange={(e) => setFormData({
                    ...formData,
                    verification: {
                      ...formData.verification,
                      required: e.target.checked
                    }
                  })}
                />
              }
              label="Verification Required"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingSkill ? 'Update' : 'Add'}
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
          Sample skills loaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 