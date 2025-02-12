const crypto = require('crypto');

// This is your webhook payload
const payload = {
    "eventType": "user.created",
    "data": {
        "userId": "123",
        "email": "test@example.com"
    }
};

// Convert payload to string - important!
const stringifiedPayload = JSON.stringify(payload);

// Use the same secret as in your .env.local
const secret = 'your-secret-here';

// Generate signature
const signature = crypto.createHmac('sha256', secret)
    .update(stringifiedPayload)
    .digest('hex');

console.log('\n=== Use these values in Postman ===\n');
console.log('Add this header:');
console.log('x-webhook-signature:', signature);
console.log('\nAdd this body:');
console.log(stringifiedPayload);
