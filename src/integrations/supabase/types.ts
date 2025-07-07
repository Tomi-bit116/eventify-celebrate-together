export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      collaborators: {
        Row: {
          collaborator_email: string
          collaborator_name: string
          created_at: string
          event_id: string | null
          id: string
          invited_by: string
          role: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          collaborator_email: string
          collaborator_name: string
          created_at?: string
          event_id?: string | null
          id?: string
          invited_by: string
          role?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          collaborator_email?: string
          collaborator_name?: string
          created_at?: string
          event_id?: string | null
          id?: string
          invited_by?: string
          role?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborators_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          budget: number | null
          created_at: string
          description: string | null
          event_date: string
          event_time: string | null
          expected_guests: number | null
          id: string
          name: string
          status: string | null
          updated_at: string
          user_id: string
          venue: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          event_date: string
          event_time?: string | null
          expected_guests?: number | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          expected_guests?: number | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          email: string | null
          event_id: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          event_id: string
          expires_at: string | null
          id: string
          invitation_code: string
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          expires_at?: string | null
          id?: string
          invitation_code: string
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          expires_at?: string | null
          id?: string
          invitation_code?: string
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          created_at: string
          event_id: string
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          invitation_id: string
          responded_at: string
          rsvp_status: string
        }
        Insert: {
          created_at?: string
          event_id: string
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          invitation_id: string
          responded_at?: string
          rsvp_status: string
        }
        Update: {
          created_at?: string
          event_id?: string
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          invitation_id?: string
          responded_at?: string
          rsvp_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          event_id: string | null
          id: string
          priority: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          amount: number | null
          contact_email: string | null
          contact_phone: string
          created_at: string
          event_id: string | null
          id: string
          name: string
          notes: string | null
          payment_status: string | null
          service_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          contact_email?: string | null
          contact_phone: string
          created_at?: string
          event_id?: string | null
          id?: string
          name: string
          notes?: string | null
          payment_status?: string | null
          service_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          contact_email?: string | null
          contact_phone?: string
          created_at?: string
          event_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          payment_status?: string | null
          service_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          event_id: string | null
          id: string
          message_content: string
          recipient_name: string | null
          recipient_phone: string
          sent_at: string
          user_id: string
        }
        Insert: {
          event_id?: string | null
          id?: string
          message_content: string
          recipient_name?: string | null
          recipient_phone: string
          sent_at?: string
          user_id: string
        }
        Update: {
          event_id?: string | null
          id?: string
          message_content?: string
          recipient_name?: string | null
          recipient_phone?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_event: {
        Args: { event_id_param: string; user_id_param: string }
        Returns: boolean
      }
      generate_invitation_link: {
        Args: { event_id_param: string; user_id_param: string }
        Returns: string
      }
      get_event_tasks: {
        Args: { event_id_param: string; user_id_param: string }
        Returns: {
          id: string
          title: string
          description: string
          due_date: string
          completed: boolean
          priority: string
          created_at: string
        }[]
      }
      get_rsvp_stats: {
        Args: { event_id_param: string; user_id_param: string }
        Returns: {
          total_rsvps: number
          yes_count: number
          no_count: number
          maybe_count: number
        }[]
      }
      get_user_events: {
        Args: { user_id_param: string }
        Returns: {
          id: string
          name: string
          description: string
          event_date: string
          event_time: string
          venue: string
          expected_guests: number
          budget: number
          status: string
          created_at: string
        }[]
      }
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
  public: {
    Enums: {},
  },
} as const
