import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

interface CodeAnalysis {
  fileName: string;
  language: string;
  functions: Array<{
    name: string;
    parameters: string[];
    returnType: string;
    description: string;
    complexity: 'low' | 'medium' | 'high';
  }>;
  dependencies: string[];
  purpose: string;
  suggestions: string[];
}

export const codeAnalysisTool = createTool({
  id: 'analyze-code',
  description: 'Analyze code files to extract functions, dependencies, and generate documentation',
  inputSchema: z.object({
    filePath: z.string().describe('Path to the code file to analyze'),
    includeContent: z.boolean().optional().default(false).describe('Whether to include the actual code content in analysis'),
  }),
  outputSchema: z.object({
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
    content: z.string().optional(),
  }),
  execute: async ({ context }) => {
    return await analyzeCodeFile(context.filePath, context.includeContent);
  },
});

const analyzeCodeFile = async (filePath: string, includeContent: boolean = false): Promise<CodeAnalysis & { content?: string }> => {
  try {
    // Read the file content
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const language = getLanguageFromExtension(path.extname(filePath));
    
    // Basic analysis based on file extension and content
    const analysis = performBasicAnalysis(content, language, fileName);
    
    return {
      ...analysis,
      ...(includeContent ? { content } : {}),
    };
  } catch (error) {
    throw new Error(`Failed to analyze file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const getLanguageFromExtension = (ext: string): string => {
  const extensions: Record<string, string> = {
    '.ts': 'typescript',
    '.js': 'javascript',
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.go': 'go',
    '.rs': 'rust',
    '.php': 'php',
    '.rb': 'ruby',
    '.cs': 'csharp',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.scala': 'scala',
  };
  return extensions[ext.toLowerCase()] || 'unknown';
};

const performBasicAnalysis = (content: string, language: string, fileName: string): CodeAnalysis => {
  const lines = content.split('\n');
  const functions: CodeAnalysis['functions'] = [];
  const dependencies: string[] = [];
  let purpose = 'Code analysis pending';
  const suggestions: string[] = [];

  // Extract imports/dependencies
  const importPatterns = [
    /^import\s+.*?from\s+['"]([^'"]+)['"]/gm, // ES6 imports
    /^import\s+['"]([^'"]+)['"]/gm, // Simple imports
    /^const\s+.*?=\s+require\(['"]([^'"]+)['"]\)/gm, // CommonJS require
    /^#include\s+<([^>]+)>/gm, // C/C++ includes
    /^from\s+([^\s]+)\s+import/gm, // Python imports
    /^import\s+([^\s;]+)/gm, // Java/other imports
  ];

  importPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      dependencies.push(match[1]);
    }
  });

  // Extract functions based on language
  const functionPatterns: Record<string, RegExp[]> = {
    typescript: [
      /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)/g,
      /(?:export\s+)?const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g,
      /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*:\s*[^{]+{/g,
    ],
    javascript: [
      /(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)/g,
      /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g,
    ],
    python: [
      /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\):/g,
      /async\s+def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\):/g,
    ],
    java: [
      /(?:public|private|protected)?\s*(?:static)?\s*[a-zA-Z<>\[\]]+\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)/g,
    ],
  };

  const patterns = functionPatterns[language] || [];
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      functions.push({
        name: match[1],
        parameters: [], // Would need more sophisticated parsing
        returnType: 'unknown',
        description: `Function ${match[1]} - requires detailed analysis`,
        complexity: content.length > 1000 ? 'high' : content.length > 500 ? 'medium' : 'low',
      });
    }
  });

  // Generate basic purpose based on filename and content
  if (fileName.toLowerCase().includes('test')) {
    purpose = 'Test file containing unit tests or test utilities';
  } else if (fileName.toLowerCase().includes('config')) {
    purpose = 'Configuration file defining application settings';
  } else if (functions.length > 0) {
    purpose = `Source file containing ${functions.length} function(s) for ${fileName.replace(/\.[^/.]+$/, "")} functionality`;
  }

  // Generate suggestions
  if (functions.length === 0) {
    suggestions.push('Consider adding functions or classes to improve code organization');
  }
  if (content.split('\n').length > 200) {
    suggestions.push('Consider breaking this large file into smaller, more focused modules');
  }
  if (dependencies.length === 0 && functions.length > 3) {
    suggestions.push('Consider using external libraries to reduce code complexity');
  }

  return {
    fileName,
    language,
    functions,
    dependencies: [...new Set(dependencies)], // Remove duplicates
    purpose,
    suggestions,
  };
};
