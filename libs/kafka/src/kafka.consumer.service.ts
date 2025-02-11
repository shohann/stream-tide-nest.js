import { AppConfigService } from '@app/config';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';
import { KafkaConsumer } from './consumer.service';

interface KafkajsConsumerOptions {
  topic: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>;
}

export interface IConsumer {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  consume: (message: any) => Promise<void>;
}

///
export interface ConsumerConfigs {
  topics: string[];
  groupId: string;
  handler: (payload: any) => Promise<void>;
}
///

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(private readonly configService: AppConfigService) {}

  async consume({ topic, config, onMessage }: KafkajsConsumerOptions) {
    const consumer = new KafkaConsumer(
      topic,
      config,
      this.configService.kafka.broker,
    );
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  ////
  private createMessageHandler(
    handler: (payload: any) => Promise<void>,
  ): (message: { value: Buffer }) => Promise<void> {
    return async (message: { value: Buffer }) => {
      try {
        const payload = JSON.parse(message.value.toString());
        await handler(payload);
      } catch (error) {
        console.error('Error processing message', error);
      }
    };
  }

  async initConsumers(configs: ConsumerConfigs[]): Promise<void> {
    await Promise.all(
      configs.map(({ topics, groupId, handler }) =>
        this.consume({
          topic: { topics },
          config: { groupId },
          onMessage: this.createMessageHandler(handler),
        }),
      ),
    );
  }
  ///
}
