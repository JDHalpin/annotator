
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { annotationWorkflow } from './workflows/annotation-workflow';
import { annotatorAgent } from './agents/annotator-agent';

export const mastra = new Mastra({
  workflows: { annotationWorkflow },
  agents: { annotatorAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../annotator.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Annotator',
    level: 'info',
  }),
});
