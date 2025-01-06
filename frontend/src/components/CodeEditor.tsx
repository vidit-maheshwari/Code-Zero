import Editor from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeEditorProps {
  selectedFile: string | null;
  fileContents: Record<string, string>;
  isReadOnly?: boolean;
  onContentChange?: (path: string, content: string) => void;
}

export function CodeEditor({ 
  selectedFile, 
  fileContents, 
  isReadOnly = false,
  onContentChange 
}: CodeEditorProps) {
  // Determine the language based on file extension
  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      default:
        return 'plaintext';
    }
  };

  // Handle content changes
  const handleEditorChange = (value: string | undefined) => {
    if (value && selectedFile && onContentChange) {
      onContentChange(selectedFile, value);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <div className="flex justify-between items-center px-4 py-2 bg-zinc-800">
          <TabsList className="bg-zinc-700">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          {selectedFile && (
            <span className="text-sm text-zinc-400">{selectedFile}</span>
          )}
        </div>
        <TabsContent value="code" className="flex-1 m-0">
          {selectedFile ? (
            <Editor
              height="100%"
              defaultLanguage={getLanguage(selectedFile)}
              language={getLanguage(selectedFile)}
              value={fileContents[selectedFile] || ''}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                readOnly: isReadOnly,
                wordWrap: 'on',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
              onChange={handleEditorChange}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">
              Select a file to view and edit its content
            </div>
          )}
        </TabsContent>
        <TabsContent value="preview" className="flex-1 m-0">
          <div className="p-4 h-full bg-white text-black overflow-auto">
            <div className="container mx-auto">
              {selectedFile?.endsWith('.html') ? (
                <iframe
                  srcDoc={fileContents[selectedFile]}
                  className="w-full h-full border-0"
                  title="Preview"
                />
              ) : (
                'Preview is only available for HTML files'
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}