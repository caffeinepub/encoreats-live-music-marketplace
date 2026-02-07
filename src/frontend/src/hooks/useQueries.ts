import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, Gig, Slot, Role, AnalyticsSummary, UsageEvent, EventType } from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

// Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(Principal.fromText(userId));
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
}

// Musicians Queries
export function useFetchAllMusicians() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['musicians'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.fetchAllMusicians();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFetchMusiciansByLocation(location: string) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['musicians', 'location', location],
    queryFn: async () => {
      if (!actor) return [];
      return actor.fetchMusiciansByLocation(location);
    },
    enabled: !!actor && !isFetching && !!location,
  });
}

// Gigs Queries
export function useFetchAllGigs() {
  const { actor, isFetching } = useActor();

  return useQuery<Gig[]>({
    queryKey: ['gigs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.fetchAllGigs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFetchVenueGigs(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Gig[]>({
    queryKey: ['venueGigs', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.fetchGigsByVenue(Principal.fromText(userId));
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useFetchMusicianGigs(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Gig[]>({
    queryKey: ['musicianGigs', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.fetchGigsByMusician(Principal.fromText(userId));
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useBookGig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gig: Gig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookGig(gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      queryClient.invalidateQueries({ queryKey: ['venueGigs'] });
      toast.success('Gig booked successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to book gig: ${error.message}`);
    },
  });
}

export function useVerifyGig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gigId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyGig(gigId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      queryClient.invalidateQueries({ queryKey: ['venueGigs'] });
      queryClient.invalidateQueries({ queryKey: ['musicianGigs'] });
      toast.success('Gig verified successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to verify gig: ${error.message}`);
    },
  });
}

// Slots Queries
export function useFetchSlotsByMusician(musicianId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Slot[]>({
    queryKey: ['slots', musicianId],
    queryFn: async () => {
      if (!actor || !musicianId) return [];
      return actor.fetchSlotsByMusician(Principal.fromText(musicianId));
    },
    enabled: !!actor && !isFetching && !!musicianId,
  });
}

export function useCreateSlot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slot: Slot) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSlot(slot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Availability slot created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create slot: ${error.message}`);
    },
  });
}

export function useUpdateSlotAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slotId, available }: { slotId: bigint; available: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSlotAvailability(slotId, available);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Availability updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update availability: ${error.message}`);
    },
  });
}

// Wallet Query
export function useGetWalletState(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<{ locked: bigint; available: bigint; paid: bigint }>({
    queryKey: ['wallet', userId],
    queryFn: async () => {
      if (!actor || !userId) return { locked: BigInt(0), available: BigInt(0), paid: BigInt(0) };
      return actor.getWalletState(Principal.fromText(userId));
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useUploadContract() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gigId, blobId, contract }: { gigId: bigint; blobId: string; contract: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadContract(gigId, blobId, contract);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      toast.success('Contract uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload contract: ${error.message}`);
    },
  });
}

// Admin Authorization Query
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Analytics Queries (Admin Only)
export function useGetAnalyticsSummary() {
  const { actor, isFetching } = useActor();
  const { data: isAdmin } = useIsCallerAdmin();

  return useQuery<AnalyticsSummary>({
    queryKey: ['analyticsSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsSummary();
    },
    enabled: !!actor && !isFetching && isAdmin === true,
    retry: false,
  });
}

export function useGetUsageEvents() {
  const { actor, isFetching } = useActor();
  const { data: isAdmin } = useIsCallerAdmin();

  return useQuery<UsageEvent[]>({
    queryKey: ['usageEvents'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUsageEvents();
    },
    enabled: !!actor && !isFetching && isAdmin === true,
    retry: false,
  });
}

// Usage Tracking Mutation
export function useRecordUsageEvent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ 
      eventType, 
      page, 
      actionCategory, 
      actionDetail 
    }: { 
      eventType: EventType; 
      page?: string; 
      actionCategory?: string; 
      actionDetail?: string;
    }) => {
      if (!actor) return;
      try {
        await actor.recordUsageEvent(
          eventType, 
          page || null, 
          actionCategory || null, 
          actionDetail || null
        );
      } catch (error) {
        // Silently fail - tracking should not break the app
        console.warn('Failed to record usage event:', error);
      }
    },
  });
}
