import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';
import { sampleSkills } from '@/data/sampleData';

export async function POST() {
  try {
    await connectDB();

    // Clear existing skills
    await Skill.deleteMany({});

    // Insert sample skills
    const skills = await Skill.insertMany(sampleSkills);

    return NextResponse.json({
      message: 'Sample skills loaded successfully',
      count: skills.length
    });
  } catch (error) {
    console.error('Error loading sample skills:', error);
    return NextResponse.json(
      { error: 'Failed to load sample skills' },
      { status: 500 }
    );
  }
} 