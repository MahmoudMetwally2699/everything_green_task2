import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '@/utils/verify-signature';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-webhook-signature');
    const body = await request.json();

    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'No signature provided' },
        { status: 401 }
      );
    }

    const isValid = verifySignature(JSON.stringify(body), signature);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      );
    }

    const dbPath = path.join(process.cwd(), 'db.json');

    // Read existing data or create new array
    let webhookData = [];
    try {
      const fileContent = await fs.readFile(dbPath, 'utf-8');
      webhookData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, use empty array
    }

    // Add new webhook data with timestamp
    webhookData.push({
      ...body,
      timestamp: new Date().toISOString()
    });

    // Write back to file
    await fs.writeFile(dbPath, JSON.stringify(webhookData, null, 2));

    return NextResponse.json(
      { success: true, message: 'Received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
