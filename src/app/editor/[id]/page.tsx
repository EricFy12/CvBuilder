'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ResumeEditor from '@/components/ResumeEditor'

export default function EditorDynamicPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <main className="min-h-screen bg-slate-900">
      <ResumeEditor resumeId={id} />
    </main>
  )
}
