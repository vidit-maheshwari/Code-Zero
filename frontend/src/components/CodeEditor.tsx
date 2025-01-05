import Editor from '@monaco-editor/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CodeEditorProps {
  selectedFile: string | null
  fileContents: Record<string, string>
}

export function CodeEditor({ selectedFile, fileContents }: CodeEditorProps) {
  return (
    <div className="flex-1">
      <Tabs defaultValue="code" className="h-full flex flex-col">
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={selectedFile ? fileContents[selectedFile] : '// Select a file to view its content'}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              readOnly: true,
            }}
          />
        </TabsContent>
        <TabsContent value="preview" className="flex-1">
          <div className="p-4 h-full bg-white text-black">
            Preview content will render here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

