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
  Autocomplete
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { sampleProjects } from '@/data/sampleData';

const projectStatuses = ['draft', 'active', 'completed', 'cancelled'];
const projectTypes = ['freelance', 'collaboration', 'hiring'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    type: 'collaboration',
    requiredSkills: [],
    budget: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    timeline: {
      startDate: '',
      endDate: '',
      estimatedDuration: ''
    },
    owner: '',
    team: []
  });
  const [loadingSample, setLoadingSample] = useState(false);
  const [sampleSuccess, setSampleSuccess] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    console.log('Fetched projects:', data);
    setProjects(data);
  };

  const fetchSkills = async () => {
    const res = await fetch('/api/skills');
    const data = await res.json();
    setSkills(data);
  };

  const getTypeLabel = (type) => {
    if (!type) return 'Not specified';
    const found = projectTypes.find(t => t === type);
    return found ? found.charAt(0).toUpperCase() + found.slice(1) : type;
  };

  const handleOpen = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        status: project.status,
        type: project.type || 'collaboration',
        requiredSkills: project.requiredSkills?.map(s => s.skill) || [],
        budget: project.budget || {
          min: 0,
          max: 0,
          currency: 'USD'
        },
        timeline: {
          startDate: project.timeline?.startDate ? new Date(project.timeline.startDate).toISOString().split('T')[0] : '',
          endDate: project.timeline?.endDate ? new Date(project.timeline.endDate).toISOString().split('T')[0] : '',
          estimatedDuration: project.timeline?.estimatedDuration || ''
        }
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        status: 'draft',
        type: 'collaboration',
        requiredSkills: [],
        budget: {
          min: 0,
          max: 0,
          currency: 'USD'
        },
        timeline: {
          startDate: '',
          endDate: '',
          estimatedDuration: ''
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProject 
        ? `/api/projects?id=${editingProject._id}`
        : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      // Format dates for submission
      const submitData = {
        ...formData,
        timeline: {
          ...formData.timeline,
          startDate: formData.timeline.startDate ? new Date(formData.timeline.startDate) : null,
          endDate: formData.timeline.endDate ? new Date(formData.timeline.endDate) : null
        }
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to save project');
      }

      fetchProjects();
      handleClose();
    } catch (error) {
      console.error('Error saving project:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchProjects();
      }
    }
  };

  const handleLoadSampleData = async () => {
    setLoadingSample(true);
    setSampleSuccess(false);
    try {
      // First, check if we have skills in the database
      const skillsRes = await fetch('/api/skills');
      if (!skillsRes.ok) {
        throw new Error('Failed to fetch skills');
      }
      const skills = await skillsRes.json();
      
      if (!skills || skills.length === 0) {
        // If no skills exist, load sample skills first
        const loadSkillsRes = await fetch('/api/skills/sample-data', {
          method: 'POST'
        });
        if (!loadSkillsRes.ok) {
          throw new Error('Failed to load sample skills');
        }
        // Wait a moment for skills to be loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Now load sample projects
      const res = await fetch('/api/projects/sample-data', {
        method: 'POST'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to load sample projects');
      }

      setSampleSuccess(true);
      fetchProjects();
    } catch (error) {
      console.error('Error loading sample data:', error);
      setSampleSuccess(false);
      // You might want to show an error message to the user here
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Projects</Typography>
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
            Add Project
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Required Skills</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Timeline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => {
              console.log('Project in table:', project);
              return (
                <TableRow key={project._id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>
                    <Chip 
                      label={project.type ? project.type.charAt(0).toUpperCase() + project.type.slice(1) : 'Not specified'} 
                      color={project.type ? 'primary' : 'default'}
                      size="small"
                      sx={{ minWidth: '100px' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={project.status} 
                      color={
                        project.status === 'active' ? 'success' : 
                        project.status === 'completed' ? 'info' :
                        project.status === 'cancelled' ? 'error' : 'default'
                      } 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {project.requiredSkills?.slice(0, 2).map((s, index) => (
                      <Chip 
                        key={index}
                        label={s.skill?.name || 'Unknown Skill'} 
                        size="small" 
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                    {project.requiredSkills?.length > 2 && (
                      <Chip 
                        label={`+${project.requiredSkills.length - 2} more`} 
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {project.budget?.currency} {project.budget?.min} - {project.budget?.max}
                  </TableCell>
                  <TableCell>
                    {project.timeline?.startDate && project.timeline?.endDate ? (
                      <Box>
                        <Typography variant="caption" display="block">
                          {new Date(project.timeline.startDate).toLocaleDateString()} - {new Date(project.timeline.endDate).toLocaleDateString()}
                        </Typography>
                        {project.timeline?.estimatedDuration && (
                          <Typography variant="caption" color="textSecondary">
                            ({project.timeline.estimatedDuration})
                          </Typography>
                        )}
                      </Box>
                    ) : 'Not specified'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(project)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(project._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProject ? 'Edit Project' : 'Add Project'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
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
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                {projectStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                {projectTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Required Skills</InputLabel>
              <Select
                multiple
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const skill = skills.find(s => s._id === value);
                      return (
                        <Chip key={value} label={skill?.name || 'Unknown Skill'} size="small" />
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
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="Min Budget"
                type="number"
                value={formData.budget.min}
                onChange={(e) => setFormData({
                  ...formData,
                  budget: { ...formData.budget, min: Number(e.target.value) }
                })}
              />
              <TextField
                label="Max Budget"
                type="number"
                value={formData.budget.max}
                onChange={(e) => setFormData({
                  ...formData,
                  budget: { ...formData.budget, max: Number(e.target.value) }
                })}
              />
              <FormControl>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.budget.currency}
                  onChange={(e) => setFormData({
                    ...formData,
                    budget: { ...formData.budget, currency: e.target.value }
                  })}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                value={formData.timeline.startDate}
                onChange={(e) => setFormData({
                  ...formData,
                  timeline: { ...formData.timeline, startDate: e.target.value }
                })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={formData.timeline.endDate}
                onChange={(e) => setFormData({
                  ...formData,
                  timeline: { ...formData.timeline, endDate: e.target.value }
                })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Estimated Duration"
                value={formData.timeline.estimatedDuration}
                onChange={(e) => setFormData({
                  ...formData,
                  timeline: { ...formData.timeline, estimatedDuration: e.target.value }
                })}
                placeholder="e.g., 3 months"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProject ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={sampleSuccess === true}
        autoHideDuration={6000}
        onClose={() => setSampleSuccess(null)}
      >
        <Alert severity="success">
          Sample projects loaded successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={sampleSuccess === false}
        autoHideDuration={6000}
        onClose={() => setSampleSuccess(null)}
      >
        <Alert severity="error">
          Failed to load sample projects. Please try again later.
        </Alert>
      </Snackbar>
    </Box>
  );
} 