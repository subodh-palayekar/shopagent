import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  createUserFromClerkWebhook,
  updateUserFromClerkWebhook,
  deleteUserFromClerkWebhook,
} from '@/db/user.queries';

export async function POST(request: Request) {
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error('Webhook secret is missing');
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('svix header is missing', { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (error) {
      console.error('Error occurred while verifying webhook', error);
      return new Response('error while verifying webhook', { status: 400 });
    }

    // Process event based on its type
    switch (evt.type) {
      case 'user.created': {
        const createdUser = await createUserFromClerkWebhook(evt);
        console.log('User created:', createdUser);
        break;
      }
      case 'user.updated': {
        const updatedUser = await updateUserFromClerkWebhook(evt);
        console.log('User updated:', updatedUser);
        break;
      }
      case 'user.deleted': {
        const deletedUser = await deleteUserFromClerkWebhook(evt);
        console.log('User deleted:', deletedUser);
        break;
      }
      default:
        console.warn(`Unhandled event type: ${evt.type}`);
    }

    return new Response('user created', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
