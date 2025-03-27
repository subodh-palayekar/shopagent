import db from '@/db/index';
import { WebhookEvent } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

/**
 * Creates a new user record in the database from a Clerk "user.created" event.
 * @param event - The Clerk webhook event.
 * @returns The newly created user record.
 */
export async function createUserFromClerkWebhook(event: WebhookEvent) {
  if (event.type !== 'user.created') {
    throw new Error(`Unsupported event type: ${event.type}`);
  }

  const userData = event.data;

  const newUser = await db.user.create({
    data: {
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      email: userData.email_addresses[0]?.email_address,
      phoneNumber: userData.phone_numbers?.[0]?.phone_number || '',
      profilePic: userData.image_url,
      clerkUserId: userData.id,
    },
  });

  return newUser;
}

/**
 * Updates an existing user record in the database from a Clerk "user.updated" event.
 * @param event - The Clerk webhook event.
 * @returns The updated user record.
 */
export async function updateUserFromClerkWebhook(event: WebhookEvent) {
  if (event.type !== 'user.updated') {
    throw new Error(`Unsupported event type: ${event.type}`);
  }

  const userData = event.data;

  // Update the user record by matching the Clerk user id (clearkUserId)
  const updatedUser = await db.user.update({
    where: { clerkUserId: userData.id },
    data: {
      firstName: userData.first_name ?? '',
      lastName: userData.last_name ?? '',
      email: userData.email_addresses[0]?.email_address,
      phoneNumber: userData.phone_numbers?.[0]?.phone_number || '',
      profilePic: userData.image_url,
    },
  });

  return updatedUser;
}

/**
 * Deletes an existing user record from the database from a Clerk "user.deleted" event.
 * @param event - The Clerk webhook event.
 * @returns The deleted user record.
 */
export async function deleteUserFromClerkWebhook(event: WebhookEvent) {
  if (event.type !== 'user.deleted') {
    throw new Error(`Unsupported event type: ${event.type}`);
  }

  const userData = event.data;

  // Delete the user record using the Clerk user id
  const deletedUser = await db.user.delete({
    where: { clerkUserId: userData.id },
  });

  return deletedUser;
}
