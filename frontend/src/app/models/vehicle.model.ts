import type { Customer } from "./customer.model";

export interface Vehicle {
  id: number;
  plate: string;
  make: string | null;
  model: string | null;
  year: number | null;
  vin: string | null;
  shop_id: number;
  current_owner_id: number | null;
  first_seen_at: string;
  last_seen_at: string | null;
  current_owner: Customer | null;
}

export interface VehicleCreatePayload {
  plate: string;
  shop_id: number;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  vin?: string | null;
  current_owner_id?: number | null;
}
