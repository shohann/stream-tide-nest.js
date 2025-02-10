import { Module } from '@nestjs/common';
import { GatewayServiceController } from './gateway-service.controller';
import { GatewayServiceService } from './gateway-service.service';
import { KafkaModule } from '@app/kafka';
import { AppConfigModule } from '@app/config';

@Module({
  imports: [AppConfigModule, KafkaModule],
  controllers: [GatewayServiceController],
  providers: [GatewayServiceService],
})
export class GatewayServiceModule {}
