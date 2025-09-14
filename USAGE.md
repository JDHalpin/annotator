# Annotator Usage Examples

This document provides practical examples of how to use the Annotator AI tool for code documentation and analysis.

## Starting the Annotator

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Example Use Cases

### 1. Analyzing a Single File

The annotator can analyze any code file and provide comprehensive documentation:

```typescript
// Example: Analyzing the user-manager.ts file
const agent = mastra.getAgent('annotatorAgent');
const response = await agent.stream([
  {
    role: 'user',
    content: 'Analyze the file examples/user-manager.ts and provide documentation'
  }
]);
```

### 2. Using the Annotation Workflow

The complete annotation workflow analyzes code and generates structured documentation:

```typescript
const workflow = mastra.getWorkflow('annotationWorkflow');
const result = await workflow.execute({
  filePath: './examples/user-manager.ts'
});

console.log('Generated annotations:', result.annotations);
console.log('Generated documentation:', result.documentation);
console.log('Improvement suggestions:', result.improvements);
```

### 3. Batch Processing Multiple Files

You can process multiple files in a directory:

```typescript
// List files in a directory
const fileSystemTool = mastra.getTool('file-system');
const files = await fileSystemTool.execute({
  action: 'list',
  filePath: './src'
});

// Process each TypeScript file
for (const file of files.files.filter(f => f.endsWith('.ts'))) {
  const result = await annotationWorkflow.execute({
    filePath: `./src/${file}`
  });
  
  // Save documentation to a markdown file
  await fileSystemTool.execute({
    action: 'write',
    filePath: `./docs/${file.replace('.ts', '.md')}`,
    content: result.documentation
  });
}
```

## API Reference

### Annotator Agent

The main AI agent for code analysis and documentation generation.

**Capabilities:**
- Code structure analysis
- Function and class documentation
- Dependency analysis
- Code improvement suggestions
- Documentation generation

**Usage:**
```typescript
const agent = mastra.getAgent('annotatorAgent');
const response = await agent.stream([...messages]);
```

### Code Analysis Tool

Analyzes code files to extract structure, functions, and dependencies.

**Parameters:**
- `filePath` (string): Path to the code file
- `includeContent` (boolean, optional): Whether to include source code in analysis

**Returns:**
- File information (name, language)
- Function signatures
- Dependencies list
- Purpose description
- Improvement suggestions

### File System Tool

Handles file operations for reading source code and saving documentation.

**Actions:**
- `read`: Read file contents
- `write`: Write content to file
- `list`: List files in directory

**Parameters:**
- `action`: Operation to perform
- `filePath`: Target file or directory path
- `content`: Content to write (for write action)

### Annotation Workflow

Complete pipeline for code analysis and documentation generation.

**Input:**
- `filePath`: Path to code file to analyze

**Output:**
- `filePath`: Original file path
- `annotations`: Code comments and annotations
- `documentation`: Comprehensive documentation
- `improvements`: List of improvement suggestions

## Advanced Usage

### Custom Analysis Prompts

You can provide specific analysis instructions:

```typescript
const response = await agent.stream([
  {
    role: 'user',
    content: `
      Analyze this TypeScript class and focus on:
      1. API design patterns used
      2. Error handling strategies
      3. Performance considerations
      4. Testing recommendations
      
      File: ${filePath}
    `
  }
]);
```

### Saving Documentation

Generate and save documentation automatically:

```typescript
const agent = mastra.getAgent('annotatorAgent');
const response = await agent.stream([
  {
    role: 'user',
    content: `
      Analyze the file examples/user-manager.ts and create comprehensive documentation.
      Save the documentation to docs/user-manager.md using the file system tool.
      Include API reference, usage examples, and improvement suggestions.
    `
  }
]);
```

### Configuration Options

Customize the annotator behavior by modifying `src/mastra/index.ts`:

- **Storage**: Change from memory to persistent database
- **Logging**: Adjust log levels and output format
- **Memory**: Configure agent memory settings
- **Tools**: Add custom tools for specific analysis needs

## Tips and Best Practices

1. **File Organization**: Keep source files organized for easier batch processing
2. **Documentation Standards**: Maintain consistent documentation formatting
3. **Iterative Improvement**: Use suggestions to iteratively improve code quality
4. **Version Control**: Track documentation changes alongside code changes
5. **Custom Prompts**: Tailor analysis prompts to your specific coding standards

## Troubleshooting

### Common Issues

1. **Build Errors**: Run `npm run lint` to check for TypeScript issues
2. **Missing API Key**: Ensure `OPENAI_API_KEY` is set in `.env` file
3. **File Access**: Check file permissions for read/write operations
4. **Memory Usage**: Use persistent storage for large codebases

### Getting Help

- Check the [Mastra documentation](https://mastra.ai/docs)
- Review error logs in the console
- Open issues on the GitHub repository