/* =====================================================================
   Landfall server: Duffel API v2 types (the fields this app reads)
   Field names are copied from Duffel's published schemas (duffel.com/docs/
   api/v2, checked 2026-11-15). Amounts are decimal strings; local times
   ("2026-11-20T07:05:00") carry no offset and are in the airport's zone.
   ===================================================================== */

export type DuffelErrorItem = { type: string; title: string; message: string; code: string; documentation_url?: string; source?: { field?: string; pointer?: string } };

/* ---------- places and carriers ---------- */
export type DuffelPlace = {
  id: string; type: 'airport' | 'city'; name: string; iata_code: string | null;
  iata_city_code?: string | null; iata_country_code?: string | null; city_name?: string | null;
  time_zone?: string | null; latitude?: number | null; longitude?: number | null;
  city?: { id: string; name: string; iata_code: string | null; iata_country_code?: string | null } | null;
  airports?: DuffelPlace[] | null;
};
export type DuffelCarrier = {
  id: string; name: string; iata_code: string | null;
  logo_symbol_url?: string | null; logo_lockup_url?: string | null; conditions_of_carriage_url?: string | null;
};

/* ---------- offers ---------- */
export type DuffelCondition = { allowed: boolean; penalty_amount: string | null; penalty_currency: string | null } | null;
export type DuffelBaggage = { type: 'checked' | 'carry_on'; quantity: number };
export type DuffelSegmentPassenger = {
  passenger_id: string; cabin_class: string; cabin_class_marketing_name: string | null;
  fare_basis_code?: string | null; baggages: DuffelBaggage[];
};
export type DuffelSegment = {
  id: string; departing_at: string; arriving_at: string;
  origin: DuffelPlace; destination: DuffelPlace;
  origin_terminal: string | null; destination_terminal: string | null;
  operating_carrier: DuffelCarrier; marketing_carrier: DuffelCarrier;
  operating_carrier_flight_number: string | null; marketing_carrier_flight_number: string;
  aircraft: { id: string; iata_code: string | null; name: string } | null;
  duration: string | null; distance?: string | null;
  stops?: { id: string; airport: DuffelPlace; departing_at: string; arriving_at: string; duration: string }[];
  passengers: DuffelSegmentPassenger[];
};
export type DuffelSlice = {
  id: string; origin: DuffelPlace; destination: DuffelPlace; duration: string | null;
  fare_brand_name: string | null; segments: DuffelSegment[];
  conditions?: { change_before_departure?: DuffelCondition; advance_seat_selection?: boolean | null; priority_boarding?: boolean | null; priority_check_in?: boolean | null } | null;
};
export type DuffelOfferPassenger = { id: string; type: 'adult' | 'child' | 'infant_without_seat' | null; age: number | null };
export type DuffelOffer = {
  id: string; live_mode: boolean; created_at: string; expires_at: string;
  total_amount: string; total_currency: string; base_amount: string; base_currency: string;
  tax_amount: string | null; tax_currency: string | null;
  owner: DuffelCarrier; slices: DuffelSlice[]; passengers: DuffelOfferPassenger[];
  conditions: { change_before_departure: DuffelCondition; refund_before_departure: DuffelCondition };
  passenger_identity_documents_required: boolean;
  supported_passenger_identity_document_types?: string[];
  payment_requirements: { requires_instant_payment: boolean; price_guarantee_expires_at: string | null; payment_required_by: string | null };
  total_emissions_kg?: string | null;
};
export type DuffelOfferRequest = { id: string; live_mode: boolean; created_at: string; passengers: DuffelOfferPassenger[]; offers: DuffelOffer[] };

/* ---------- orders ---------- */
export type DuffelOrderPassengerInput = {
  id: string; title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr'; given_name: string; family_name: string;
  gender: 'm' | 'f'; born_on: string; email: string; phone_number: string;
  identity_documents?: { type: 'passport'; unique_identifier: string; issuing_country_code: string; expires_on: string }[];
  infant_passenger_id?: string;
};
export type DuffelOrder = {
  id: string; live_mode: boolean; created_at: string; offer_id?: string;
  booking_reference: string; booking_references?: { booking_reference: string; carrier: DuffelCarrier }[];
  documents: { type: string; unique_identifier: string; passenger_ids: string[] }[];
  passengers: { id: string; given_name: string; family_name: string; type?: string }[];
  total_amount: string; total_currency: string;
  cancelled_at: string | null;
  payment_status?: { awaiting_payment: boolean; paid_at: string | null };
  available_actions?: string[];
  metadata?: Record<string, string> | null;
};

/* ---------- stays ---------- */
export type DuffelAccommodation = {
  id: string; name: string; description: string | null; type?: string | null;
  photos: { url: string }[] | null;
  rating: number | null; review_score: number | null; review_count?: number | null;
  location: {
    address: { line_one: string | null; city_name: string | null; region: string | null; postal_code: string | null; country_code: string | null };
    geographic_coordinates: { latitude: number; longitude: number } | null;
  };
  amenities: { type: string; description: string }[] | null;
  check_in_information: { check_in_after_time: string | null; check_in_before_time: string | null; check_out_before_time: string | null } | null;
  key_collection?: { instructions: string } | null;
  email?: string | null; phone_number?: string | null;
  rooms: DuffelRoom[];
};
export type DuffelRoom = {
  name: string;
  beds: { type: 'single' | 'double' | 'queen' | 'king' | 'sofabed' | 'bunk'; count: number }[] | null;
  photos: { url: string }[] | null;
  rates: DuffelRate[];
};
export type DuffelRate = {
  id: string; name?: string | null; description?: string | null; expires_at?: string | null;
  total_amount: string; total_currency: string;
  base_amount: string | null; tax_amount: string | null; fee_amount: string | null;
  due_at_accommodation_amount: string | null; due_at_accommodation_currency: string | null;
  board_type: 'room_only' | 'breakfast' | 'half_board' | 'full_board' | 'all_inclusive' | null;
  payment_type: 'pay_now' | 'guarantee' | 'deposit';
  available_payment_methods: ('balance' | 'card')[];
  cancellation_timeline: { before: string; refund_amount: string; currency: string }[];
  conditions: { title: string; description: string }[] | null;
  quantity_available: number | null;
};
export type DuffelStaySearchResult = {
  id: string; expires_at?: string | null; check_in_date: string; check_out_date: string; rooms: number;
  accommodation: DuffelAccommodation;
  cheapest_rate_total_amount: string; cheapest_rate_currency: string;
};
export type DuffelQuote = {
  id: string; total_amount: string; total_currency: string;
  tax_amount: string | null; fee_amount: string | null;
  due_at_accommodation_amount: string | null; due_at_accommodation_currency: string | null;
  accommodation: DuffelAccommodation; check_in_date: string; check_out_date: string;
};
export type DuffelStayBooking = {
  id: string; live_mode?: boolean; reference: string | null; status: 'confirmed' | 'cancelled';
  confirmed_at: string | null; cancelled_at: string | null;
  accommodation: DuffelAccommodation; metadata?: Record<string, string> | null;
};
export type DuffelReview = { text: string; score: number; reviewer_name: string; created_at: string };
