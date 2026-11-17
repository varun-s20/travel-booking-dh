/* =====================================================================
   Landfall server: database types
   Hand-kept to match supabase/migrations (the source of truth). When a
   migration changes a table, change it here too; `npm run typecheck`
   then shows every query that needs to follow.
   ===================================================================== */
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AppRole = 'customer' | 'admin';
export type BookingKind = 'flight' | 'stay';
export type BookingStatus = 'pending_payment' | 'processing' | 'confirmed' | 'failed' | 'cancelled' | 'expired';
export type PaymentStatus = 'requires_payment' | 'authorized' | 'captured' | 'cancelled' | 'failed' | 'refunded' | 'partially_refunded';
export type PassengerType = 'adult' | 'child' | 'infant';
export type Supplier = 'duffel' | 'simulated';

type Table<Row, Required extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};

export type ProfileRow = { id: string; first_name: string; last_name: string; phone: string; role: AppRole; created_at: string; updated_at: string };
export type SavedTravelerRow = {
  id: string; user_id: string; title: string; given_name: string; family_name: string; born_on: string;
  gender: 'm' | 'f'; passenger_type: PassengerType; created_at: string; updated_at: string;
};
export type BookingRow = {
  id: string; reference: string; user_id: string | null; kind: BookingKind; status: BookingStatus;
  supplier: Supplier; live_mode: boolean; offer_id: string | null; offer_request_id: string | null;
  rate_id: string | null; quote_id: string | null; supplier_order_id: string | null; supplier_reference: string | null;
  checkout_key: string; contact_email: string; contact_phone: string | null;
  currency: string; total_amount: number; tax_amount: number | null; supplier_amount: number; supplier_currency: string;
  summary: Json; travelers: Json; sensitive_enc: string | null; guest_token_hash: string | null;
  failure_code: string | null; expires_at: string | null; needs_review: boolean; supplier_pending: boolean;
  fulfilment_attempts: number; fulfilment_started_at: string | null;
  confirmed_at: string | null; cancelled_at: string | null; created_at: string; updated_at: string;
};
export type PaymentRow = {
  id: string; booking_id: string; provider: 'stripe'; intent_id: string; status: PaymentStatus;
  amount: number; currency: string; amount_refunded: number; card_brand: string | null; card_last4: string | null;
  failure_code: string | null; decline_code: string | null; authorized_at: string | null; captured_at: string | null;
  cancelled_at: string | null; created_at: string; updated_at: string;
};
export type TravelDocumentRow = { id: string; booking_id: string; type: string; unique_identifier: string; passenger_name: string | null; created_at: string };
export type BookingEventRow = { id: number; booking_id: string; type: string; detail: Json; created_at: string };
export type FlightSearchRow = { id: string; supplier: Supplier; params: Json; passengers: Json; payload: Json; created_at: string; expires_at: string; params_key: string };
export type FlightSearchOfferRow = { offer_id: string; search_id: string; itinerary_index: number; fare_index: number };
export type StayRateRow = { rate_id: string; supplier: Supplier; accommodation_id: string; search_result_id: string | null; params: Json; payload: Json; created_at: string; expires_at: string };
export type WebhookEventRow = { provider: 'stripe' | 'duffel'; event_id: string; type: string; payload: Json; received_at: string; processed_at: string | null; error: string | null };
export type EmailLogRow = {
  id: string; booking_id: string | null; template: string; to_email: string; subject: string;
  status: 'pending' | 'sent' | 'failed' | 'logged'; attempts: number; last_error: string | null; message_id: string | null;
  dedupe_key: string | null; payload: Json; created_at: string; sent_at: string | null;
};
export type ContactMessageRow = {
  id: string; user_id: string | null; name: string; email: string; topic: string | null; booking_reference: string | null;
  message: string; ip_hash: string | null; created_at: string;
};
export type RateLimitRow = { key: string; window_start: string; hits: number };

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, 'id'>;
      saved_travelers: Table<SavedTravelerRow, 'user_id' | 'title' | 'given_name' | 'family_name' | 'born_on' | 'gender'>;
      bookings: Table<BookingRow, 'reference' | 'kind' | 'supplier' | 'checkout_key' | 'contact_email' | 'currency' | 'total_amount' | 'supplier_amount' | 'supplier_currency' | 'summary'>;
      payments: Table<PaymentRow, 'booking_id' | 'intent_id' | 'amount' | 'currency'>;
      travel_documents: Table<TravelDocumentRow, 'booking_id' | 'type' | 'unique_identifier'>;
      booking_events: Table<BookingEventRow, 'booking_id' | 'type'>;
      flight_searches: Table<FlightSearchRow, 'id' | 'supplier' | 'params' | 'passengers' | 'payload' | 'expires_at' | 'params_key'>;
      flight_search_offers: Table<FlightSearchOfferRow, 'offer_id' | 'search_id' | 'itinerary_index' | 'fare_index'>;
      stay_rates: Table<StayRateRow, 'rate_id' | 'supplier' | 'accommodation_id' | 'params' | 'payload' | 'expires_at'>;
      webhook_events: Table<WebhookEventRow, 'provider' | 'event_id' | 'type' | 'payload'>;
      email_log: Table<EmailLogRow, 'template' | 'to_email' | 'subject'>;
      contact_messages: Table<ContactMessageRow, 'name' | 'email' | 'message'>;
      rate_limits: Table<RateLimitRow, 'key' | 'window_start' | 'hits'>;
    };
    Views: { [_ in never]: never };
    Functions: {
      rate_limit_hit: { Args: { p_key: string; p_window_seconds: number; p_max: number }; Returns: { allowed: boolean; remaining: number; reset_at: string }[] };
      claim_booking_for_fulfilment: { Args: { p_booking: string; p_stale_seconds?: number }; Returns: BookingRow[] };
      claim_guest_bookings: { Args: { p_user: string; p_email: string }; Returns: number };
      purge_expired: { Args: Record<string, never>; Returns: number };
      payments_to_settle: { Args: { p_limit?: number }; Returns: { intent_id: string; booking_id: string; booking_status: BookingStatus; confirmed_at: string | null }[] };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      app_role: AppRole; booking_kind: BookingKind; booking_status: BookingStatus;
      payment_status: PaymentStatus; passenger_type: PassengerType;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
