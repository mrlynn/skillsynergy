import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';

export default function Breadcrumbs({ items }) {
  const router = useRouter();

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        color="inherit"
        onClick={() => router.push('/')}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        if (isLast) {
          return (
            <Typography
              key={index}
              color="text.primary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            underline="hover"
            color="inherit"
            onClick={() => router.push(item.href)}
            sx={{ cursor: 'pointer' }}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
} 