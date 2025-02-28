import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ideaId = params.id;
        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        // First check if the user is the author of the idea
        const { data: ideaData, error: fetchError } = await supabase
            .from('startup_ideas')
            .select('author_email')
            .eq('id', ideaId)
            .single();

        if (fetchError) {
            return NextResponse.json(
                { error: 'Idea not found' },
                { status: 404 }
            );
        }

        if (ideaData.author_email !== session.user.email) {
            return NextResponse.json(
                { error: 'You can only edit your own ideas' },
                { status: 403 }
            );
        }

        // Update the idea
        const { data: updatedData, error } = await supabase
            .from('startup_ideas')
            .update({
                title: data.title,
                description: data.description,
                market_size: data.market_size || null,
                market_potential: data.market_potential || null,
                technical_requirements: data.technical_requirements || [],
                financial_requirement: data.financial_requirement || null,
                timeline: data.timeline || null,
                category: data.category || null,
                challenges: data.challenges || [],
            })
            .eq('id', ideaId)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(updatedData);
    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ideaId = params.id;

        const { data, error } = await supabase
            .from('startup_ideas')
            .select('*')
            .eq('id', ideaId)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ideaId = params.id;

        // First check if the user is the author of the idea
        const { data: ideaData, error: fetchError } = await supabase
            .from('startup_ideas')
            .select('author_email')
            .eq('id', ideaId)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
        }

        if (ideaData.author_email !== session.user.email) {
            return NextResponse.json(
                { error: 'You can only delete your own ideas' },
                { status: 403 }
            );
        }

        // Delete related records first
        // 1. Delete viewed_ideas records
        await supabase
            .from('viewed_ideas')
            .delete()
            .eq('idea_id', ideaId);

        // 2. Delete likes records
        await supabase
            .from('likes')
            .delete()
            .eq('idea_id', ideaId);

        // 3. Delete comments
        await supabase
            .from('comments')
            .delete()
            .eq('idea_id', ideaId);

        // Finally, delete the idea itself
        const { error } = await supabase
            .from('startup_ideas')
            .delete()
            .eq('id', ideaId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 