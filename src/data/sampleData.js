export const sampleSkills = [
  {
    name: 'JavaScript',
    description: 'Programming language for web development',
    category: 'development',
    level: 'Advanced'
  },
  {
    name: 'React',
    description: 'JavaScript library for building user interfaces',
    category: 'development',
    level: 'Advanced'
  },
  {
    name: 'Node.js',
    description: 'JavaScript runtime for server-side development',
    category: 'development',
    level: 'Advanced'
  },
  {
    name: 'MongoDB',
    description: 'NoSQL database for modern applications',
    category: 'development',
    level: 'Intermediate'
  },
  {
    name: 'Material UI',
    description: 'React UI framework following Material Design',
    category: 'design',
    level: 'Intermediate'
  },
  {
    name: 'Next.js',
    description: 'React framework for production',
    category: 'development',
    level: 'Advanced'
  },
  {
    name: 'TypeScript',
    description: 'Typed superset of JavaScript',
    category: 'development',
    level: 'Advanced'
  },
  {
    name: 'GraphQL',
    description: 'Query language for APIs',
    category: 'development',
    level: 'Intermediate'
  },
  {
    name: 'Docker',
    description: 'Containerization platform',
    category: 'development',
    level: 'Intermediate'
  },
  {
    name: 'AWS',
    description: 'Cloud computing platform',
    category: 'development',
    level: 'Intermediate'
  }
];

export const sampleProjects = [
  {
    title: 'E-commerce Platform',
    description: 'Build a modern e-commerce platform with React, Node.js, and MongoDB',
    status: 'active',
    type: 'freelance',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    budget: {
      min: 5000,
      max: 10000,
      currency: 'USD'
    },
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      estimatedDuration: '30 days'
    }
  },
  {
    title: 'Social Media Dashboard',
    description: 'Create a dashboard for social media analytics using Next.js and Material UI',
    status: 'active',
    type: 'collaboration',
    requiredSkills: ['React', 'Next.js', 'Material UI', 'TypeScript'],
    budget: {
      min: 3000,
      max: 6000,
      currency: 'USD'
    },
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      estimatedDuration: '2 weeks'
    }
  },
  {
    title: 'API Gateway',
    description: 'Develop a GraphQL API gateway for microservices',
    status: 'active',
    type: 'hiring',
    requiredSkills: ['Node.js', 'GraphQL', 'TypeScript', 'AWS'],
    budget: {
      min: 8000,
      max: 15000,
      currency: 'USD'
    },
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      estimatedDuration: '45 days'
    }
  },
  {
    title: 'DevOps Pipeline',
    description: 'Set up CI/CD pipeline with Docker and AWS',
    status: 'active',
    type: 'freelance',
    requiredSkills: ['Docker', 'AWS', 'Node.js'],
    budget: {
      min: 4000,
      max: 8000,
      currency: 'USD'
    },
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      estimatedDuration: '3 weeks'
    }
  }
];

export const sampleMatches = [
  {
    type: 'project',
    status: 'pending',
    project: null, // Will be set dynamically
    user: null, // Will be set dynamically
    score: 4.5,
    reason: 'Strong match based on required skills and experience',
    feedback: {
      rating: 0,
      comment: ''
    }
  },
  {
    type: 'skill',
    status: 'accepted',
    project: null, // Will be set dynamically
    user: null, // Will be set dynamically
    score: 4.0,
    reason: 'Complementary skills match',
    feedback: {
      rating: 4.5,
      comment: 'Great communication and technical skills'
    }
  },
  {
    type: 'collaboration',
    status: 'completed',
    project: null, // Will be set dynamically
    user: null, // Will be set dynamically
    score: 5.0,
    reason: 'Perfect team fit',
    feedback: {
      rating: 5.0,
      comment: 'Excellent collaboration and project delivery'
    }
  }
];

export const sampleMessages = [
  {
    sender: null, // Will be set dynamically
    recipient: null, // Will be set dynamically
    content: 'I\'m interested in your project. Would you like to discuss the details?',
    type: 'project',
    contextType: 'project',
    contextReference: null, // Will be set dynamically
    isRead: false,
    metadata: {
      priority: 'normal',
      tags: ['inquiry']
    }
  },
  {
    sender: null, // Will be set dynamically
    recipient: null, // Will be set dynamically
    content: 'Your application has been accepted! Welcome to the team.',
    type: 'match',
    contextType: 'match',
    contextReference: null, // Will be set dynamically
    isRead: true,
    metadata: {
      priority: 'high',
      tags: ['acceptance']
    }
  },
  {
    sender: null, // Will be set dynamically
    recipient: null, // Will be set dynamically
    content: 'System maintenance scheduled for tomorrow at 2 AM EST.',
    type: 'system',
    contextType: '',
    contextReference: '',
    isRead: false,
    metadata: {
      priority: 'normal',
      tags: ['system']
    }
  }
];

export const sampleUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Full-stack developer passionate about building scalable web applications and exploring new technologies.',
    skills: ['JavaScript', 'React', 'Node.js'],
    interests: ['E-commerce', 'Open Source', 'UI/UX'],
    location: 'San Francisco, CA',
    isOpenToCollab: true,
    isSample: true,
    social: {
      github: 'alicejohnson',
      linkedin: 'alicejohnson'
    }
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Backend engineer with a love for DevOps and cloud infrastructure. Always eager to automate workflows.',
    skills: ['Node.js', 'Docker', 'AWS'],
    interests: ['APIs', 'DevOps', 'Cloud'],
    location: 'Austin, TX',
    isOpenToCollab: true,
    isSample: true,
    social: {
      github: 'bobsmith',
      linkedin: 'bobsmith'
    }
  },
  {
    name: 'Carol Lee',
    email: 'carol.lee@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Frontend specialist and designer, focused on creating beautiful and accessible user experiences.',
    skills: ['React', 'Material UI', 'Next.js'],
    interests: ['Design Systems', 'Accessibility', 'Startups'],
    location: 'New York, NY',
    isOpenToCollab: true,
    isSample: true,
    social: {
      github: 'carollee',
      linkedin: 'carollee'
    }
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    bio: 'Software engineer with a focus on data-driven applications and machine learning.',
    skills: ['Python', 'Node.js', 'GraphQL'],
    interests: ['AI', 'Data Science', 'APIs'],
    location: 'Seattle, WA',
    isOpenToCollab: false,
    isSample: true,
    social: {
      github: 'davidkim',
      linkedin: 'davidkim'
    }
  }
]; 