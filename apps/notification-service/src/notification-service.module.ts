import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { AppConfigModule } from '@app/config';
import { KafkaModule } from '@app/kafka';
import { NotificationTestConsumer } from './notification-service.consumer';

@Module({
  imports: [AppConfigModule, KafkaModule],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService, NotificationTestConsumer],
})
export class NotificationServiceModule {}
