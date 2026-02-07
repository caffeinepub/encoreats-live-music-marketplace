import { useEffect, useRef } from 'react';
import { useRecordUsageEvent } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';
import { EventType } from '../backend';

export function useUsageTracking() {
  const { identity } = useInternetIdentity();
  const { mutate: recordEvent } = useRecordUsageEvent();
  const hasTrackedSession = useRef(false);

  useEffect(() => {
    // Only track if authenticated and haven't tracked this session yet
    if (identity && !hasTrackedSession.current) {
      recordEvent({ eventType: EventType.session_start });
      hasTrackedSession.current = true;
    }
  }, [identity, recordEvent]);

  const trackPageView = (page: string) => {
    if (identity) {
      recordEvent({ eventType: EventType.page_view, page });
    }
  };

  const trackAction = (actionCategory: string, actionDetail?: string) => {
    if (identity) {
      recordEvent({ eventType: EventType.action, actionCategory, actionDetail });
    }
  };

  return { trackPageView, trackAction };
}
