import { AppConfigService } from '@app/config';
import { KafkaConsumerService } from '@app/kafka/kafka.consumer.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class NotificationTestConsumer implements OnModuleInit {
  constructor(
    private readonly config: AppConfigService,
    private readonly consumer: KafkaConsumerService,
  ) {}

  async onModuleInit() {
    await this.consumer.consume({
      topic: { topics: this.config.kafka.topic }, // TODO: Make test with multiple differnet topics
      config: { groupId: 'test-consumer' },
      onMessage: async (message) => {
        console.log(JSON.parse(message.value.toString()));
      },
    });
  }
}
