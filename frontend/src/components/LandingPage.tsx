

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface LandingPageProps {
  onSubmit: (prompt: string) => void
}

export function LandingPage({ onSubmit }: LandingPageProps) {
  const [prompt, setPrompt] = useState('')


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Code Generator AI</h1>
        <p className="text-xl text-gray-300">Transform your ideas into code with a single prompt</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <Textarea
          placeholder="Describe your project idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[150px] bg-gray-800 border-gray-700 text-white placeholder-gray-400"
        />
        <Button
          onClick={() => onSubmit(prompt)}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!prompt.trim()}
        >
          Generate Code <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  )
}

