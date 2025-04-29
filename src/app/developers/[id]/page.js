'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  IconButton,
  Link
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import { useParams } from 'next/navigation';

export default function DeveloperProfile() {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeveloperData();
  }, [id]);

  const fetchDeveloperData = async () => {
    try {
      // Fetch developer profile
      const devRes = await fetch(`/api/users/${id}`);
      const devData = await devRes.json();
      setDeveloper(devData);

      // Fetch developer's projects
      const projectsRes = await fetch(`/api/projects?owner=${id}`);
      const projectsData = await projectsRes.json();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching developer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!developer) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Developer not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Profile Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={developer.avatar}
              alt={developer.name}
              sx={{ width: 200, height: 200, mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {developer.social?.github && (
                <IconButton 
                  href={`https://github.com/${developer.social.github}`}
                  target="_blank"
                  size="large"
                >
                  <GitHubIcon />
                </IconButton>
              )}
              {developer.social?.linkedin && (
                <IconButton 
                  href={`https://linkedin.com/in/${developer.social.linkedin}`}
                  target="_blank"
                  size="large"
                >
                  <LinkedInIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h3" gutterBottom>
                  {developer.name}
                </Typography>
                {developer.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationOnIcon color="action" />
                    <Typography color="text.secondary">
                      {developer.location}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Button
                variant="contained"
                startIcon={<EmailIcon />}
                href={`mailto:${developer.email}`}
              >
                Contact
              </Button>
            </Box>
            <Typography variant="body1" paragraph>
              {developer.bio}
            </Typography>
            {developer.isOpenToCollab && (
              <Chip 
                label="Open to Collaboration" 
                color="success" 
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Skills Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Skills
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {developer.skills?.map((skill, index) => (
            <Chip
              key={index}
              label={skill.name}
              variant="outlined"
              sx={{ 
                px: 1,
                borderColor: 'primary.main',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Projects Section */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Projects
        </Typography>
        {projects.length > 0 ? (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} key={project._id}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3,
                    '&:hover': {
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {project.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip 
                          label={project.type} 
                          size="small"
                          icon={<WorkIcon />}
                        />
                        <Chip 
                          label={project.status} 
                          size="small"
                          color={project.status === 'active' ? 'success' : 'default'}
                        />
                      </Box>
                    </Box>
                    <Button 
                      variant="outlined"
                      size="small"
                      component={Link}
                      href={`/projects/${project._id}`}
                    >
                      View Project
                    </Button>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.requiredSkills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill.skill?.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            No projects yet
          </Typography>
        )}
      </Paper>
    </Container>
  );
} 