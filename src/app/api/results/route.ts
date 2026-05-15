// src/app/api/results/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing audit ID' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('audits')
    .select('id, url, url_domain, overall_score, summary, free_results, results, status, created_at')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
