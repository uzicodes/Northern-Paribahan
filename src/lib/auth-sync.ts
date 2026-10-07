import { provisionUserAction } from '@/actions/auth';

let inFlightSync: Promise<{ success: boolean; user?: any; error?: string }> | null = null;

/**
 * Data-layer synchronization function that handles user provisioning.
 * Features in-flight deduplication to prevent double-firing and race conditions.
 */
export async function syncUserSession() {
  if (inFlightSync) {
    return inFlightSync;
  }

  inFlightSync = (async () => {
    try {
      return await provisionUserAction();
    } catch (err) {
      console.error('[auth-sync] Error during user provisioning:', err);
      return { success: false, error: 'Network error during sync' };
    } finally {
      inFlightSync = null;
    }
  })();

  return inFlightSync;
}

