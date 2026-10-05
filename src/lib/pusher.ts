import PusherServer from 'pusher';
import PusherClient, { Channel } from 'pusher-js';

// Server-side instance (only use in API routes/Server Actions)
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side singleton & reference-counted channel subscriber
let pusherClientInstance: PusherClient | null = null;
const channelRefCount = new Map<string, number>();

export const getPusherClient = (): PusherClient => {
  if (typeof window === 'undefined') {
    return null as any;
  }
  if (!pusherClientInstance) {
    // Enable verbose logging in browser console for easier real-time debugging
    PusherClient.logToConsole = true;

    pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
    });
  }
  return pusherClientInstance;
};

/**
 * Subscribes to a schedule's Pusher channel with reference counting.
 * Prevents duplicate WebSocket connections and handles React 18 Strict Mode cleanly.
 */
export const subscribeToScheduleChannel = (scheduleId: string): Channel | null => {
  const pusher = getPusherClient();
  if (!pusher) return null;

  const channelName = `schedule-${scheduleId}`;
  const count = channelRefCount.get(channelName) || 0;
  channelRefCount.set(channelName, count + 1);

  return pusher.channel(channelName) || pusher.subscribe(channelName);
};

/**
 * Decrements reference count and un-subscribes only after a delay.
 * In React 18 Strict Mode, components run mount -> cleanup -> mount immediately.
 * The delay prevents premature teardown of active channels during that lifecycle cycle.
 */
export const unsubscribeFromScheduleChannel = (scheduleId: string): void => {
  const channelName = `schedule-${scheduleId}`;
  const count = channelRefCount.get(channelName) || 0;
  const newCount = Math.max(0, count - 1);
  channelRefCount.set(channelName, newCount);

  setTimeout(() => {
    if ((channelRefCount.get(channelName) || 0) === 0) {
      const pusher = getPusherClient();
      if (pusher) {
        console.log(`[Pusher] Unsubscribing from idle channel: ${channelName}`);
        pusher.unsubscribe(channelName);
      }
    }
  }, 1200);
};
