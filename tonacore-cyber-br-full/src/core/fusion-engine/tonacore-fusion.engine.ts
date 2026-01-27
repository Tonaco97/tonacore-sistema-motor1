
import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import Redis from 'ioredis';

@Injectable()
export class TonaCoreFusionEngine {
  private readonly logger = new Logger(TonaCoreFusionEngine.name);
  private producer: Producer;
  private redis = new Redis(process.env.REDIS_URL);

  async onModuleInit() {
    const kafka = new Kafka({ brokers: process.env.KAFKA_BROKERS.split(',') });
    this.producer = kafka.producer();
    await this.producer.connect();
  }

  async fuse(payload: any) {
    await this.producer.send({
      topic: 'tonacore-fused-threats',
      messages: [{ value: JSON.stringify(payload) }],
    });
    await this.redis.set(`fusion:${Date.now()}`, JSON.stringify(payload));
    return { status: 'fused', confidence: 0.93 };
  }
}
