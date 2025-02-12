# Testing the Webhook

1. First, set your WEBHOOK_SECRET in your environment variables or .env file:
```
WEBHOOK_SECRET=your-secret-here
```

2. Send a test webhook using cURL:
```bash
# Generate signature
PAYLOAD='{"eventType":"test","data":{"message":"hello"}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "your-secret-here" -hex | cut -d' ' -f2)

# Send request
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

Expected successful response:
```json
{
  "success": true,
  "message": "Received"
}
```
