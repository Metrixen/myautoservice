export type UserRole = "shop_owner" | "mechanic" | "customer";

export interface User {
  id: number;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: UserRole;
  shop_id: number | null;
}
