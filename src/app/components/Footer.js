import { Box, Container, Grid, Typography, Link, TextField, Button, Divider, IconButton } from '@mui/material';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/X';
import PublicIcon from '@mui/icons-material/Public';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid #eee', mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={2}>
            <Box display="flex" alignItems="center" mb={2}>
              <Image src="/images/logo-circle-black-on-white.png" alt="MongoNext Logo" width={36} height={36} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>MongoNext</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              © {new Date().getFullYear()} SkillSynergy, Inc.
            </Typography>
            <Box mt={2}>
              <IconButton href="https://github.com/mrlynn/create-mongonext-app" target="_blank"><GitHubIcon /></IconButton>
              <IconButton href="https://x.com/mlynn" target="_blank"><TwitterIcon /></IconButton>
              <IconButton href="https://mongonext.com/" target="_blank"><PublicIcon /></IconButton>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Resources</Typography>
            <Link href="https://docs.mongonext.com" color="inherit" underline="hover" display="block">Docs</Link>
            <Link href="https://mongonext.com/support" color="inherit" underline="hover" display="block">Support</Link>
            <Link href="https://mongonext.com/blog" color="inherit" underline="hover" display="block">Blog</Link>
            <Link href="https://mongonext.com/showcase" color="inherit" underline="hover" display="block">Showcase</Link>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>More</Typography>
            <Link href="https://mlynn.org" color="inherit" underline="hover" display="block">Michael Lynn</Link>
            <Link href="https://github.com/mrlynn" color="inherit" underline="hover" display="block">GitHub</Link>
            <Link href="https://github.com/mrlynn/mongonext/releases" color="inherit" underline="hover" display="block">Releases</Link>
            <Link href="https://github.com/mlynn/mongonext/blob/main/GOVERNANCE.md" color="inherit" underline="hover" display="block">Governance</Link>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>About</Typography>
            <Link href="https://mongonext.com/about" color="inherit" underline="hover" display="block">About Us</Link>
            <Link href="https://mongonext.com/open-source" color="inherit" underline="hover" display="block">Open Source</Link>
            <Link href="https://mongonext.com/team" color="inherit" underline="hover" display="block">Team</Link>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Legal</Typography>
            <Link href="https://mongonext.com/privacy" color="inherit" underline="hover" display="block">Privacy Policy</Link>
            <Link href="https://mongonext.com/terms" color="inherit" underline="hover" display="block">Terms of Service</Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Built with ❤️ by Michael Lynn using <Link href="https://mongonext.com" color="inherit" underline="hover" target="_blank">MongoNext</Link></Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Discover your next great idea at <Link href="https://mongonext.com/startup-generator" color="inherit" underline="hover" target="_blank">Startup Idea Generator</Link>
            </Typography>
            <Box component="form" display="flex" gap={1}>
              <TextField size="small" placeholder="you@domain.com" variant="outlined" sx={{ flex: 1 }} />
              <Button variant="outlined">Subscribe</Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 