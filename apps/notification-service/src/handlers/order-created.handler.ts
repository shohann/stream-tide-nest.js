import { Injectable } from '@nestjs/common';
import { OrderEventHandler } from './base.handler';

@Injectable()
export class OrderCreatedHandler implements OrderEventHandler {
  eventType = 'OrderCreated';

  async handleEvent(parsedMessage: any): Promise<void> {
    console.log(parsedMessage);
    console.log('Order created');
    // Add your business logic here
  }
}
