import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import connectDB from '@/lib/mongodb';

const ATLAS_GROUP_ID = process.env.ATLAS_GROUP_ID;
const ATLAS_CLUSTER_NAME = process.env.ATLAS_CLUSTER_NAME;
const ATLAS_API_PUBLIC_KEY = process.env.ATLAS_API_PUBLIC_KEY;
const ATLAS_API_PRIVATE_KEY = process.env.ATLAS_API_PRIVATE_KEY;
const ATLAS_DB_NAME = process.env.ATLAS_DB_NAME;

// Updated base URL for Atlas Search API
const BASE_URL = `https://cloud.mongodb.com/api/atlas/v2/groups/${ATLAS_GROUP_ID}/clusters/${ATLAS_CLUSTER_NAME}/fts/indexes`;

// Helper function to create Atlas API headers
function createAtlasHeaders() {
  const auth = Buffer.from(`${ATLAS_API_PUBLIC_KEY}:${ATLAS_API_PRIVATE_KEY}`).toString('base64');
  return {
    'Authorization': `Digest ${auth}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

async function getVectorIndexes() {
  const res = await fetch(BASE_URL, {
    headers: createAtlasHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to get indexes: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}

async function createVectorIndex(collectionName) {
  await connectDB();
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB);
    const collection = database.collection(collectionName);

    const index = {
      name: 'vector_index',
      type: 'vectorSearch',
      definition: {
        fields: [
          {
            type: 'vector',
            numDimensions: 1536,
            path: 'embedding',
            similarity: 'cosine'
          }
        ]
      }
    };

    const result = await collection.createSearchIndex(index);
    console.log(`New search index named ${result} is building for ${collectionName}`);

    // Wait for the index to be ready
    let isQueryable = false;
    while (!isQueryable) {
      const cursor = collection.listSearchIndexes();
      for await (const idx of cursor) {
        if (idx.name === result) {
          if (idx.queryable) {
            console.log(`${result} is ready for querying in ${collectionName}`);
            isQueryable = true;
          } else {
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }
    }

    return { success: true, indexName: result };
  } catch (error) {
    console.error(`Error creating index for ${collectionName}:`, error);
    throw error;
  } finally {
    await client.close();
  }
}

async function checkVectorIndex(collectionName) {
  await connectDB();
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB);
    const collection = database.collection(collectionName);

    const cursor = collection.listSearchIndexes();
    let exists = false;
    for await (const index of cursor) {
      if (index.name === 'vector_index' && 
          index.definition?.fields?.some(f => 
            f.type === 'vector' && 
            f.path === 'embedding' && 
            f.numDimensions === 1536
          )) {
        exists = true;
        break;
      }
    }
    return exists;
  } catch (error) {
    console.error(`Error checking index for ${collectionName}:`, error);
    return false;
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    const userIndexExists = await checkVectorIndex('users');
    const projectIndexExists = await checkVectorIndex('projects');
    
    return NextResponse.json({ 
      userIndexExists,
      projectIndexExists
    });
  } catch (error) {
    console.error('Error in GET /api/settings/vector-index:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const results = {
      users: null,
      projects: null
    };

    // Create index for users
    try {
      results.users = await createVectorIndex('users');
    } catch (error) {
      console.error('Error creating users index:', error);
      results.users = { error: error.message };
    }

    // Create index for projects
    try {
      results.projects = await createVectorIndex('projects');
    } catch (error) {
      console.error('Error creating projects index:', error);
      results.projects = { error: error.message };
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in POST /api/settings/vector-index:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 