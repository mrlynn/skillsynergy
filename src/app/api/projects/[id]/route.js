import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const project = await Project.findById(params.id)
      .populate('owner', '-password -__v') // Populate owner details except sensitive fields
      .populate({
        path: 'requiredSkills.skill', // Populate the skill reference in requiredSkills array
        model: 'Skill'
      });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 