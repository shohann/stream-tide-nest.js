export interface OrderEventHandler {
  // The event type this handler is responsible for.
  eventType: string;
  // The method that will handle the event.
  handleEvent(parsedMessage: any): Promise<void>;
}
