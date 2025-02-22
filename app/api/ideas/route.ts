import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }

        const { data: insertedData, error } = await supabase
            .from('startup_ideas')
            .insert([{
                title: data.title,
                description: data.description,
                market_size: data.market_size || null,
                market_potential: data.market_potential || null,
                technical_requirements: data.technical_requirements || [],
                financial_requirement: data.financial_requirement || null,
                timeline: data.timeline || null,
                category: data.category || null,
                challenges: data.challenges || [],
                author_email: session.user.email,
                metrics: {
                    likes: 0,
                    passes: 0,
                    shares: 0,
                }
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(insertedData);
    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 