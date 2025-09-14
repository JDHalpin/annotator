import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const codeAnalysisSchema = z.object({
  fileName: z.string(),
  language: z.string(),
  functions: z.array(z.object({
    name: z.string(),
    parameters: z.array(z.string()),
    returnType: z.string(),
    description: z.string(),
    complexity: z.enum(['low', 'medium', 'high']),
  })),
  dependencies: z.array(z.string()),
  purpose: z.string(),
  suggestions: z.array(z.string()),
});

const annotationSchema = z.object({
  filePath: z.string(),
  annotations: z.string(),
  documentation: z.string(),
  improvements: z.array(z.string()),
});

const analyzeCode = createStep({
  id: 'analyze-code',
  description: 'Analyzes code files to understand structure and functionality',
  inputSchema: z.object({
    filePath: z.string().describe('The path to the code file to analyze'),
  }),
  outputSchema: codeAnalysisSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    // This would typically use the code analysis tool
    // For now, we'll simulate the analysis
    const mockAnalysis = {
      fileName: inputData.filePath.split('/').pop() || 'unknown.js',
      language: 'javascript', // Would be detected from file extension
      functions: [
        {
          name: 'exampleFunction',
          parameters: ['param1', 'param2'],
          returnType: 'string',
          description: 'Example function for demonstration',
          complexity: 'low' as const,
        }
      ],
      dependencies: ['@mastra/core', 'zod'],
      purpose: 'Example code file for annotation workflow demonstration',
      suggestions: [
        'Add JSDoc comments for better documentation',
        'Consider adding type annotations',
        'Add unit tests for the functions'
      ],
    };

    return mockAnalysis;
  },
});

const generateAnnotations = createStep({
  id: 'generate-annotations',
  description: 'Generates comprehensive annotations and documentation for code',
  inputSchema: codeAnalysisSchema.extend({
    filePath: z.string(),
  }),
  outputSchema: annotationSchema,
  execute: async ({ inputData, mastra }) => {
    const analysis = inputData;

    if (!analysis) {
      throw new Error('Analysis data not found');
    }

    const agent = mastra?.getAgent('annotatorAgent');
    if (!agent) {
      throw new Error('Annotator agent not found');
    }

    const prompt = `Based on the following code analysis, generate comprehensive annotations and documentation:

File: ${analysis.fileName}
Language: ${analysis.language}
Purpose: ${analysis.purpose}

Functions:
${analysis.functions.map(fn => `- ${fn.name}(${fn.parameters.join(', ')}): ${fn.returnType} - ${fn.description}`).join('\n')}

Dependencies:
${analysis.dependencies.map(dep => `- ${dep}`).join('\n')}

Current Suggestions:
${analysis.suggestions.map(suggestion => `- ${suggestion}`).join('\n')}

Please provide:
1. **ANNOTATIONS**: Clear, concise comments that should be added to the code
2. **DOCUMENTATION**: Comprehensive documentation explaining the file's purpose, API, and usage
3. **IMPROVEMENTS**: Specific actionable suggestions for code quality improvements

Format your response as:

## ANNOTATIONS
[Provide specific code comments and annotations that should be added to the source code]

## DOCUMENTATION  
[Provide comprehensive documentation including purpose, API reference, usage examples]

## IMPROVEMENTS
[List specific, actionable improvements for code quality, performance, and maintainability]`;

    const response = await agent.stream([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let fullResponse = '';
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      fullResponse += chunk;
    }

    // Parse the response into sections
    const sections = parseAnnotationResponse(fullResponse);

    return {
      filePath: analysis.fileName,
      annotations: sections.annotations,
      documentation: sections.documentation,
      improvements: sections.improvements,
    };
  },
});

function parseAnnotationResponse(response: string) {
  const sections = {
    annotations: '',
    documentation: '',
    improvements: [] as string[],
  };

  const annotationsMatch = response.match(/## ANNOTATIONS\s*([\s\S]*?)(?=## |$)/i);
  const documentationMatch = response.match(/## DOCUMENTATION\s*([\s\S]*?)(?=## |$)/i);
  const improvementsMatch = response.match(/## IMPROVEMENTS\s*([\s\S]*?)(?=## |$)/i);

  if (annotationsMatch) {
    sections.annotations = annotationsMatch[1].trim();
  }

  if (documentationMatch) {
    sections.documentation = documentationMatch[1].trim();
  }

  if (improvementsMatch) {
    const improvementText = improvementsMatch[1].trim();
    sections.improvements = improvementText
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
      .map(line => line.replace(/^[-\d.]\s*/, '').trim())
      .filter(Boolean);
  }

  return sections;
}

const annotationWorkflow = createWorkflow({
  id: 'annotation-workflow',
  inputSchema: z.object({
    filePath: z.string().describe('The path to the code file to annotate'),
  }),
  outputSchema: annotationSchema,
})
  .then(analyzeCode)
  .then(generateAnnotations);

annotationWorkflow.commit();

export { annotationWorkflow };
