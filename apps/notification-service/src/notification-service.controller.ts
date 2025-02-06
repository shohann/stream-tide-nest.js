import { Controller, Get } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NotificationServiceController {
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.notificationServiceService.getHello();
  }

  @EventPattern('order_created')
  handleOrderCreated(data: any) {
    // console.log(data);
    this.notificationServiceService.handleOrderCreated(data);
  }
}
