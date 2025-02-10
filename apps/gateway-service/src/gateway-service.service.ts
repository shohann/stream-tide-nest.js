import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayServiceService {
  constructor() {} // private notificationProxyClient: ClientKafka, // @Inject('NOTIFICATION_SERVICE')
  getHello(): string {
    return 'Hello World!';
  }

  // createOrder(paylaod: CreateOrderDto) {
  //   this.notificationProxyClient.emit(
  //     'order_created',
  //     new OrderCreatedEvent('123', paylaod.userId, paylaod.price),
  //   );
  //   return paylaod;
  // }
}
