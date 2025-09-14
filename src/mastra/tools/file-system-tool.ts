import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

export const fileSystemTool = createTool({
  id: 'file-system',
  description: 'Read and write files for annotation output',
  inputSchema: z.object({
    action: z.enum(['read', 'write', 'list']).describe('File system action to perform'),
    filePath: z.string().describe('Path to the file'),
    content: z.string().optional().describe('Content to write (for write action)'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    content: z.string().optional(),
    files: z.array(z.string()).optional(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      switch (context.action) {
        case 'read':
          const content = await fs.readFile(context.filePath, 'utf-8');
          return {
            success: true,
            content,
            message: `Successfully read file: ${context.filePath}`,
          };

        case 'write':
          if (!context.content) {
            throw new Error('Content is required for write action');
          }
          await fs.writeFile(context.filePath, context.content, 'utf-8');
          return {
            success: true,
            message: `Successfully wrote file: ${context.filePath}`,
          };

        case 'list':
          const stats = await fs.stat(context.filePath);
          if (stats.isDirectory()) {
            const files = await fs.readdir(context.filePath);
            return {
              success: true,
              files,
              message: `Listed ${files.length} files in directory: ${context.filePath}`,
            };
          } else {
            return {
              success: true,
              files: [path.basename(context.filePath)],
              message: `File exists: ${context.filePath}`,
            };
          }

        default:
          throw new Error(`Unknown action: ${context.action}`);
      }
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});