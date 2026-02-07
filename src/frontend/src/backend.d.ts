import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type UserId = Principal;
export type GigId = bigint;
export type Time = bigint;
export interface Gig {
    id: GigId;
    status: Variant_pending_completed_confirmed;
    venueId: UserId;
    blob: ExternalBlob;
    date: Time;
    name: string;
    musicianId: UserId;
    contractUrl: string;
    price: bigint;
}
export interface Slot {
    id: bigint;
    startTime: Time;
    endTime?: Time;
    userId: UserId;
    isAvailable: boolean;
}
export interface UserProfile {
    id: UserId;
    bio: string;
    contractBlob?: ExternalBlob;
    name: string;
    role: Role;
    rating: number;
    phone: string;
    location: string;
}
export enum Role {
    musician = "musician",
    customer = "customer",
    venue = "venue"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_completed_confirmed {
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookGig(gig: Gig): Promise<void>;
    createOrUpdateProfile(profile: UserProfile): Promise<void>;
    createSlot(slot: Slot): Promise<void>;
    fetchAllGigs(): Promise<Array<Gig>>;
    fetchAllMusicians(): Promise<Array<UserProfile>>;
    fetchAllProfiles(): Promise<Array<UserProfile>>;
    fetchAllSlots(): Promise<Array<Slot>>;
    fetchAvailableSlots(userId: UserId): Promise<Array<Slot>>;
    fetchAvailableSlotsByMusician(musicianId: UserId): Promise<Array<Slot>>;
    fetchGigs(): Promise<Array<Gig>>;
    fetchGigsByMusician(musicianId: UserId): Promise<Array<Gig>>;
    fetchGigsByVenue(venueId: UserId): Promise<Array<Gig>>;
    fetchMusicianGigs(userId: UserId): Promise<Array<Gig>>;
    fetchMusiciansByLocation(location: string): Promise<Array<UserProfile>>;
    fetchProfilesByLocation(location: string): Promise<Array<UserProfile>>;
    fetchSlots(userId: UserId): Promise<Array<Slot>>;
    fetchSlotsByMusician(musicianId: UserId): Promise<Array<Slot>>;
    fetchVenueGigs(userId: UserId): Promise<Array<Gig>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletState(userId: UserId): Promise<{
        paid: bigint;
        locked: bigint;
        available: bigint;
    }>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateSlotAvailability(slotId: bigint, available: boolean): Promise<void>;
    uploadContract(gigId: bigint, blobId: string, contract: ExternalBlob): Promise<void>;
    verifyGig(gigId: bigint): Promise<void>;
}
