'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PENDING_AUDIT_COOKIE } from '@/lib/pending-audit'

function setPendingAuditCookie(auditId: string) {
  const maxAge = 60 * 60 * 24 * 7
  document.cookie = `${PENDING_AUDIT_COOKIE}=${encodeURIComponent(auditId)}; path=/; max-age=${maxAge}; samesite=lax`
  try {
    localStorage.setItem(PENDING_AUDIT_COOKIE, auditId)
  } catch {
    // ignore storage errors
  }
}

async function claimPendingAudit(auditId: string) {
  await fetch('/api/audits/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ auditId }),
    credentials: 'include',
  })
}

export function PendingAuditLinker({ auditId }: { auditId: string }) {
  useEffect(() => {
    setPendingAuditCookie(auditId)

    const supabase = createClient()

    const runClaim = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await claimPendingAudit(auditId)
      }
    }

    void runClaim()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        void claimPendingAudit(auditId)
      }
    })

    return () => subscription.unsubscribe()
  }, [auditId])

  return null
}
