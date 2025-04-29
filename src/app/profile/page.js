'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Chip,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PreviewIcon from '@mui/icons-material/Preview';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [formData, setFormData] = useState({
    bio: '',
    experienceLevel: '',
    availability: {
      startDate: null,
      endDate: null,
      hoursPerWeek: 0,
    },
    preferences: {
      projectTypes: [],
      minBudget: 0,
      maxBudget: 0,
      timezone: '',
    },
  });
  const [activeTab, setActiveTab] = useState(0);
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchUserProfile();
      fetchSkills();
    }
  }, [status, router]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/users/profile');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          bio: data.bio || '',
          experienceLevel: data.experienceLevel || '',
          availability: {
            startDate: data.availability?.startDate ? new Date(data.availability.startDate) : null,
            endDate: data.availability?.endDate ? new Date(data.availability.endDate) : null,
            hoursPerWeek: data.availability?.hoursPerWeek || 0,
          },
          preferences: {
            projectTypes: data.preferences?.projectTypes || [],
            minBudget: data.preferences?.minBudget || 0,
            maxBudget: data.preferences?.maxBudget || 0,
            timezone: data.preferences?.timezone || '',
          },
        });
        setUserSkills(data.skills || []);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          skills: userSkills,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleMatch = async () => {
    setMatching(true);
    try {
      const res = await fetch('/api/matches/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to generate matches');
      }
    } catch (error) {
      console.error('Error generating matches:', error);
      setError('Failed to generate matches');
    } finally {
      setMatching(false);
    }
  };

  const renderProfilePreview = () => (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Profile Preview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="text.secondary">
            Bio
          </Typography>
          <Typography variant="body1" paragraph>
            {formData.bio || 'No bio provided'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" color="text.secondary">
            Experience Level
          </Typography>
          <Typography variant="body1">
            {formData.experienceLevel || 'Not specified'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" color="text.secondary">
            Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {userSkills.map((skill) => (
              <Chip key={skill._id} label={skill.name} />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" color="text.secondary">
            Availability
          </Typography>
          <Typography variant="body1">
            {formData.availability.startDate && formData.availability.endDate
              ? `${new Date(formData.availability.startDate).toLocaleDateString()} - ${new Date(formData.availability.endDate).toLocaleDateString()}`
              : 'Not specified'}
          </Typography>
          <Typography variant="body1">
            {formData.availability.hoursPerWeek
              ? `${formData.availability.hoursPerWeek} hours/week`
              : 'Hours not specified'}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" color="text.secondary">
            Project Preferences
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.preferences.projectTypes.map((type) => (
              <Chip key={type} label={type} />
            ))}
          </Box>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Budget Range: ${formData.preferences.minBudget} - ${formData.preferences.maxBudget}
          </Typography>
          <Typography variant="body1">
            Timezone: {formData.preferences.timezone || 'Not specified'}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderMatches = () => (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Your Matches
      </Typography>
      {matches.length > 0 ? (
        <Grid container spacing={2}>
          {matches.map((match) => (
            <Grid item xs={12} key={match._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{match.project.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Match Score: {match.score.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {match.reason}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => router.push(`/projects/${match.project._id}`)}
                  >
                    View Project
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No matches found. Update your profile and try matching again.
        </Typography>
      )}
    </Paper>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {activeTab === 0 ? 'Profile updated successfully!' : 'Matches generated successfully!'}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Edit Profile" />
        <Tab label="Preview Profile" />
        <Tab label="Find Matches" />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself and your experience..."
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    label="Experience Level"
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                <Autocomplete
                  multiple
                  options={skills}
                  getOptionLabel={(option) => option.name}
                  value={userSkills}
                  onChange={(event, newValue) => {
                    setUserSkills(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Your Skills"
                      placeholder="Add your skills..."
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option._id}
                        label={option.name}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Availability
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Available From"
                    value={formData.availability.startDate}
                    onChange={(newValue) => {
                      setFormData({
                        ...formData,
                        availability: {
                          ...formData.availability,
                          startDate: newValue,
                        },
                      });
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Available Until"
                    value={formData.availability.endDate}
                    onChange={(newValue) => {
                      setFormData({
                        ...formData,
                        availability: {
                          ...formData.availability,
                          endDate: newValue,
                        },
                      });
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Hours Available Per Week"
                  value={formData.availability.hoursPerWeek}
                  onChange={(e) => setFormData({
                    ...formData,
                    availability: {
                      ...formData.availability,
                      hoursPerWeek: parseInt(e.target.value),
                    },
                  })}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Project Preferences
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Project Types</InputLabel>
                  <Select
                    multiple
                    value={formData.preferences.projectTypes}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        projectTypes: e.target.value,
                      },
                    })}
                    label="Preferred Project Types"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="freelance">Freelance</MenuItem>
                    <MenuItem value="part-time">Part-time</MenuItem>
                    <MenuItem value="full-time">Full-time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Budget (USD)"
                  value={formData.preferences.minBudget}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      minBudget: parseInt(e.target.value),
                    },
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Budget (USD)"
                  value={formData.preferences.maxBudget}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      maxBudget: parseInt(e.target.value),
                    },
                  })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Timezone"
                  value={formData.preferences.timezone}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      timezone: e.target.value,
                    },
                  })}
                  placeholder="e.g., UTC-5, EST, PST"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={saving}
                  sx={{ mt: 2 }}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {activeTab === 1 && renderProfilePreview()}

      {activeTab === 2 && (
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AutoAwesomeIcon />}
            onClick={handleMatch}
            disabled={matching}
            sx={{ mb: 3 }}
          >
            {matching ? 'Finding Matches...' : 'Find Matches'}
          </Button>
          {renderMatches()}
        </Box>
      )}
    </Container>
  );
} 