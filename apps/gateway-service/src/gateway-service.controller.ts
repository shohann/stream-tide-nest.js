import { Body, Controller, Get, Post } from '@nestjs/common';
import { GatewayServiceService } from './gateway-service.service';
import { CreateOrderDto } from './gateway-service.dto';

@Controller()
export class GatewayServiceController {
  constructor(private readonly gatewayServiceService: GatewayServiceService) {}

  @Get()
  getHello(): string {
    return this.gatewayServiceService.getHello();
  }

  @Post()
  createOrderEvent(@Body() paylaod: CreateOrderDto) {
    return this.gatewayServiceService.createOrder(paylaod);
  }
}
