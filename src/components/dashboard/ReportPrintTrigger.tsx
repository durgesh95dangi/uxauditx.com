'use client'

import { useEffect } from 'react'

export function ReportPrintTrigger({ shouldPrint }: { shouldPrint: boolean }) {
  useEffect(() => {
    if (!shouldPrint) return
    const timer = window.setTimeout(() => window.print(), 600)
    return () => window.clearTimeout(timer)
  }, [shouldPrint])

  return null
}
