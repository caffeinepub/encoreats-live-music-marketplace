import List "mo:core/List";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserId = Principal;
  type GigId = Nat;
  type TransactionId = Nat;

  // User roles
  type Role = { #venue; #musician; #customer };

  // Initialize static ID counters (will be managed in stable storage for real deployment)
  var gigIdCounter = 0;
  var transactionIdCounter = 0;

  // Profile Types
  public type UserProfile = {
    id : UserId;
    role : Role;
    name : Text;
    phone : Text;
    bio : Text;
    rating : Float;
    location : Text;
    contractBlob : ?Storage.ExternalBlob;
  };

  module Profile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      switch (Text.compare(profile1.name, profile2.name)) {
        case (#equal) { Text.compare(profile1.location, profile2.location) };
        case (order) { order };
      };
    };

    public func compareByLocation(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.location, profile2.location);
    };
  };

  // Availability Slot Types
  type Slot = {
    id : Nat;
    userId : UserId;
    startTime : Time.Time;
    endTime : ?Time.Time;
    isAvailable : Bool;
  };

  module Slot {
    public func compare(slot1 : Slot, slot2 : Slot) : Order.Order {
      Nat.compare(slot1.id, slot2.id);
    };

    public func compareByStartTime(slot1 : Slot, slot2 : Slot) : Order.Order {
      Int.compare(slot1.startTime, slot2.startTime);
    };
  };

  // Gig Types
  type Gig = {
    id : GigId;
    name : Text;
    venueId : UserId;
    musicianId : UserId;
    date : Time.Time;
    price : Nat;
    status : { #pending; #confirmed; #completed };
    contractUrl : Text;
    blob : Storage.ExternalBlob;
  };

  module Gig {
    public func compare(gig1 : Gig, gig2 : Gig) : Order.Order {
      Nat.compare(gig1.id, gig2.id);
    };

    public func compareByVenueId(gig1 : Gig, gig2 : Gig) : Order.Order {
      Text.compare(gig1.venueId.toText(), gig2.venueId.toText());
    };

    public func compareByMusicianId(gig1 : Gig, gig2 : Gig) : Order.Order {
      Text.compare(gig1.musicianId.toText(), gig2.musicianId.toText());
    };

    public func compareByDate(gig1 : Gig, gig2 : Gig) : Order.Order {
      Int.compare(gig1.date, gig2.date);
    };
  };

  // Transaction Types
  type Transaction = {
    id : TransactionId;
    gigId : Nat;
    amount : Nat;
    state : { #locked; #available; #paid };
    timestamp : Time.Time;
  };

  module Transaction {
    public func compare(transaction1 : Transaction, transaction2 : Transaction) : Order.Order {
      Nat.compare(transaction1.id, transaction2.id);
    };

    public func compareByGigId(transaction1 : Transaction, transaction2 : Transaction) : Order.Order {
      Nat.compare(transaction1.gigId, transaction2.gigId);
    };
  };

  // ROI Data Types
  type ROIData = {
    gigId : Nat;
    totalSales : Nat;
    attendanceCount : Nat;
  };

  module ROIData {
    public func compare(roi1 : ROIData, roi2 : ROIData) : Order.Order {
      Nat.compare(roi1.gigId, roi2.gigId);
    };
  };

  // Analytics Tracking Types
  public type EventType = { #session_start; #page_view; #action; #login; #logout };

  // Extended UsageEvent type to include action details
  public type UsageEvent = {
    timestamp : Time.Time;
    principal : Principal;
    eventType : EventType;
    page : ?Text;
    actionCategory : ?Text;
    actionDetail : ?Text;
  };

  public type AnalyticsSummary = {
    totalUniqueUsers : Nat;
    totalSessions : Nat;
    dailyActiveUsers : Nat;
    lastActiveUsers : Nat;
    recentEvents : [UsageEvent];
    analyticsTrackingEnabled : Bool;
  };

  // Usage Activity Tracker
  let eventLog = List.empty<UsageEvent>();
  var totalUniqueUsers = 0;
  var totalSessions = 0;
  var dailyActiveUsers = 0;
  var lastActiveUsers = 0;
  var analyticsTrackingEnabled = true;

  // Data Stores
  let profiles = Map.empty<UserId, UserProfile>();
  let gigs = Map.empty<GigId, Gig>();
  let transactions = Map.empty<TransactionId, Transaction>();
  let roiData = Map.empty<GigId, ROIData>();
  let slots = Map.empty<Nat, Slot>();

  // Analytics Management Functions
  func logEvent(principal : Principal, eventType : EventType, page : ?Text, actionCategory : ?Text, actionDetail : ?Text) {
    if (analyticsTrackingEnabled) {
      let event = {
        timestamp = Time.now();
        principal;
        eventType;
        page;
        actionCategory;
        actionDetail;
      };
      eventLog.add(event);

      switch (eventType) {
        case (#session_start) { totalSessions += 1 };
        case (#page_view) { totalSessions += 1 };
        case (#action) {};
        case (#login) { totalSessions += 1 };
        case (#logout) {};
      };

      totalUniqueUsers := eventLog.size();
    };
  };

  // Data Store Management
  func insertProfile(profile : UserProfile) { profiles.add(profile.id, profile) };
  func removeProfile(id : UserId) { profiles.remove(id) };
  func containsProfile(id : UserId) : Bool { profiles.containsKey(id) };
  func iterProfiles() : Iter.Iter<(UserId, UserProfile)> { profiles.entries() };
  func getProfile(id : UserId) : ?UserProfile { profiles.get(id) };
  func sizeProfiles() : Nat { profiles.size() };
  func clearProfiles() { profiles.clear() };

  func insertGig(gig : Gig) { gigs.add(gig.id, gig) };
  func removeGig(id : GigId) { gigs.remove(id) };
  func containsGig(id : GigId) : Bool { gigs.containsKey(id) };
  func iterGigs() : Iter.Iter<(GigId, Gig)> { gigs.entries() };
  func getGig(id : GigId) : ?Gig { gigs.get(id) };
  func sizeGigs() : Nat { gigs.size() };
  func clearGigs() { gigs.clear() };

  func insertTransaction(transaction : Transaction) { transactions.add(transaction.id, transaction) };
  func removeTransaction(id : TransactionId) { transactions.remove(id) };
  func containsTransaction(id : TransactionId) : Bool { transactions.containsKey(id) };
  func iterTransactions() : Iter.Iter<(TransactionId, Transaction)> { transactions.entries() };
  func getTransaction(id : TransactionId) : ?Transaction { transactions.get(id) };
  func sizeTransactions() : Nat { transactions.size() };
  func clearTransactions() { transactions.clear() };

  func insertROIData(roi : ROIData) { roiData.add(roi.gigId, roi) };
  func removeROIData(id : GigId) { roiData.remove(id) };
  func containsROIData(id : GigId) : Bool { roiData.containsKey(id) };
  func iterROIData() : Iter.Iter<(GigId, ROIData)> { roiData.entries() };
  func getROIData(id : GigId) : ?ROIData { roiData.get(id) };
  func sizeROIData() : Nat { roiData.size() };
  func clearROIData() { roiData.clear() };

  func insertSlot(slot : Slot) { slots.add(slot.id, slot) };
  func removeSlot(id : Nat) { slots.remove(id) };
  func containsSlot(id : Nat) : Bool { slots.containsKey(id) };
  func iterSlots() : Iter.Iter<(Nat, Slot)> { slots.entries() };
  func getSlot(id : Nat) : ?Slot { slots.get(id) };
  func sizeSlots() : Nat { slots.size() };
  func clearSlots() { slots.clear() };

  // Required profile management functions for frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Anyone can view public profiles (musicians, venues for discovery)
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (caller != profile.id) {
      Runtime.trap("Unauthorized: Can only save your own profile");
    };
    insertProfile(profile);
  };

  // Query / Fetch Logic - Public discovery functions (no auth needed for browsing)
  public query ({ caller }) func fetchAllMusicians() : async [UserProfile] {
    profiles.values().toArray().filter(
      func(x) { x.role == #musician }
    );
  };

  public query ({ caller }) func fetchMusiciansByLocation(location : Text) : async [UserProfile] {
    profiles.values().toArray().filter(
      func(x) { x.role == #musician and x.location.contains(#text location) }
    );
  };

  public query ({ caller }) func fetchSlots(userId : UserId) : async [Slot] {
    // Public - anyone can view musician availability for booking
    slots.values().toArray().filter(
      func(x) { x.userId == userId }
    );
  };

  public query ({ caller }) func fetchAvailableSlots(userId : UserId) : async [Slot] {
    // Public - anyone can view available slots for booking
    slots.values().toArray().filter(
      func(x) { x.userId == userId and x.isAvailable }
    );
  };

  public query ({ caller }) func fetchGigs() : async [Gig] {
    // Public - customers can browse all events
    gigs.values().toArray();
  };

  public query ({ caller }) func fetchMusicianGigs(userId : UserId) : async [Gig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view gig details");
    };
    // Only the musician themselves or admin can view their gigs
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own gigs");
    };
    gigs.values().toArray().filter(
      func(x) { x.musicianId == userId }
    );
  };

  public query ({ caller }) func fetchVenueGigs(userId : UserId) : async [Gig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view gig details");
    };
    // Only the venue themselves or admin can view their gigs
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own gigs");
    };
    gigs.values().toArray().filter(
      func(x) { x.venueId == userId }
    );
  };

  public query ({ caller }) func getWalletState(userId : UserId) : async { locked : Nat; available : Nat; paid : Nat } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wallet state");
    };
    // Only the user themselves or admin can view their wallet
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own wallet");
    };

    let transactionsArray = transactions.values().toArray();
    let locked = transactionsArray.filter(
      func(x) { x.state == #locked }
    ).size();
    let available = transactionsArray.filter(
      func(x) { x.state == #available }
    ).size();
    let paid = transactionsArray.filter(
      func(x) { x.state == #paid }
    ).size();
    { locked; available; paid };
  };

  // Profile Management
  public shared ({ caller }) func createOrUpdateProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create/update profiles");
    };
    // Users can only create/update their own profile
    if (caller != profile.id) {
      Runtime.trap("Unauthorized: Can only modify your own profile");
    };

    switch (getProfile(profile.id)) {
      case (null) {
        insertProfile(profile);
      };
      case (?existing) {
        insertProfile({ existing with name = profile.name; phone = profile.phone; bio = profile.bio; location = profile.location; contractBlob = profile.contractBlob });
      };
    };
  };

  // Gig Booking
  public shared ({ caller }) func bookGig(gig : Gig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book gigs");
    };

    // Only the venue can book gigs for themselves
    if (caller != gig.venueId) {
      Runtime.trap("Unauthorized: Can only book gigs for your own venue");
    };

    // Verify the venue has a venue role
    switch (getProfile(caller)) {
      case (null) {
        Runtime.trap("Profile not found");
      };
      case (?profile) {
        if (profile.role != #venue) {
          Runtime.trap("Unauthorized: Only venues can book gigs");
        };
      };
    };

    // Verify musician exists
    switch (getProfile(gig.musicianId)) {
      case (null) {
        Runtime.trap("Musician not found");
      };
      case (?musicianProfile) {
        if (musicianProfile.role != #musician) {
          Runtime.trap("Invalid musician ID");
        };
      };
    };

    if (containsGig(gig.id)) {
      Runtime.trap("Gig already exists");
    };
    insertGig(gig);
  };

  // Slot Management
  public shared ({ caller }) func createSlot(slot : Slot) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create slots");
    };

    // Only musicians can create slots for themselves
    if (caller != slot.userId) {
      Runtime.trap("Unauthorized: Can only create slots for yourself");
    };

    // Verify the user is a musician
    switch (getProfile(caller)) {
      case (null) {
        Runtime.trap("Profile not found");
      };
      case (?profile) {
        if (profile.role != #musician) {
          Runtime.trap("Unauthorized: Only musicians can create availability slots");
        };
      };
    };

    if (containsSlot(slot.id)) {
      Runtime.trap("Slot already exists");
    };
    insertSlot(slot);
  };

  // Availability Management
  public shared ({ caller }) func updateSlotAvailability(slotId : Nat, available : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update slot availability");
    };

    switch (getSlot(slotId)) {
      case (null) {
        Runtime.trap("Slot not found");
      };
      case (?existing) {
        // Only the slot owner can update it
        if (caller != existing.userId) {
          Runtime.trap("Unauthorized: Can only update your own slots");
        };

        let updatedSlot = { existing with isAvailable = available };
        insertSlot(updatedSlot);
      };
    };
  };

  // Contract Upload
  public shared ({ caller }) func uploadContract(gigId : Nat, blobId : Text, contract : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload contracts");
    };

    switch (getGig(gigId)) {
      case (null) {
        Runtime.trap("Gig not found");
      };
      case (?gig) {
        // Only the venue can upload contracts for their gigs
        if (caller != gig.venueId) {
          Runtime.trap("Unauthorized: Only the venue can upload contracts for their gigs");
        };

        insertGig({ gig with blob = contract });
      };
    };
  };

  // QR Verification
  public shared ({ caller }) func verifyGig(gigId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify gigs");
    };

    switch (getGig(gigId)) {
      case (null) {
        Runtime.trap("Gig not found");
      };
      case (?gig) {
        // Only the venue can verify gigs at their venue
        if (caller != gig.venueId) {
          Runtime.trap("Unauthorized: Only the venue can verify gigs");
        };

        insertGig({ gig with status = #completed });
      };
    };
  };

  public query ({ caller }) func fetchAllProfiles() : async [UserProfile] {
    // Public - anyone can browse profiles for discovery
    profiles.values().toArray().sort();
  };

  public query ({ caller }) func fetchProfilesByLocation(location : Text) : async [UserProfile] {
    // Public - anyone can search profiles by location
    profiles.values().toArray().sort(Profile.compareByLocation);
  };

  public query ({ caller }) func fetchAllSlots() : async [Slot] {
    // Public - anyone can view all availability slots for booking
    slots.values().toArray();
  };

  public query ({ caller }) func fetchSlotsByMusician(musicianId : UserId) : async [Slot] {
    // Public - anyone can view musician availability for booking
    slots.values().toArray().filter(
      func(slot) { slot.userId == musicianId }
    );
  };

  public query ({ caller }) func fetchAvailableSlotsByMusician(musicianId : UserId) : async [Slot] {
    // Public - anyone can view available slots for booking
    slots.values().toArray().filter(
      func(slot) { slot.userId == musicianId and slot.isAvailable }
    );
  };

  public query ({ caller }) func fetchAllGigs() : async [Gig] {
    // Public - customers can browse all events
    gigs.values().toArray();
  };

  public query ({ caller }) func fetchGigsByVenue(venueId : UserId) : async [Gig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view venue gig details");
    };
    // Only the venue themselves or admin can view their gigs
    if (caller != venueId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own venue gigs");
    };

    gigs.values().toArray().filter(
      func(gig) { gig.venueId == venueId }
    );
  };

  public query ({ caller }) func fetchGigsByMusician(musicianId : UserId) : async [Gig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view musician gig details");
    };
    // Only the musician themselves or admin can view their gigs
    if (caller != musicianId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own musician gigs");
    };

    gigs.values().toArray().filter(
      func(gig) { gig.musicianId == musicianId }
    );
  };

  // Analytics Management (Admin Only)
  public query ({ caller }) func getAnalyticsSummary() : async AnalyticsSummary {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access analytics");
    };

    let eventLogArray = eventLog.toArray();
    let size = eventLogArray.size();
    let recentEventsSize = if (size >= 10) { 10 } else { size };
    let recentEvents = eventLogArray.sliceToArray(0, recentEventsSize);

    {
      totalUniqueUsers;
      totalSessions;
      dailyActiveUsers;
      lastActiveUsers;
      recentEvents;
      analyticsTrackingEnabled;
    };
  };

  public query ({ caller }) func getUsageEvents() : async [UsageEvent] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access usage events");
    };
    eventLog.toArray();
  };

  public shared ({ caller }) func enableAnalyticsTracking() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can enable analytics tracking");
    };
    analyticsTrackingEnabled := true;
  };

  public shared ({ caller }) func disableAnalyticsTracking() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can disable analytics tracking");
    };
    analyticsTrackingEnabled := false;
  };

  public shared ({ caller }) func clearAnalyticsData() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can clear analytics data");
    };
    eventLog.clear();
    totalUniqueUsers := 0;
    totalSessions := 0;
    dailyActiveUsers := 0;
    lastActiveUsers := 0;
  };

  public shared ({ caller }) func recordUsageEvent(eventType : EventType, page : ?Text, actionCategory : ?Text, actionDetail : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can record usage events");
    };
    logEvent(caller, eventType, page, actionCategory, actionDetail);
  };

  // Public function to fetch analytics tracking status (used to conditionally emit events)
  public query ({ caller }) func isAnalyticsTrackingEnabled() : async Bool {
    analyticsTrackingEnabled;
  };
};
