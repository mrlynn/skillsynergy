"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Avatar,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from '@mui/icons-material/Groups';
import FilterListIcon from '@mui/icons-material/FilterList';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function DevelopersDirectory() {
  const [developers, setDevelopers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevelopers();
    fetchSkills();
  }, []);

  useEffect(() => {
    filterDevelopers();
  }, [developers, search, selectedSkills, location, availability]);

  const fetchDevelopers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setDevelopers(data);
    } catch (error) {
      console.error('Error fetching developers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(data);
  };

  const filterDevelopers = () => {
    let filtered = [...developers];
    if (search) {
      filtered = filtered.filter((dev) =>
        dev.name.toLowerCase().includes(search.toLowerCase()) ||
        dev.bio?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((dev) =>
        selectedSkills.every((skill) =>
          dev.skills?.some((s) => s.name === skill.name)
        )
      );
    }
    if (location) {
      filtered = filtered.filter((dev) =>
        dev.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (availability) {
      filtered = filtered.filter((dev) =>
        availability === "open"
          ? dev.isOpenToCollab
          : !dev.isOpenToCollab
      );
    }
    setFiltered(filtered);
  };

  const breadcrumbItems = [
    { label: 'Developers' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Breadcrumbs items={breadcrumbItems} />
      <Typography variant="h4" gutterBottom>
        Find Developers
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <TextField
          placeholder="Search by name or bio"
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
              placeholder="Skills"
            />
          )}
          sx={{ minWidth: 250 }}
        />
        <TextField
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ minWidth: 180 }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={availability}
            displayEmpty
            onChange={(e) => setAvailability(e.target.value)}
          >
            <MenuItem value="">Availability</MenuItem>
            <MenuItem value="open">Open to Collab</MenuItem>
            <MenuItem value="closed">Not Available</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filtered.map((dev) => (
          <Paper
            key={dev._id}
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar
                  src={dev.avatar}
                  alt={dev.name}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6" component="h2">
                    {dev.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dev.location}
                  </Typography>
                  <Chip
                    label={dev.isOpenToCollab ? "Open to Collab" : "Not Available"}
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: 'grey.100',
                      color: 'text.secondary',
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: 'common.black',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'grey.800'
                  }
                }}
                endIcon={<GroupsIcon />}
              >
                Connect
              </Button>
            </Box>

            <Typography variant="body2">
              {dev.bio}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {dev.skills?.slice(0, 3).map((skill, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'grey.300'
                  }}
                />
              ))}
            </Box>
          </Paper>
        ))}
        {filtered.length === 0 && (
          <Typography variant="h6" align="center" color="text.secondary">
            No developers found matching your criteria.
          </Typography>
        )}
      </Box>
    </Container>
  );
} 