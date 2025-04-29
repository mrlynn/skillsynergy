import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

// GET all messages or a single message by ID
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const sender = searchParams.get('sender');
    const recipient = searchParams.get('recipient');
    const contextType = searchParams.get('contextType');
    const contextReference = searchParams.get('contextReference');

    if (id) {
      const message = await Message.findById(id)
        .populate('sender')
        .populate('recipient');
      if (!message) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }
      return NextResponse.json(message);
    }

    // Build query based on filters
    const query = {};
    if (sender) query.sender = sender;
    if (recipient) query.recipient = recipient;
    if (contextType) query.contextType = contextType;
    if (contextReference) query.contextReference = contextReference;

    const messages = await Message.find(query)
      .populate('sender')
      .populate('recipient')
      .sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error in messages API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new message
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const message = await Message.create(body);
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a message
export async function PUT(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const message = await Message.findByIdAndUpdate(id, body, { new: true })
      .populate('sender')
      .populate('recipient');

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a message or all messages
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Delete single message
      const message = await Message.findByIdAndDelete(id);
      if (!message) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Message deleted successfully' });
    } else {
      // Delete all messages
      const result = await Message.deleteMany({});
      return NextResponse.json({
        message: 'All messages deleted successfully',
        deletedCount: result.deletedCount
      });
    }
  } catch (error) {
    console.error('Error deleting message(s):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 