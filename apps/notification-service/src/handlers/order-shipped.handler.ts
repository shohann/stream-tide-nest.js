// order-shipped.handler.ts
import { Injectable } from '@nestjs/common';
import { OrderEventHandler } from './base.handler';

@Injectable()
export class OrderShippedHandler implements OrderEventHandler {
  eventType = 'OrderShiped'; // ensure this matches the event type in your messages

  async handleEvent(parsedMessage: any): Promise<void> {
    console.log(parsedMessage);
    console.log('Order shipped');
    // Add your business logic here
  }
}
