/* =====================================================================
   Landfall server: which supplier answers
   Duffel when DUFFEL_ACCESS_TOKEN is set (test or live token), the
   simulated catalogue otherwise (SUPPLY_MODE can force either). A
   booking always goes back to the supplier that priced it: bookings and
   cached searches record their supplier, and supplierFor() follows it.
   ===================================================================== */
import 'server-only';
import { supplyMode } from '@/server/env';
import { duffelFlights, duffelStays } from './duffel';
import { simulatedFlights, simulatedStays } from './simulated';
import type { FlightSupplier, StaySupplier, SupplierName } from './types';

export const flightSupplier = (name: SupplierName = supplyMode()): FlightSupplier => (name === 'duffel' ? duffelFlights : simulatedFlights);
export const staySupplier = (name: SupplierName = supplyMode()): StaySupplier => (name === 'duffel' ? duffelStays : simulatedStays);
export type { SupplierName } from './types';
