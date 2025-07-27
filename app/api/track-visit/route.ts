import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const body = await req.json();
    console.log('TRACK VISIT BODY:', body);

    const { path, country, userAgent, visitorHash } = body;
    if (!path) return NextResponse.json({ error: 'Path requerido' }, { status: 400 });

    const { error } = await supabase.from('page_views').insert([
      { path, country, user_agent: userAgent, visitor_hash: visitorHash }
    ]);
    if (error) {
      console.error('SUPABASE INSERT ERROR:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('API ERROR:', e);
    return NextResponse.json({ error: 'Error al registrar visita' }, { status: 500 });
  }
} 