// import { Module } from '@nestjs/common';
// import { NotificationServiceController } from './notification-service.controller';
// import { NotificationServiceService } from './notification-service.service';
// import { AppConfigModule } from '@app/config';
// import { KafkaModule } from '@app/kafka';
// import { NotificationTestConsumer } from './notification-service.consumer';
// import { OrderCreatedHandler } from './handlers/order-created.handler';
// import { OrderShippedHandler } from './handlers/order-shipped.handler';
// import { OrderPaymentCreatedHandler } from './handlers/order-payment-created.handler';
// // import { BaseEventHandler } from './handlers/base.handler';

// @Module({
//   imports: [AppConfigModule, KafkaModule],
//   controllers: [NotificationServiceController],
//   providers: [
//     NotificationTestConsumer,
//     NotificationServiceService,
//     OrderCreatedHandler,
//     OrderShippedHandler,
//     OrderPaymentCreatedHandler,
//   ],
// })
// export class NotificationServiceModule {}

import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { AppConfigModule } from '@app/config';
import { KafkaModule } from '@app/kafka';
import { NotificationTestConsumer } from './notification-service.consumer';
import { OrderCreatedHandler } from './handlers/order-created.handler';
import { OrderShippedHandler } from './handlers/order-shipped.handler';
import { OrderPaymentCreatedHandler } from './handlers/order-payment-created.handler';

@Module({
  imports: [AppConfigModule, KafkaModule],
  controllers: [NotificationServiceController],
  providers: [
    OrderCreatedHandler,
    OrderShippedHandler,
    OrderPaymentCreatedHandler,
    NotificationTestConsumer,
    NotificationServiceService,
  ],
})
export class NotificationServiceModule {}
