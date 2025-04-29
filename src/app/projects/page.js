'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Autocomplete,
  Button,
  Chip,
  Paper,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HandshakeIcon from '@mui/icons-material/Handshake';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';

export default function ProjectsDirectory() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [projectType, setProjectType] = useState('');
  const [showBudget, setShowBudget] = useState('all');

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, search, selectedSkills, projectType, showBudget]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      setFiltered(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (search) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((project) =>
        selectedSkills.every((skill) =>
          project.requiredSkills?.some((s) => s.skill?.name === skill.name)
        )
      );
    }

    if (projectType) {
      filtered = filtered.filter((project) => project.type === projectType);
    }

    if (showBudget !== 'all') {
      filtered = filtered.filter((project) => 
        showBudget === 'free' 
          ? !project.budget?.min && !project.budget?.max
          : project.budget?.min > 0 || project.budget?.max > 0
      );
    }

    setFiltered(filtered);
  };

  const getProjectTypeIcon = (type) => {
    switch (type) {
      case 'collaboration':
        return <GroupsIcon fontSize="small" />;
      case 'freelance':
        return <WorkIcon fontSize="small" />;
      default:
        return <HandshakeIcon fontSize="small" />;
    }
  };

  const getProjectTypeColor = (type) => {
    switch (type) {
      case 'collaboration':
        return '#4CAF50';
      case 'freelance':
        return '#2196F3';
      case 'hiring':
        return '#9C27B0';
      default:
        return 'grey.500';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Find Projects
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Connect with developers and collaborate on exciting projects
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <TextField
          placeholder="Search projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <Autocomplete
          multiple
          options={skills}
          getOptionLabel={(option) => option.name}
          value={selectedSkills}
          onChange={(_, value) => setSelectedSkills(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Required skills"
            />
          )}
          sx={{ minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={projectType}
            displayEmpty
            onChange={(e) => setProjectType(e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="collaboration">Collaboration</MenuItem>
            <MenuItem value="freelance">Freelance</MenuItem>
            <MenuItem value="hiring">Hiring</MenuItem>
          </Select>
        </FormControl>
        
        <ToggleButtonGroup
          value={showBudget}
          exclusive
          onChange={(_, value) => value && setShowBudget(value)}
          size="small"
        >
          <ToggleButton value="all">
            All
          </ToggleButton>
          <ToggleButton value="free">
            Free Collaboration
          </ToggleButton>
          <ToggleButton value="paid">
            Paid Projects
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filtered.map((project) => (
          <Paper
            key={project._id}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              bgcolor: 'background.paper',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" component="h2">
                  {project.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    icon={getProjectTypeIcon(project.type)}
                    label={project.type}
                    size="small"
                    sx={{
                      bgcolor: `${getProjectTypeColor(project.type)}15`,
                      color: getProjectTypeColor(project.type),
                      '& .MuiChip-label': { px: 1 },
                      '& .MuiChip-icon': { color: 'inherit' }
                    }}
                  />
                  {project.budget?.min > 0 && (
                    <Chip
                      label="Paid"
                      size="small"
                      sx={{
                        bgcolor: 'grey.100',
                        color: 'text.secondary',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: getProjectTypeColor(project.type),
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: getProjectTypeColor(project.type)
                  }
                }}
                endIcon={getProjectTypeIcon(project.type)}
              >
                {project.type === 'collaboration' ? 'Join' : 'Apply'}
              </Button>
            </Box>

            <Typography variant="body2">
              {project.description}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Skills needed:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {project.requiredSkills?.slice(0, 3).map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill.skill?.name}
                      size="small"
                      sx={{
                        height: 20,
                        '& .MuiChip-label': { px: 1, fontSize: '0.75rem' }
                      }}
                    />
                  ))}
                  {project.requiredSkills?.length > 3 && (
                    <Typography variant="body2" color="text.secondary">
                      +{project.requiredSkills.length - 3} more
                    </Typography>
                  )}
                </Box>
              </Box>
              {project.budget?.min > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Budget: ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                </Typography>
              )}
            </Box>
          </Paper>
        ))}
        {filtered.length === 0 && (
          <Typography variant="h6" align="center" color="text.secondary">
            No projects found matching your criteria.
          </Typography>
        )}
      </Box>
    </Container>
  );
} 