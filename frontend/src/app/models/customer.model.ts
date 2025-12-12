export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  shop_id: number | null;
}

export type CustomerCreate = Omit<Customer, "id" | "shop_id">;
