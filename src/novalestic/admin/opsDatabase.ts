import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database as GeneratedDatabase } from '@/integrations/supabase/types';

/**
 * Type-only extension describing the tables from
 * supabase/migrations/202610140001_novalestic_operations.sql, which is not yet
 * applied to the database (so the generated types do not include them).
 * Runtime behaviour is identical to the generated client; remove this file once
 * the migration is applied and types are regenerated.
 */
type Tbl<Row> = { Row: Row; Insert: Partial<Row>; Update: Partial<Row>; Relationships: [] };
type Ts = string;
type N = number;

type CustomerRow = { id: string; full_name: string; phone: string | null; email: string | null; city: string | null; address: string | null; notes: string | null; created_at: Ts; updated_at: Ts };
type ProductCostRow = { product_id: string; cost_price_pkr: N; updated_at: Ts };
type EnquiryRow = { id: string; customer_id: string | null; customer_name: string; phone: string | null; email: string | null; channel: string; status: string; subject: string | null; message: string | null; product_id: string | null; follow_up_at: Ts | null; notes: string | null; created_at: Ts; updated_at: Ts };
type OrderRow = { id: string; order_number: string; customer_id: string | null; customer_name: string; phone: string | null; email: string | null; status: string; payment_status: string; payment_method: string; subtotal_pkr: N; shipping_fee_pkr: N; discount_pkr: N; total_pkr: N; paid_amount_pkr: N; shipping_address: string | null; city: string | null; tracking_number: string | null; source: string; notes: string | null; created_at: Ts; updated_at: Ts };
type OrderItemRow = { id: string; order_id: string; product_id: string | null; product_title: string; sku: string | null; quantity: N; unit_price_pkr: N; unit_cost_pkr: N | null; line_total_pkr: N; created_at: Ts };
type MovementRow = { id: string; product_id: string; movement_type: string; quantity_delta: N; reason: string; order_id: string | null; created_at: Ts };

type G = GeneratedDatabase['public'];

export type Database = Omit<GeneratedDatabase, 'public'> & {
  public: Omit<G, 'Tables' | 'Functions'> & {
    Tables: G['Tables'] & {
      customers: Tbl<CustomerRow>;
      product_costs: Tbl<ProductCostRow>;
      enquiries: Tbl<EnquiryRow>;
      orders: Tbl<OrderRow>;
      order_items: Tbl<OrderItemRow>;
      inventory_movements: Tbl<MovementRow>;
    };
    Functions: G['Functions'] & {
      novalestic_update_order_status: { Args: { p_order_id: string; p_status: string }; Returns: undefined };
    };
  };
};

export const adminDb = supabase as unknown as SupabaseClient<Database>;
