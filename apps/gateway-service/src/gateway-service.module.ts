import { Module } from '@nestjs/common';
import { GatewayServiceController } from './gateway-service.controller';
import { GatewayServiceService } from './gateway-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from '@app/kafka';
import { AppConfigModule } from '@app/config';
import { TestConsumer } from './consumer';

@Module({
  imports: [
    AppConfigModule,
    KafkaModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'notification-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [GatewayServiceController],
  providers: [GatewayServiceService, TestConsumer],
})
export class GatewayServiceModule {}
