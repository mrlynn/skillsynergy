import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Match from '@/models/Match';

// GET all matches or a single match by ID
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const project = searchParams.get('project');
    const user = searchParams.get('user');
    const status = searchParams.get('status');

    if (id) {
      const match = await Match.findById(id)
        .populate('project')
        .populate('user');
      if (!match) {
        return NextResponse.json({ error: 'Match not found' }, { status: 404 });
      }
      return NextResponse.json(match);
    }

    // Build query based on filters
    const query = {};
    if (project) query.project = project;
    if (user) query.user = user;
    if (status) query.status = status;

    const matches = await Match.find(query)
      .populate('project')
      .populate('user')
      .sort({ score: -1 });
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error in matches API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new match
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const match = await Match.create(body);
    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a match
export async function PUT(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const match = await Match.findByIdAndUpdate(id, body, { new: true })
      .populate('project')
      .populate('user');

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a match or all matches
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Delete single match
      const match = await Match.findByIdAndDelete(id);
      if (!match) {
        return NextResponse.json({ error: 'Match not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Match deleted successfully' });
    } else {
      // Delete all matches
      const result = await Match.deleteMany({});
      return NextResponse.json({
        message: 'All matches deleted successfully',
        deletedCount: result.deletedCount
      });
    }
  } catch (error) {
    console.error('Error deleting match(es):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 