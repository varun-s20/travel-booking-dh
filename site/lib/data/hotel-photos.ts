/* =====================================================================
   travel-booking (working name Overwing, a placeholder): hotel photo pool
   This design's own Unsplash License hotel photos (public/images/credits.md),
   standing in for Duffel's hotel media. The eight original hotels keep
   their own sets; every other catalogue hotel draws from this pool, with
   a lead photo no other hotel in its city leads with (lib/mock/hotels.ts),
   so no two neighbouring results repeat a photo. Captions are generic
   because a pool photo can stand for more than one hotel.
   ===================================================================== */
import type { PhotoCat } from '@/lib/mock/hotels';

/* `city`: a photo of an original hotel shows its city (azulejos, a Tokyo river), so it stays with that city's hotels */
export type PoolPhoto = { name: string; cat: PhotoCat; caption: string; city?: string };

export const HOTEL_PHOTO_POOL: PoolPhoto[] = [
  { name: 'casa-lanterna-courtyard', cat: 'Inside', caption: 'a tiled courtyard', city: 'lisbon' },
  { name: 'casa-lanterna-courtyard-double', cat: 'Rooms', caption: 'a double room', city: 'lisbon' },
  { name: 'casa-lanterna-terrace', cat: 'Outside', caption: 'a roof terrace', city: 'lisbon' },
  { name: 'casa-lanterna-lounge', cat: 'Inside', caption: 'a lounge', city: 'lisbon' },
  { name: 'casa-lanterna-river-double', cat: 'Rooms', caption: 'a room with a view', city: 'lisbon' },
  { name: 'casa-lanterna-lane', cat: 'Outside', caption: 'the street outside', city: 'lisbon' },
  { name: 'casa-lanterna-terrace-suite', cat: 'Rooms', caption: 'a suite', city: 'lisbon' },
  { name: 'casa-lanterna-breakfast', cat: 'Inside', caption: 'breakfast', city: 'lisbon' },
  { name: 'casa-lanterna-stairs', cat: 'Inside', caption: 'a hallway', city: 'lisbon' },
  { name: 'casa-lanterna-bathroom', cat: 'Rooms', caption: 'a bathroom', city: 'lisbon' },
  { name: 'cais-verde-exterior', cat: 'Outside', caption: 'the building', city: 'lisbon' },
  { name: 'cais-verde-room', cat: 'Rooms', caption: 'a double room', city: 'lisbon' },
  { name: 'cais-verde-bar', cat: 'Inside', caption: 'the bar', city: 'lisbon' },
  { name: 'patio-quinze-courtyard', cat: 'Outside', caption: 'a garden courtyard', city: 'lisbon' },
  { name: 'patio-quinze-room', cat: 'Rooms', caption: 'a garden room', city: 'lisbon' },
  { name: 'patio-quinze-detail', cat: 'Inside', caption: 'a reading corner', city: 'lisbon' },
  { name: 'ladeira-room', cat: 'Rooms', caption: 'a bright room', city: 'lisbon' },
  { name: 'ladeira-lounge', cat: 'Inside', caption: 'a shared lounge', city: 'lisbon' },
  { name: 'ladeira-kitchen', cat: 'Inside', caption: 'a kitchen', city: 'lisbon' },
  { name: 'ribeira-loft', cat: 'Rooms', caption: 'a studio', city: 'lisbon' },
  { name: 'ribeira-living', cat: 'Inside', caption: 'a living area', city: 'lisbon' },
  { name: 'ribeira-kitchen', cat: 'Rooms', caption: 'a kitchen', city: 'lisbon' },
  { name: 'albergo-street', cat: 'Outside', caption: 'the street outside', city: 'rome' },
  { name: 'albergo-room', cat: 'Rooms', caption: 'a classic room', city: 'rome' },
  { name: 'albergo-breakfast', cat: 'Inside', caption: 'breakfast', city: 'rome' },
  { name: 'kumo-room', cat: 'Rooms', caption: 'a compact room', city: 'tokyo' },
  { name: 'kumo-bath', cat: 'Inside', caption: 'a bath', city: 'tokyo' },
  { name: 'kumo-river', cat: 'Outside', caption: 'the river nearby', city: 'tokyo' },
  { name: 'halyard-room', cat: 'Rooms', caption: 'a loft room', city: 'new-york' },
  { name: 'halyard-rooftop', cat: 'Outside', caption: 'a rooftop', city: 'new-york' },
  { name: 'halyard-lobby', cat: 'Inside', caption: 'the lobby', city: 'new-york' },
  /* round 3: 26 more for the 96-hotel catalogue (credits.md, "round 3 hotel pool") */
  { name: 'hotel-pool-twin-room-1', cat: 'Rooms', caption: 'a twin room' },
  { name: 'hotel-pool-twin-room-2', cat: 'Rooms', caption: 'a twin room' },
  { name: 'hotel-pool-twin-room-3', cat: 'Rooms', caption: 'a twin room' },
  { name: 'hotel-pool-garden-suite-1', cat: 'Rooms', caption: 'a suite on the garden' },
  { name: 'hotel-pool-king-room-1', cat: 'Rooms', caption: 'a king room' },
  { name: 'hotel-pool-city-room-1', cat: 'Rooms', caption: 'a room with a city view' },
  { name: 'hotel-pool-king-room-2', cat: 'Rooms', caption: 'a king room' },
  { name: 'hotel-pool-guesthouse-room-1', cat: 'Rooms', caption: 'a double room' },
  { name: 'hotel-pool-studio-1', cat: 'Rooms', caption: 'a studio with a kitchenette' },
  { name: 'hotel-pool-shower-1', cat: 'Rooms', caption: 'a shower' },
  { name: 'hotel-pool-bathroom-1', cat: 'Rooms', caption: 'a bathroom' },
  { name: 'hotel-pool-bathroom-2', cat: 'Rooms', caption: 'a bathroom' },
  { name: 'hotel-pool-pool-1', cat: 'Outside', caption: 'an outdoor pool' },
  { name: 'hotel-pool-pool-2', cat: 'Outside', caption: 'a resort pool' },
  { name: 'hotel-pool-pool-3', cat: 'Outside', caption: 'a pool deck' },
  { name: 'hotel-pool-balcony-1', cat: 'Outside', caption: 'a balcony' },
  { name: 'hotel-pool-balcony-2', cat: 'Outside', caption: 'a balcony' },
  { name: 'hotel-pool-facade-1', cat: 'Outside', caption: 'the building' },
  { name: 'hotel-pool-facade-2', cat: 'Outside', caption: 'the building' },
  { name: 'hotel-pool-apartment-1', cat: 'Inside', caption: 'an apartment living room' },
  { name: 'hotel-pool-apartment-2', cat: 'Inside', caption: 'an apartment with a kitchen' },
  { name: 'hotel-pool-lobby-1', cat: 'Inside', caption: 'the reception' },
  { name: 'hotel-pool-lobby-2', cat: 'Inside', caption: 'the lobby' },
  { name: 'hotel-pool-breakfast-1', cat: 'Inside', caption: 'breakfast' },
  { name: 'hotel-pool-restaurant-1', cat: 'Inside', caption: 'the restaurant' },
  { name: 'hotel-pool-breakfast-2', cat: 'Inside', caption: 'a breakfast buffet' }
];
