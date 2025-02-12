export interface WebhookPayload {
  eventType: string;
  data: Record<string, any>;
  timestamp?: string;
}
