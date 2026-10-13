export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type OperationsTable<Row> = {
  Row: Row
  Insert: Partial<Row>
  Update: Partial<Row>
  Relationships: []
}

type CustomerRow = {
  id: string; full_name: string; phone: string | null; email: string | null;
  city: string | null; address: string | null; notes: string | null;
  created_at: string; updated_at: string
}
type EnquiryRow = {
  id: string; customer_id: string | null; customer_name: string; phone: string | null;
  email: string | null; channel: string; status: string; subject: string | null;
  message: string | null; product_id: string | null; follow_up_at: string | null;
  notes: string | null; created_at: string; updated_at: string
}
type OrderRow = {
  id: string; order_number: string; customer_id: string | null; customer_name: string;
  phone: string | null; email: string | null; status: string; payment_status: string;
  payment_method: string; subtotal_pkr: number; shipping_fee_pkr: number;
  discount_pkr: number; total_pkr: number; paid_amount_pkr: number;
  shipping_address: string | null; city: string | null; tracking_number: string | null;
  source: string; notes: string | null; created_at: string; updated_at: string
}
type OrderItemRow = {
  id: string; order_id: string; product_id: string | null; product_title: string;
  sku: string | null; quantity: number; unit_price_pkr: number; unit_cost_pkr: number | null; line_total_pkr: number;
  created_at: string
}
type InventoryMovementRow = {
  id: string; product_id: string; movement_type: string; quantity_delta: number;
  reason: string; order_id: string | null; created_at: string
}

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          product_id: string
          sort_order: number
          storage_path: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          product_id: string
          sort_order?: number
          storage_path?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          product_id?: string
          sort_order?: number
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available_metals: string[]
          carat: string | null
          category: string
          cost_price_pkr: number | null
          clarity: string | null
          created_at: string
          cut: string | null
          description: string | null
          dimensions: string | null
          hallmark_badge: string | null
          id: string
          in_stock: boolean
          is_featured: boolean
          is_published: boolean
          metal: string | null
          origin: string | null
          price_pkr: number | null
          pricing_mode: string
          primary_image_url: string | null
          published_at: string | null
          short_desc: string | null
          sku: string | null
          slug: string
          stock_quantity: number
          tag: string | null
          title: string
          updated_at: string
        }
        Insert: {
          available_metals?: string[]
          carat?: string | null
          category: string
          cost_price_pkr?: number | null
          clarity?: string | null
          created_at?: string
          cut?: string | null
          description?: string | null
          dimensions?: string | null
          hallmark_badge?: string | null
          id?: string
          in_stock?: boolean
          is_featured?: boolean
          is_published?: boolean
          metal?: string | null
          origin?: string | null
          price_pkr?: number | null
          pricing_mode?: string
          primary_image_url?: string | null
          published_at?: string | null
          short_desc?: string | null
          sku?: string | null
          slug: string
          stock_quantity?: number
          tag?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          available_metals?: string[]
          carat?: string | null
          category?: string
          cost_price_pkr?: number | null
          clarity?: string | null
          created_at?: string
          cut?: string | null
          description?: string | null
          dimensions?: string | null
          hallmark_badge?: string | null
          id?: string
          in_stock?: boolean
          is_featured?: boolean
          is_published?: boolean
          metal?: string | null
          origin?: string | null
          price_pkr?: number | null
          pricing_mode?: string
          primary_image_url?: string | null
          published_at?: string | null
          short_desc?: string | null
          sku?: string | null
          slug?: string
          stock_quantity?: number
          tag?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      novalestic_has_admin_access: { Args: never; Returns: boolean }\n      novalestic_update_order_status: { Args: { p_order_id: string; p_status: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
