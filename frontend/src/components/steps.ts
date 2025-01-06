import { Step, StepStatus, StepType } from "../types/StepTypes";

export function parseXml(response: string): Step[] {
  try {
    const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);
    if (!xmlMatch) return [];

    const xmlContent = xmlMatch[1];
    const steps: Step[] = [];
    let stepId = 1;

    const titleMatch = response.match(/title="([^"]*)"/);
    const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

    steps.push({
      id: stepId++,
      title: artifactTitle,
      description: '',
      type: StepType.CreateFolder,
      status: StepStatus.Pending,
    });

    const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;
    let match;

    while ((match = actionRegex.exec(xmlContent)) !== null) {
      const [, type, filePath, content] = match;

      if (type === 'file') {
        steps.push({
          id: stepId++,
          title: `Create ${filePath || 'file'}`,
          description: '',
          type: StepType.CreateFile,
          status: StepStatus.Pending,
          code: content.trim(),
          path: filePath || '',
        });
      } else if (type === 'shell') {
        steps.push({
          id: stepId++,
          title: 'Run command',
          description: '',
          type: StepType.RunScript,
          status: StepStatus.Pending,
          code: content.trim(),
        });
      }
    }

    return steps;
  } catch (error: unknown | Error) {
    console.error('Error parsing XML:', error.message || error);
    return [];
  }
}