

import { useState } from 'react'
import { LandingPage } from '@/components/LandingPage'
import { CodeGeneratorPage } from '@/components/CodeGeneratorPage'
import { backend_url } from './config'

export default function Home() {
  console.log(backend_url)
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null)

  if (!initialPrompt) {
    return <LandingPage onSubmit={setInitialPrompt} />
  }

  return <CodeGeneratorPage initialPrompt={initialPrompt} />
}

