import { AppConfigService } from '@app/config';
import { KafkaConsumerService } from '@app/kafka/kafka.consumer.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { OrderEventHandler } from './handlers/base.handler';
import { OrderCreatedHandler } from './handlers/order-created.handler';
import { OrderShippedHandler } from './handlers/order-shipped.handler';
import { OrderPaymentCreatedHandler } from './handlers/order-payment-created.handler';

@Injectable()
export class NotificationTestConsumer implements OnModuleInit {
  private eventHandlerMap: { [eventType: string]: OrderEventHandler } = {};

  constructor(
    private readonly config: AppConfigService,
    private readonly consumer: KafkaConsumerService,
    private readonly orderCreatedHandler: OrderCreatedHandler,
    private readonly orderShippedHandler: OrderShippedHandler,
    private readonly orderPaymentCreatedHandler: OrderPaymentCreatedHandler,
  ) {}

  async onModuleInit() {
    this.eventHandlerMap = {
      [this.orderCreatedHandler.eventType]: this.orderCreatedHandler,
      [this.orderShippedHandler.eventType]: this.orderShippedHandler,
      [this.orderPaymentCreatedHandler.eventType]:
        this.orderPaymentCreatedHandler,
    };

    await this.consumer.consume({
      topic: { topics: [this.config.kafka.topic] },
      config: { groupId: 'test-consumer' },
      onMessage: async (message) => {
        const parsedMessage = JSON.parse(message.value.toString());
        const eventType = parsedMessage.eventType;

        const handler = this.eventHandlerMap[eventType];
        if (handler) {
          await handler.handleEvent(parsedMessage);
        } else {
          console.warn(`Unhandled order event type: ${eventType}`);
        }
      },
    });
  }
}

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
//         const parsedMessage = JSON.parse(message.value.toString());

//         if (parsedMessage.eventType === 'OrderCreated') {
//           this.handleOrderCreated(parsedMessage);
//         } else if (parsedMessage.eventType === 'OrderShiped') {
//           this.handleOrderShipped(parsedMessage);
//         } else if (parsedMessage.eventType === 'OrderPaymentCreated') {
//           this.handleOrderPaymentCreated(parsedMessage);
//         } else {
//           console.warn(
//             `Unhandled order event type: ${parsedMessage.eventType}`,
//           );
//         }
//       },
//     });
//   }

//   private handleOrderCreated(parsedMessage: any) {
//     console.log(parsedMessage);
//     console.log('Order created');
//   }

//   private handleOrderShipped(parsedMessage: any) {
//     console.log(parsedMessage);
//     console.log('Order created');
//   }

//   private handleOrderPaymentCreated(parsedMessage: any) {
//     console.log(parsedMessage);
//     console.log('Order created');
//   }
// }

////////////////////
// TODO: Make test with multiple differnet topics
// TODO: Handle event based on event
