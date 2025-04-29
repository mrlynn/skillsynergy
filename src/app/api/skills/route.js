import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';

// GET all skills or a single skill by ID
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const skill = await Skill.findById(id);
      if (!skill) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }
      return NextResponse.json(skill);
    }

    const skills = await Skill.find().sort({ name: 1 });
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error in skills API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new skill
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const skill = await Skill.create(body);
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a skill
export async function PUT(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    // First, find the existing skill
    const existingSkill = await Skill.findById(id);
    if (!existingSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const body = await request.json();
    console.log('Update request body:', body);
    
    // Only update fields that are provided in the request
    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.level !== undefined) updateData.level = body.level;
    
    // Handle parent field - set to null if empty string
    if (body.parent !== undefined) {
      updateData.parent = body.parent === '' ? null : body.parent;
    }
    
    // Handle array fields
    if (body.children !== undefined) {
      updateData.children = Array.isArray(body.children) ? body.children : [];
    }
    if (body.complementarySkills !== undefined) {
      updateData.complementarySkills = Array.isArray(body.complementarySkills) ? body.complementarySkills : [];
    }
    
    // Handle other fields
    if (body.popularity !== undefined) updateData.popularity = body.popularity;
    if (body.verification !== undefined) {
      updateData.verification = {
        required: Boolean(body.verification.required),
        methods: Array.isArray(body.verification.methods) ? body.verification.methods : []
      };
    }

    console.log('Update data:', updateData);

    // Update the skill
    Object.assign(existingSkill, updateData);
    const updatedSkill = await existingSkill.save();

    console.log('Updated skill:', updatedSkill);

    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update skill',
      details: error.errors || null,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// DELETE a skill or all skills
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Delete single skill
      const skill = await Skill.findByIdAndDelete(id);
      if (!skill) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Skill deleted successfully' });
    } else {
      // Delete all skills
      const result = await Skill.deleteMany({});
      return NextResponse.json({
        message: 'All skills deleted successfully',
        deletedCount: result.deletedCount
      });
    }
  } catch (error) {
    console.error('Error deleting skill(s):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 