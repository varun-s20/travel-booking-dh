/* =====================================================================
   travel-booking (working name Overwing, a placeholder): mock places
   Stands in for Duffel's place suggestions in the simulated backend.
   Real airports and cities, written in characters every Calibre and
   Geist weight covers (Calibre Regular lacks Latin Extended-A).
   ===================================================================== */
export type Airport = { code: string; name: string; city: string; country: string };
export type City = { id: string; name: string; country: string };

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
  /* round 3: the catalogue's new airports (content/mock-catalogue.md, section 1) */
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
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal' },
  { id: 'paris', name: 'Paris', country: 'France' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain' },
  { id: 'rome', name: 'Rome', country: 'Italy' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands' },
  { id: 'new-york', name: 'New York', country: 'United States' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan' },
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa' },
  { id: 'sydney', name: 'Sydney', country: 'Australia' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore' },
  { id: 'marrakech', name: 'Marrakech', country: 'Morocco' }
];
