import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

// GET all projects or a single project by ID
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const project = await Project.findById(id)
        .populate('owner', 'name email')
        .populate('requiredSkills.skill', 'name description')
        .select('+type');
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json(project);
    }

    const projects = await Project.find()
      .populate('owner', 'name email')
      .populate('requiredSkills.skill', 'name description')
      .select('+type')
      .sort({ createdAt: -1 });
    
    console.log('Projects from DB:', projects);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in projects API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new project
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const project = await Project.create(body);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a project
export async function PUT(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // First, find the existing project
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();
    console.log('Update request body:', body);
    
    // Only update fields that are provided in the request
    const updateData = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.type !== undefined) updateData.type = body.type;
    
    // Handle requiredSkills
    if (body.requiredSkills !== undefined) {
      updateData.requiredSkills = body.requiredSkills.map(skillId => ({
        skill: skillId,
        level: 'intermediate' // Default level
      }));
    }
    
    // Handle budget
    if (body.budget !== undefined) {
      updateData.budget = {
        min: body.budget.min || 0,
        max: body.budget.max || 0,
        currency: body.budget.currency || 'USD'
      };
    }
    
    // Handle timeline
    if (body.timeline !== undefined) {
      updateData.timeline = {
        startDate: body.timeline.startDate || null,
        endDate: body.timeline.endDate || null,
        estimatedDuration: body.timeline.estimatedDuration || ''
      };
    }

    console.log('Update data:', updateData);

    // Update the project
    Object.assign(existingProject, updateData);
    await existingProject.save();

    // Fetch the updated project with populated fields
    const updatedProject = await Project.findById(id)
      .populate('owner', 'name email')
      .populate('requiredSkills.skill', 'name description');

    console.log('Updated project:', updatedProject);

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ 
      error: 'Failed to update project',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// DELETE a project or all projects
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Delete single project
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Project deleted successfully' });
    } else {
      // Delete all projects
      const result = await Project.deleteMany({});
      return NextResponse.json({
        message: 'All projects deleted successfully',
        deletedCount: result.deletedCount
      });
    }
  } catch (error) {
    console.error('Error deleting project(s):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 