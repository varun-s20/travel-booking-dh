/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): mock places
   Stands in for Duffel's place suggestions in the simulated backend.
   Real airports and cities. Overwing kept the names to characters its
   fonts cover (no Latin Extended-A); check them against Landfall's font.
   ===================================================================== */
export type Airport = { code: string; name: string; city: string; country: string };
/* lat and lng: the city centre the stay search measures from (Duffel Stays searches by coordinates);
   testOnly: shown only while Duffel runs in test mode */
export type City = { id: string; name: string; country: string; lat: number; lng: number; testOnly?: boolean };

export const AIRPORTS: Airport[] = [
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'United Kingdom' },
  { code: 'LGW', name: 'London Gatwick', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'LIS', name: 'Lisbon Humberto Delgado', city: 'Lisbon', country: 'Portugal' },
  { code: 'MAD', name: 'Madrid Barajas', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain' },
  { code: 'FCO', name: 'Rome Fiumicino', city: 'Rome', country: 'Italy' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'JFK', name: 'New York John F. Kennedy', city: 'New York', country: 'United States' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States' },
  { code: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada' },
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'United Arab Emirates' },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
  { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
  { code: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa' },
  /* round 3: content/mock-catalogue.md, New airports for the place list */
  { code: 'ATH', name: 'Athens International', city: 'Athens', country: 'Greece' },
  { code: 'CPH', name: 'Copenhagen Kastrup', city: 'Copenhagen', country: 'Denmark' },
  { code: 'KEF', name: 'Reykjavik Keflavik', city: 'Reykjavik', country: 'Iceland' },
  { code: 'CUN', name: 'Cancún International', city: 'Cancún', country: 'Mexico' },
  { code: 'GIG', name: 'Rio de Janeiro Galeão', city: 'Rio de Janeiro', country: 'Brazil' },
  { code: 'EZE', name: 'Buenos Aires Ezeiza', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'BKK', name: 'Bangkok Suvarnabhumi', city: 'Bangkok', country: 'Thailand' },
  { code: 'RAK', name: 'Marrakech Menara', city: 'Marrakech', country: 'Morocco' },
  { code: 'NBO', name: 'Nairobi Jomo Kenyatta', city: 'Nairobi', country: 'Kenya' }
];

export const CITIES: City[] = [
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', lat: 38.7107, lng: -9.1365 },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', lat: 41.3874, lng: 2.1686 },
  { id: 'rome', name: 'Rome', country: 'Italy', lat: 41.8986, lng: 12.4769 },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
  { id: 'new-york', name: 'New York', country: 'United States', lat: 40.758, lng: -73.9855 },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6812, lng: 139.7671 },
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  /* round 3: the catalogue's two new hotel cities */
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.2931, lng: 103.852 },
  { id: 'marrakech', name: 'Marrakech', country: 'Morocco', lat: 31.6258, lng: -7.9891 },
  /* Duffel's test hotels (docs, Test hotels): only offered while Duffel runs with a test token */
  { id: 'duffel-test-hotels', name: 'Duffel test hotels', country: 'Test mode', lat: -24.38, lng: -128.32, testOnly: true }
];
