'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';

/**
 * Server Action to securely provision and synchronize an authenticated user
 * into the database without requiring client-side REST fetches inside useEffect.
 */
export async function provisionUserAction() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    return { success: false, error: 'Unauthorized' };
  }

  const userEmail = user.email.toLowerCase().trim();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          email: userEmail,
          name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          phoneNumber: user.user_metadata?.phone || null,
        },
      });
      return { success: true, user: newUser };
    }

    return { success: true, user: existingUser };
  } catch (error) {
    console.error('[provisionUserAction] Failed to provision user in Prisma:', error);
    return { success: false, error: 'Failed to provision user' };
  }
}

