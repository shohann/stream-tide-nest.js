import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './gateway-service.dto';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './notification.created';

@Injectable()
export class GatewayServiceService {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private notificationProxyClient: ClientKafka,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  createOrder(paylaod: CreateOrderDto) {
    this.notificationProxyClient.emit(
      'order_created',
      new OrderCreatedEvent('123', paylaod.userId, paylaod.price),
    );
    return paylaod;
  }
}
