export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  stella: {
    Tables: {
      employees: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          allowed_cities: string[] | null
          allowed_states: string[] | null
          bank_account: string | null
          bank_branch: string | null
          bank_name: string | null
          bio_en: string | null
          bio_es: string | null
          bio_pt: string | null
          city: string | null
          commission_plan_id: string | null
          country_code: string | null
          cpf: string | null
          created_at: string | null
          created_by: string | null
          creci_number: string | null
          creci_state: string | null
          creci_valid_until: string | null
          department: string | null
          dob: string | null
          documents: Json | null
          email: string
          employment_type: string | null
          end_date: string | null
          full_name: string
          headshot_url: string | null
          hire_date: string | null
          id: string
          languages: string[] | null
          listing_scope: string | null
          manager_id: string | null
          notes_internal: string | null
          phone_alt: string | null
          phone_mobile: string | null
          pix_key_type: string | null
          pix_key_value: string | null
          position_title: string | null
          postal_code: string | null
          preferred_locale: string | null
          public_page_visible: boolean | null
          rg: string | null
          social_name: string | null
          state_code: string | null
          status: string | null
          tax_residency_country: string | null
          teams: string[] | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
          whatsapp: boolean | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          allowed_cities?: string[] | null
          allowed_states?: string[] | null
          bank_account?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          bio_en?: string | null
          bio_es?: string | null
          bio_pt?: string | null
          city?: string | null
          commission_plan_id?: string | null
          country_code?: string | null
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          creci_number?: string | null
          creci_state?: string | null
          creci_valid_until?: string | null
          department?: string | null
          dob?: string | null
          documents?: Json | null
          email: string
          employment_type?: string | null
          end_date?: string | null
          full_name: string
          headshot_url?: string | null
          hire_date?: string | null
          id?: string
          languages?: string[] | null
          listing_scope?: string | null
          manager_id?: string | null
          notes_internal?: string | null
          phone_alt?: string | null
          phone_mobile?: string | null
          pix_key_type?: string | null
          pix_key_value?: string | null
          position_title?: string | null
          postal_code?: string | null
          preferred_locale?: string | null
          public_page_visible?: boolean | null
          rg?: string | null
          social_name?: string | null
          state_code?: string | null
          status?: string | null
          tax_residency_country?: string | null
          teams?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
          whatsapp?: boolean | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          allowed_cities?: string[] | null
          allowed_states?: string[] | null
          bank_account?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          bio_en?: string | null
          bio_es?: string | null
          bio_pt?: string | null
          city?: string | null
          commission_plan_id?: string | null
          country_code?: string | null
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          creci_number?: string | null
          creci_state?: string | null
          creci_valid_until?: string | null
          department?: string | null
          dob?: string | null
          documents?: Json | null
          email?: string
          employment_type?: string | null
          end_date?: string | null
          full_name?: string
          headshot_url?: string | null
          hire_date?: string | null
          id?: string
          languages?: string[] | null
          listing_scope?: string | null
          manager_id?: string | null
          notes_internal?: string | null
          phone_alt?: string | null
          phone_mobile?: string | null
          pix_key_type?: string | null
          pix_key_value?: string | null
          position_title?: string | null
          postal_code?: string | null
          preferred_locale?: string | null
          public_page_visible?: boolean | null
          rg?: string | null
          social_name?: string | null
          state_code?: string | null
          status?: string | null
          tax_residency_country?: string | null
          teams?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
          whatsapp?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          description: string | null
          id: string
          key: string
          requires_approval: boolean | null
          scope_aware: boolean | null
          sensitive: boolean | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          requires_approval?: boolean | null
          scope_aware?: boolean | null
          sensitive?: boolean | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          requires_approval?: boolean | null
          scope_aware?: boolean | null
          sensitive?: boolean | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: string
          key: string
          name: string
          system: boolean | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          name: string
          system?: boolean | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          name?: string
          system?: boolean | null
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          allowed: boolean
          permission_id: string
          user_id: string
        }
        Insert: {
          allowed?: boolean
          permission_id: string
          user_id: string
        }
        Update: {
          allowed?: boolean
          permission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scopes: {
        Row: {
          cities: string[] | null
          scope_leads: string | null
          scope_listings: string | null
          user_id: string
        }
        Insert: {
          cities?: string[] | null
          scope_leads?: string | null
          scope_listings?: string | null
          user_id: string
        }
        Update: {
          cities?: string[] | null
          scope_leads?: string | null
          scope_listings?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  stella: {
    Enums: {},
  },
} as const
