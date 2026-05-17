import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/utils/supabase/server'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ssrSupabase = await createClient()
  const {
    data: { user },
  } = await ssrSupabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: audit } = await supabase
    .from('audits')
    .select('id')
    .eq('id', id)
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .maybeSingle()

  if (!audit) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }

  const { error } = await supabase.from('audits').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
