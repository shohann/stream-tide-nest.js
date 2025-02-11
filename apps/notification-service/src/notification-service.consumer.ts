// import { AppConfigService } from '@app/config';
// import { KafkaConsumerService } from '@app/kafka/kafka.consumer.service';
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { ConsumerManagerService } from '@app/kafka/consumer.manager';

// @Injectable()
// export class NotificationTestConsumer implements OnModuleInit {
//   constructor(
//     private readonly config: AppConfigService,
//     private readonly consumer: KafkaConsumerService,
//   ) {}

//   async onModuleInit() {
//     await this.consumer.consume({
//       topic: { topics: [this.config.kafka.topic] },
//       config: { groupId: 'test-consumer' },
//       onMessage: async (message) => {
//         console.log(JSON.parse(message.value.toString()));
//       },
//     });
//   }
// }

// TODO: Make test with multiple differnet topics
// TODO: Handle event based on event

import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppConfigService } from '@app/config';
import { KafkaConsumerService } from '@app/kafka/kafka.consumer.service';
import { ConsumerConfigs } from '@app/kafka/kafka.consumer.service';

interface NotificationPayload {
  userId: string;
  price: number;
}

@Injectable()
export class NotificationTestConsumer implements OnModuleInit {
  constructor(
    private readonly config: AppConfigService,
    private readonly consumerManager: KafkaConsumerService, // ConsumerManagerService
  ) {}

  /**
   * Defines Kafka consumer configurations for this module.
   */
  private getConsumerConfigs(): ConsumerConfigs[] {
    return [
      {
        topics: [this.config.kafka.topic], // Fetch topic from config
        groupId: 'notification-consumer', // Unique group for notifications
        handler: this.handleNotification.bind(this), // Bind method for message handling
      },
    ];
  }

  /**
   * Initializes consumers when the module starts.
   */
  async onModuleInit() {
    await this.consumerManager.initConsumers(this.getConsumerConfigs());
  }

  /**
   * Processes incoming notification messages.
   * @param payload The parsed Kafka message payload
   */
  private async handleNotification(
    payload: NotificationPayload,
  ): Promise<void> {
    console.log('Received Notification:', payload.price);
    // Implement business logic for handling notifications
  }
}
