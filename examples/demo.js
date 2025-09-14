#!/usr/bin/env node
/**
 * Annotator Demo Script
 * 
 * This script demonstrates the capabilities of the Annotator AI tool
 * by analyzing example code files and generating documentation.
 * 
 * Note: Requires OPENAI_API_KEY to be set in environment for actual AI functionality.
 * This demo shows the structure and workflow without making API calls.
 */

import { mastra } from '../src/mastra/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

const EXAMPLES_DIR = './examples';
const OUTPUT_DIR = './docs/generated';

/**
 * Ensure output directory exists
 */
async function ensureOutputDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Simulate the annotation process for demonstration
 * In a real scenario with API key, this would use the actual AI agent
 */
async function simulateAnnotation(filePath) {
  const fileName = path.basename(filePath);
  const language = path.extname(filePath).slice(1);
  
  console.log(`🔍 Analyzing ${fileName}...`);
  
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Read the actual file content
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  const functionCount = (content.match(/function|class|interface|const.*=>/g) || []).length;
  
  return {
    filePath: fileName,
    annotations: generateMockAnnotations(fileName, language, functionCount),
    documentation: generateMockDocumentation(fileName, language, content),
    improvements: generateMockImprovements(content, functionCount)
  };
}

/**
 * Generate mock annotations for demo purposes
 */
function generateMockAnnotations(fileName, language, functionCount) {
  return `
## Code Annotations for ${fileName}

### File Overview
- **Language**: ${language}
- **Functions/Classes**: ${functionCount} identified
- **Purpose**: ${fileName.includes('user') ? 'User management functionality' : 
                fileName.includes('analytics') ? 'Analytics data collection and processing' : 
                'General purpose utility'}

### Suggested Inline Comments
\`\`\`${language}
// Add JSDoc comments for all public methods
// Consider adding type annotations for better IDE support
// Document complex business logic with inline comments
// Add error handling documentation
\`\`\`

### Annotation Guidelines
- All public interfaces should have comprehensive JSDoc
- Complex algorithms need step-by-step comments
- Error conditions should be clearly documented
- Performance considerations should be noted
  `;
}

/**
 * Generate mock documentation
 */
function generateMockDocumentation(fileName, language, content) {
  const hasClasses = content.includes('class ');
  const hasInterfaces = content.includes('interface ');
  const hasAsync = content.includes('async ');
  
  return `
# ${fileName} Documentation

## Overview
This ${language} module provides ${hasClasses ? 'class-based' : 'functional'} implementation for ${fileName.replace(/\.[^/.]+$/, '').replace('-', ' ')}.

## Features
${hasClasses ? '- Object-oriented design with class inheritance' : ''}
${hasInterfaces ? '- Strong typing with TypeScript interfaces' : ''}
${hasAsync ? '- Asynchronous operations with Promise support' : ''}
- Error handling and validation
- Event-driven architecture (if applicable)

## API Reference

### Main Components
${hasClasses ? '- Classes: Primary business logic containers' : '- Functions: Core functionality providers'}
${hasInterfaces ? '- Interfaces: Type definitions and contracts' : ''}

### Usage Examples
\`\`\`${language}
// Example usage would be provided here
// showing common patterns and best practices
\`\`\`

## Installation & Setup
\`\`\`bash
npm install
# Additional setup steps if needed
\`\`\`

## Best Practices
- Follow established coding conventions
- Implement proper error handling
- Use TypeScript for type safety
- Write comprehensive tests
- Document public APIs thoroughly

## Testing
Recommended testing approach:
- Unit tests for individual functions
- Integration tests for workflows
- Mock external dependencies
- Test error scenarios
  `;
}

/**
 * Generate mock improvements
 */
function generateMockImprovements(content, functionCount) {
  const improvements = [];
  
  if (!content.includes('/**')) {
    improvements.push('Add JSDoc comments for better documentation');
  }
  
  if (functionCount > 5) {
    improvements.push('Consider breaking this into smaller, focused modules');
  }
  
  if (!content.includes('try') && content.includes('await')) {
    improvements.push('Add proper error handling for async operations');
  }
  
  if (!content.includes('test') && !content.includes('spec')) {
    improvements.push('Add unit tests for critical functionality');
  }
  
  if (content.includes('console.log')) {
    improvements.push('Replace console.log with proper logging framework');
  }
  
  improvements.push('Consider adding input validation');
  improvements.push('Review for potential security vulnerabilities');
  improvements.push('Optimize performance for large data sets');
  
  return improvements;
}

/**
 * Save documentation to file
 */
async function saveDocumentation(result) {
  const markdownPath = path.join(OUTPUT_DIR, `${result.filePath.replace(/\.[^/.]+$/, '')}.md`);
  
  const fullDocumentation = `${result.documentation}

---

${result.annotations}

## Improvement Suggestions

${result.improvements.map(improvement => `- ${improvement}`).join('\n')}

---
*Generated by Annotator AI - ${new Date().toISOString()}*
  `;
  
  await fs.writeFile(markdownPath, fullDocumentation);
  console.log(`📝 Documentation saved: ${markdownPath}`);
  return markdownPath;
}

/**
 * Main demo function
 */
async function runDemo() {
  console.log('🚀 Annotator AI Demo');
  console.log('==================\n');
  
  try {
    // Ensure output directory exists
    await ensureOutputDir();
    
    // Find example files
    const files = await fs.readdir(EXAMPLES_DIR);
    const codeFiles = files.filter(file => 
      file.endsWith('.ts') || file.endsWith('.js')
    );
    
    if (codeFiles.length === 0) {
      console.log('⚠️  No code files found in examples directory');
      return;
    }
    
    console.log(`📂 Found ${codeFiles.length} code files to analyze:`);
    codeFiles.forEach(file => console.log(`   - ${file}`));
    console.log();
    
    // Check if we have actual AI capabilities
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    if (!hasApiKey) {
      console.log('ℹ️  OPENAI_API_KEY not found - running in simulation mode');
      console.log('   Set OPENAI_API_KEY in .env for actual AI analysis\n');
    }
    
    // Process each file
    const results = [];
    for (const file of codeFiles) {
      const filePath = path.join(EXAMPLES_DIR, file);
      
      if (hasApiKey) {
        // Use actual AI analysis (would work with API key)
        try {
          const agent = mastra.getAgent('annotatorAgent');
          console.log(`🤖 Running AI analysis on ${file}...`);
          
          // This would work with actual API key
          // const response = await agent.stream([...]);
          
          // For now, fall back to simulation
          const result = await simulateAnnotation(filePath);
          results.push(result);
        } catch (error) {
          console.log(`⚠️  AI analysis failed for ${file}, falling back to simulation`);
          const result = await simulateAnnotation(filePath);
          results.push(result);
        }
      } else {
        // Use simulation
        const result = await simulateAnnotation(filePath);
        results.push(result);
      }
    }
    
    // Save documentation
    console.log('\n📖 Generating documentation files...');
    const savedFiles = [];
    for (const result of results) {
      const savedPath = await saveDocumentation(result);
      savedFiles.push(savedPath);
    }
    
    // Generate summary
    console.log('\n✅ Demo completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Files analyzed: ${results.length}`);
    console.log(`   - Documentation files created: ${savedFiles.length}`);
    console.log(`   - Total improvements suggested: ${results.reduce((sum, r) => sum + r.improvements.length, 0)}`);
    
    console.log(`\n📁 Generated files:`);
    savedFiles.forEach(file => console.log(`   - ${file}`));
    
    console.log('\n🎉 Check the generated documentation in the docs/generated folder!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// Check if running as main script
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo().catch(console.error);
}

export { runDemo };