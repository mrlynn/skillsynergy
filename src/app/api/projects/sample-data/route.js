import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import { sampleProjects } from '@/data/sampleData';

export async function POST() {
  try {
    await connectDB();

    // Get all skills to use in projects
    const skills = await Skill.find({});
    if (!skills || skills.length === 0) {
      return NextResponse.json(
        { error: 'No skills found. Please create some skills first.' },
        { status: 400 }
      );
    }

    // First, clear existing projects
    await Project.deleteMany({});

    // Map sample projects to include actual skill IDs and required fields
    const projectsWithSkills = sampleProjects.map(project => {
      // Find skills by name and create requiredSkills array
      const requiredSkills = project.requiredSkills.map(skillName => {
        const skill = skills.find(s => s.name === skillName);
        return {
          skill: skill._id,
          level: 'intermediate'
        };
      });

      return {
        ...project,
        requiredSkills,
        owner: '65f9c8d3e4b0a1b2c3d4e5f6', // Default admin user ID
        status: 'active',
        type: project.type || 'collaboration',
        budget: {
          min: project.budget?.min || 1000,
          max: project.budget?.max || 5000,
          currency: 'USD'
        },
        timeline: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          estimatedDuration: '1 month'
        }
      };
    });

    // Insert sample projects
    const projects = await Project.insertMany(projectsWithSkills);

    return NextResponse.json({
      message: 'Sample projects loaded successfully',
      count: projects.length
    });
  } catch (error) {
    console.error('Error loading sample projects:', error);
    return NextResponse.json(
      { error: 'Failed to load sample projects', details: error.message },
      { status: 500 }
    );
  }
} 