import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database as GeneratedDatabase } from "@/integrations/supabase/types";

type ProductCostRow = {
  product_id: string;
  cost_price_pkr: number;
  updated_at: string;
};

type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

type GeneratedPublic = GeneratedDatabase["public"];
type StoreDatabase = Omit<GeneratedDatabase, "public"> & {
  public: Omit<GeneratedPublic, "Tables"> & {
    Tables: GeneratedPublic["Tables"] & {
      product_costs: Table<ProductCostRow>;
    };
  };
};

export type Database = StoreDatabase;
export const adminDb = supabase as unknown as SupabaseClient<Database>;
