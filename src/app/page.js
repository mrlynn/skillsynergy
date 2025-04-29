'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  Chip,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function HomePage() {
  const router = useRouter();
  const [featuredDevs, setFeaturedDevs] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);

  useEffect(() => {
    fetchFeaturedDevelopers();
    fetchTrendingProjects();
  }, []);

  const fetchFeaturedDevelopers = async () => {
    try {
      const res = await fetch('/api/users?featured=true');
      const data = await res.json();
      setFeaturedDevs(data.slice(0, 4)); // Show top 4 featured developers
    } catch (error) {
      console.error('Error fetching featured developers:', error);
    }
  };

  const fetchTrendingProjects = async () => {
    try {
      const res = await fetch('/api/projects?trending=true');
      const data = await res.json();
      setTrendingProjects(data.slice(0, 3)); // Show top 3 trending projects
    } catch (error) {
      console.error('Error fetching trending projects:', error);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?developer)',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Increase the priority of the hero background image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', py: 8 }}>
          <Typography
            component="h1"
            variant="h2"
            color="inherit"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image src="/images/skillsynergy-circle-color.png" alt="Logo" width={300} height={300} />
            </Box>
            Connect. Collaborate. Create.
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Find the perfect developer for your project or join exciting projects that match your skills.
            Build your portfolio and grow your network in our collaborative community.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/projects')}
              startIcon={<WorkIcon />}
            >
              Find Projects
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/developers')}
              startIcon={<GroupsIcon />}
            >
              Find Developers
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Featured Developers Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
            Featured Developers
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push('/developers')}
            endIcon={<TrendingUpIcon />}
          >
            View All
          </Button>
        </Box>
        <Grid container spacing={2}>
          {featuredDevs.map((dev) => (
            <Grid item key={dev._id} xs={12}>
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'grey.50'
                  },
                  py: 2
                }}
                onClick={() => router.push(`/developers/${dev._id}`)}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar
                    src={dev.avatar}
                    alt={dev.name}
                    sx={{ width: 64, height: 64 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {dev.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dev.bio}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {dev.skills?.slice(0, 3).map((skill, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'grey.300'
                      }}
                    />
                  ))}
                </Box>
              </Box>
              {dev._id !== featuredDevs[featuredDevs.length - 1]._id && (
                <Divider />
              )}
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Trending Projects Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2">
              Trending Projects
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push('/projects')}
              endIcon={<TrendingUpIcon />}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={4}>
            {trendingProjects.map((project) => (
              <Grid item key={project._id} xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {project.title}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={project.type}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={project.status}
                        color={project.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" paragraph>
                      {project.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {project.requiredSkills?.slice(0, 3).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill.skill?.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Budget: ${project.budget?.min} - ${project.budget?.max}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => router.push(`/projects/${project._id}`)}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
} 