import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Skill from '@/models/Skill';
import { sampleUsers } from '@/data/sampleData';

export async function POST() {
  await connectDB();
  try {
    // Only remove previous sample users
    await User.deleteMany({ isSample: true });

    // Fetch all skills
    const skills = await Skill.find({});
    if (!skills || skills.length === 0) {
      return NextResponse.json(
        { error: 'No skills found. Please create some skills first.' },
        { status: 400 }
      );
    }

    // Process and upsert each sample user
    const results = await Promise.all(
      sampleUsers.map(async (user) => {
        // Map skill names to ObjectIds
        const skillIds = (user.skills || []).map(skillName => {
          const skill = skills.find(s => s.name === skillName);
          return skill ? skill._id : null;
        }).filter(Boolean);

        // Prepare user data with skills and required fields
        const userData = {
          ...user,
          skills: skillIds,
          password: 'password123', // Default password for sample users
          isSample: true // Ensure the flag is set
        };

        // Upsert the user based on email
        return User.findOneAndUpdate(
          { email: user.email },
          userData,
          {
            upsert: true, // Create if doesn't exist
            new: true, // Return the updated/created document
            setDefaultsOnInsert: true // Apply schema defaults on insert
          }
        );
      })
    );

    return NextResponse.json({
      message: 'Sample users loaded successfully',
      count: results.length
    });
  } catch (error) {
    console.error('Error loading sample users:', error);
    return NextResponse.json(
      { error: 'Failed to load sample users', details: error.message },
      { status: 500 }
    );
  }
} 