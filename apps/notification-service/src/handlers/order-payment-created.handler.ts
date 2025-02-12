// order-payment-created.handler.ts
import { Injectable } from '@nestjs/common';
import { OrderEventHandler } from './base.handler';

@Injectable()
export class OrderPaymentCreatedHandler implements OrderEventHandler {
  eventType = 'OrderPaymentCreated';

  async handleEvent(parsedMessage: any): Promise<void> {
    console.log(parsedMessage);
    console.log('Order payment created');
    // Add your business logic here
  }
}
