# Webhook Implementation Guide

## Setup Instructions

### 1. Environment Variables
Add these to your `.env.local`:
```bash
WEBHOOK_SECRET=your-secret-here  # Used for signature verification
```

### 2. File Structure
```
/e:/everything_green/
├── app/
│   └── api/
│       └── webhook/
│           └── route.ts         # Webhook endpoint handler
├── utils/
│   └── verify-signature.ts      # Signature verification utility
├── types/
│   └── webhook.ts              # TypeScript interfaces
├── generate-signature.js        # Helper for testing
└── db.json                     # Webhook data storage
```

### 3. Testing the Webhook

#### Method 1: Using Postman

1. Start your server:
```bash
npm run dev
```

2. Generate signature:
```bash
node generate-signature.js
```

3. Postman Setup:
- Method: POST
- URL: `http://localhost:3000/api/webhook`
- Headers:
  ```
  Content-Type: application/json
  x-webhook-signature: <signature from generate-signature.js>
  ```
- Body (raw JSON):
  ```json
  {
    "eventType": "user.created",
    "data": {
      "userId": "123",
      "email": "test@example.com"
    }
  }
  ```

#### Method 2: Using cURL
```bash
# Replace 'your-secret-here' with your WEBHOOK_SECRET
PAYLOAD='{"eventType":"user.created","data":{"userId":"123","email":"test@example.com"}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "your-secret-here" -hex | cut -d' ' -f2)

curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

### 4. Expected Responses

#### Success (200 OK)
```json
{
  "success": true,
  "message": "Received"
}
```

#### Error Cases
- Missing Signature (401)
```json
{
  "success": false,
  "message": "No signature provided"
}
```

- Invalid Signature (401)
```json
{
  "success": false,
  "message": "Invalid signature"
}
```

- Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

### 5. Data Storage
- Webhook data is stored in `db.json`
- Format:
```json
[
  {
    "eventType": "user.created",
    "data": {
      "userId": "123",
      "email": "test@example.com"
    },
    "timestamp": "2024-02-12T06:27:18.402Z"
  }
]
```

### 6. Security Notes
- Always keep your WEBHOOK_SECRET secure
- Never commit .env files to version control
- Use HTTPS in production
- Consider rate limiting for production use

### 7. Webhook Payload Structure
```typescript
interface WebhookPayload {
  eventType: string;     // Type of event (e.g., "user.created")
  data: Record<string, any>; // Event data
  timestamp?: string;    // Added automatically by the server
}
```

### 8. Troubleshooting
1. If signature verification fails:
   - Ensure WEBHOOK_SECRET matches in both sender and receiver
   - Check if payload is exactly the same
   - Verify signature is being generated correctly

2. If db.json isn't created:
   - Check write permissions in project directory
   - Ensure the process has filesystem access

3. If server doesn't start:
   - Verify all environment variables are set
   - Check for port conflicts
