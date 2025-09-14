// Complex example for demonstrating advanced annotation capabilities
import { EventEmitter } from 'events';
import { promises as fs } from 'fs';

/**
 * Configuration interface for the analytics service
 */
interface AnalyticsConfig {
  apiEndpoint: string;
  batchSize: number;
  flushInterval: number;
  retryAttempts: number;
}

/**
 * Event data structure for analytics tracking
 */
interface EventData {
  eventType: string;
  userId: string;
  properties: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Metrics interface for performance tracking
 */
interface Metrics {
  totalEvents: number;
  successfulFlushes: number;
  failedFlushes: number;
  averageFlushTime: number;
}

/**
 * Advanced analytics service with batching and retry logic
 * Handles event collection, batching, and reliable delivery to analytics endpoints
 */
export class AnalyticsService extends EventEmitter {
  private config: AnalyticsConfig;
  private eventQueue: EventData[] = [];
  private isFlushInProgress: boolean = false;
  private flushTimer?: NodeJS.Timeout;
  private metrics: Metrics;

  constructor(config: AnalyticsConfig) {
    super();
    this.config = { ...config };
    this.metrics = {
      totalEvents: 0,
      successfulFlushes: 0,
      failedFlushes: 0,
      averageFlushTime: 0,
    };

    this.initializeService();
  }

  /**
   * Track a new event in the analytics system
   * Events are queued and sent in batches for efficiency
   */
  public async track(eventType: string, userId: string, properties: Record<string, unknown> = {}): Promise<void> {
    const event: EventData = {
      eventType,
      userId,
      properties,
      timestamp: new Date(),
    };

    this.eventQueue.push(event);
    this.metrics.totalEvents++;

    this.emit('eventTracked', event);

    // Auto-flush if queue is full
    if (this.eventQueue.length >= this.config.batchSize) {
      await this.flush();
    }
  }

  /**
   * Manually trigger a flush of queued events
   * Returns number of events successfully sent
   */
  public async flush(): Promise<number> {
    if (this.isFlushInProgress || this.eventQueue.length === 0) {
      return 0;
    }

    this.isFlushInProgress = true;
    const startTime = Date.now();

    try {
      const eventsToFlush = this.eventQueue.splice(0, this.config.batchSize);
      await this.sendEvents(eventsToFlush);
      
      this.metrics.successfulFlushes++;
      this.updateAverageFlushTime(Date.now() - startTime);
      
      this.emit('flushCompleted', eventsToFlush.length);
      return eventsToFlush.length;
    } catch (error) {
      this.metrics.failedFlushes++;
      this.emit('flushFailed', error);
      throw error;
    } finally {
      this.isFlushInProgress = false;
    }
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): Readonly<Metrics> {
    return { ...this.metrics };
  }

  /**
   * Save current metrics to a file for analysis
   */
  public async saveMetricsToFile(filePath: string): Promise<void> {
    const metricsData = {
      ...this.metrics,
      queueLength: this.eventQueue.length,
      timestamp: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(metricsData, null, 2));
    this.emit('metricsSaved', filePath);
  }

  /**
   * Gracefully shutdown the service
   * Flushes remaining events before closing
   */
  public async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Flush any remaining events
    while (this.eventQueue.length > 0) {
      await this.flush();
    }

    this.emit('shutdown');
  }

  /**
   * Initialize the service with periodic flushing
   */
  private initializeService(): void {
    this.flushTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush().catch(error => {
          this.emit('error', error);
        });
      }
    }, this.config.flushInterval);

    this.on('error', (error) => {
      console.error('Analytics service error:', error);
    });
  }

  /**
   * Send events to the analytics endpoint with retry logic
   */
  private async sendEvents(events: EventData[]): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ events }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return; // Success
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.config.retryAttempts) {
          // Exponential backoff
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new Error('Failed to send events after all retry attempts');
  }

  /**
   * Update the average flush time metric
   */
  private updateAverageFlushTime(newTime: number): void {
    const totalFlushes = this.metrics.successfulFlushes;
    this.metrics.averageFlushTime = 
      (this.metrics.averageFlushTime * (totalFlushes - 1) + newTime) / totalFlushes;
  }

  /**
   * Utility method for adding delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Factory function for creating analytics service instances
 * Provides sensible defaults for common use cases
 */
export function createAnalyticsService(overrides: Partial<AnalyticsConfig> = {}): AnalyticsService {
  const defaultConfig: AnalyticsConfig = {
    apiEndpoint: 'https://analytics.example.com/events',
    batchSize: 10,
    flushInterval: 30000, // 30 seconds
    retryAttempts: 3,
  };

  return new AnalyticsService({ ...defaultConfig, ...overrides });
}

// Usage example:
// const analytics = createAnalyticsService({
//   apiEndpoint: 'https://my-analytics.com/events',
//   batchSize: 50
// });
// 
// analytics.track('user_login', 'user123', { source: 'web' });
// analytics.track('page_view', 'user123', { page: '/dashboard' });