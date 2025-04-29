import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Project from '@/models/Project';
import Match from '@/models/Match';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { userId } = await req.json();
    await connectToDatabase();

    // Get user profile
    const user = await User.findById(userId)
      .populate('skills')
      .select('-password');

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all active projects
    const projects = await Project.find({ status: 'active' })
      .populate('requiredSkills')
      .populate('owner');

    // Generate embeddings for user profile
    const userProfileText = `
      Bio: ${user.bio}
      Experience Level: ${user.experienceLevel}
      Skills: ${user.skills.map(s => s.name).join(', ')}
      Availability: ${user.availability.hoursPerWeek} hours/week
      Project Types: ${user.preferences.projectTypes.join(', ')}
      Budget Range: $${user.preferences.minBudget} - $${user.preferences.maxBudget}
    `;

    const userEmbedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userProfileText,
    });

    // Store user embedding
    user.embedding = userEmbedding.data[0].embedding;
    await user.save();

    // Generate matches
    const matches = [];
    for (const project of projects) {
      // Skip projects owned by the user
      if (project.owner._id.toString() === userId) continue;

      // Generate embedding for project
      const projectText = `
        Title: ${project.title}
        Description: ${project.description}
        Required Skills: ${project.requiredSkills.map(s => s.name).join(', ')}
        Budget: $${project.budget.min} - $${project.budget.max}
      `;

      const projectEmbedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: projectText,
      });

      // Store project embedding
      project.embedding = projectEmbedding.data[0].embedding;
      await project.save();

      // Calculate similarity score
      const similarity = cosineSimilarity(userEmbedding.data[0].embedding, projectEmbedding.data[0].embedding);

      // Check if there's a good match
      if (similarity > 0.7) {
        // Create match
        const match = new Match({
          type: 'project',
          status: 'pending',
          project: project._id,
          user: userId,
          score: similarity,
          reason: generateMatchReason(user, project, similarity),
        });

        await match.save();
        matches.push(match);
      }
    }

    // Sort matches by score
    matches.sort((a, b) => b.score - a.score);

    return new Response(JSON.stringify({ matches }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating matches:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Helper function to calculate cosine similarity
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Helper function to generate match reason
function generateMatchReason(user, project, similarity) {
  const matchingSkills = user.skills.filter(userSkill => 
    project.requiredSkills.some(projectSkill => 
      projectSkill._id.toString() === userSkill._id.toString()
    )
  );

  const reasons = [];
  
  if (matchingSkills.length > 0) {
    reasons.push(`You have ${matchingSkills.length} matching skills: ${matchingSkills.map(s => s.name).join(', ')}`);
  }

  if (user.experienceLevel === 'expert' || user.experienceLevel === 'advanced') {
    reasons.push('Your experience level matches the project requirements');
  }

  if (user.preferences.projectTypes.includes(project.type)) {
    reasons.push('The project type matches your preferences');
  }

  if (project.budget.min >= user.preferences.minBudget && project.budget.max <= user.preferences.maxBudget) {
    reasons.push('The project budget falls within your preferred range');
  }

  return reasons.join('. ') + `. Match score: ${(similarity * 100).toFixed(1)}%`;
} 