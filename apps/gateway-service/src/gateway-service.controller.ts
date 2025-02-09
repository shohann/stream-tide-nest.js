import { Body, Controller, Get, Post } from '@nestjs/common';
import { GatewayServiceService } from './gateway-service.service';
import { CreateOrderDto } from './gateway-service.dto';
import { KafkaProducerService } from '@app/kafka/kafka.producer.service';

@Controller()
export class GatewayServiceController {
  constructor(
    private readonly gatewayServiceService: GatewayServiceService,
    private readonly producerService: KafkaProducerService,
  ) {}

  @Get()
  getHello(): string {
    return this.gatewayServiceService.getHello();
  }

  // @Post()
  // createOrderEvent(@Body() paylaod: CreateOrderDto) {
  //   return this.gatewayServiceService.createOrder(paylaod);
  // }

  @Post()
  kafkatest(@Body() payload: CreateOrderDto) {
    console.log('++++++PRODUCING+++++++=');
    console.log(payload);
    console.log('++++++PRODUCED+++++++=');
    return this.producerService.produce({
      value: 'My name is =========',
    });
  }
}
