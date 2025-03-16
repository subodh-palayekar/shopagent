import { User } from '@prisma/client';
import db from '@/db/index';

export async function createUser(data: User) {
  try {
    const user = await db.user.create({ data });

    return { user };
  } catch (error) {
    return { error };
  }
}
