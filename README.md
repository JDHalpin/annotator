# Annotator

AI tool for annotations and functional documentation using Mastra AI.

## Overview

The Annotator is an AI-powered tool that helps developers create comprehensive documentation and functional annotations for their codebases. Built with Mastra AI, it provides intelligent code analysis, automated annotation generation, and documentation suggestions.

## Features

- **Intelligent Code Analysis**: Automatically analyzes code files to understand structure, functions, and dependencies
- **Automated Annotation Generation**: Creates meaningful comments and documentation for your code
- **Multi-language Support**: Works with TypeScript, JavaScript, Python, Java, C++, and more
- **Workflow-based Processing**: Uses Mastra workflows for consistent and reliable annotation processes
- **AI-Powered Suggestions**: Provides improvement recommendations for code quality and maintainability

## Getting Started

### Prerequisites

- Node.js >= 20.9.0
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JDHalpin/annotator.git
cd annotator
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
# Add your OpenAI API key to .env
echo "OPENAI_API_KEY=your_api_key_here" >> .env
```

### Usage

#### Development Mode

Start the Mastra development server:
```bash
npm run dev
```

This will start the Mastra server with hot reloading for development.

#### Production

Build and start the application:
```bash
npm run build
npm start
```

### Using the Annotator Agent

The Annotator includes a pre-configured AI agent that can:

1. **Analyze Code Files**: Point it to any code file to get detailed analysis
2. **Generate Documentation**: Create comprehensive documentation for functions and modules
3. **Suggest Improvements**: Get actionable recommendations for code quality

### Using the Annotation Workflow

The annotation workflow provides a complete pipeline for code documentation:

1. **Code Analysis Step**: Analyzes the target file's structure and dependencies
2. **Annotation Generation Step**: Creates comprehensive annotations and documentation

### Configuration

The main Mastra configuration is in `src/mastra/index.ts`. You can customize:

- **Storage**: Currently uses in-memory storage, can be changed to persistent database
- **Logging**: Configured with Pino logger for development
- **Agents**: Add more specialized agents for different code analysis tasks
- **Workflows**: Create custom workflows for specific annotation needs

## Project Structure

```
annotator/
├── src/
│   └── mastra/
│       ├── agents/           # AI agents for code analysis
│       ├── tools/            # Tools for code processing
│       ├── workflows/        # Annotation workflows
│       └── index.ts          # Main Mastra configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .env                      # Environment variables
└── README.md                 # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support, please open an issue in the GitHub repository.
