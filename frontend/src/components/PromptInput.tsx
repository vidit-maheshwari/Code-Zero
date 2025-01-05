import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

interface PromptInputProps {
  prompt: string
  setPrompt: (prompt: string) => void
  onSubmit: () => void
}

export function PromptInput({ prompt, setPrompt, onSubmit }: PromptInputProps) {
  return (
    <div className="mt-4">
      <Textarea
        placeholder="Refine your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="bg-zinc-800 border-zinc-700"
      />
      <Button 
        onClick={onSubmit}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
      >
        <Play className="w-4 h-4 mr-2" />
        Regenerate Code
      </Button>
    </div>
  )
}

