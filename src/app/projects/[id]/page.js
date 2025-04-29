'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Avatar,
  Divider,
  Link
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
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

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Project not found</Typography>
      </Container>
    );
  }

  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' },
    { label: project.title }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Breadcrumbs items={breadcrumbItems} />
      {/* Project Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h3" gutterBottom>
                  {project.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    icon={<WorkIcon />}
                    label={project.type} 
                    color="primary"
                  />
                  <Chip 
                    label={project.status} 
                    color={project.status === 'active' ? 'success' : 'default'}
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={() => {/* TODO: Implement apply/collaborate logic */}}
              >
                {project.type === 'collaboration' ? 'Collaborate' : 'Apply'}
              </Button>
            </Box>
            <Typography variant="body1" paragraph>
              {project.description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Project Details */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Required Skills */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Required Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {project.requiredSkills?.map((skill, index) => (
                <Chip
                  key={index}
                  label={`${skill.skill?.name} (${skill.level})`}
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

          {/* Project Timeline */}
          {(project.startDate || project.endDate || project.estimatedDuration) && (
            <Paper sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon />
                Timeline
              </Typography>
              <Grid container spacing={2}>
                {project.startDate && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography>
                      {new Date(project.startDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
                {project.endDate && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      End Date
                    </Typography>
                    <Typography>
                      {new Date(project.endDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
                {project.estimatedDuration && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estimated Duration
                    </Typography>
                    <Typography>
                      {project.estimatedDuration}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Project Owner */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon />
              Project Owner
            </Typography>
            {project.owner ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  cursor: 'pointer',
                  p: 2,
                  '&:hover': {
                    bgcolor: 'grey.50'
                  }
                }}
                onClick={() => project.owner._id && router.push(`/developers/${project.owner._id}`)}
              >
                <Avatar
                  src={project.owner.avatar}
                  alt={project.owner.name}
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="h6">
                    {project.owner.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {project.owner.bio}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography color="text.secondary">
                Owner information not available
              </Typography>
            )}
          </Paper>

          {/* Budget Info */}
          {project.budget && (project.budget.min > 0 || project.budget.max > 0) && (
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWalletIcon />
                Budget
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Budget Range
                </Typography>
                <Typography variant="h6">
                  ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
} 