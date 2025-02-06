import { Injectable } from '@nestjs/common';
import { OrderCreatedEvent } from 'apps/gateway-service/src/notification.created';

@Injectable()
export class NotificationServiceService {
  getHello(): string {
    return 'Hello World!';
  }

  handleOrderCreated(data: OrderCreatedEvent) {
    // console.log(data.value);
    console.log(data.orderId);
  }
}
