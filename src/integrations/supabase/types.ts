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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      communities: {
        Row: {
          courses_count: number | null
          cover_url: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          features: string[] | null
          id: string
          is_public: boolean | null
          logo_url: string | null
          name: string
          primary_color: string | null
          slug: string
          subscription_interval:
            | Database["public"]["Enums"]["subscription_interval"]
            | null
          subscription_price: number | null
          theme: Database["public"]["Enums"]["community_theme"] | null
          total_members: number | null
          updated_at: string | null
        }
        Insert: {
          courses_count?: number | null
          cover_url?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          features?: string[] | null
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          name: string
          primary_color?: string | null
          slug: string
          subscription_interval?:
            | Database["public"]["Enums"]["subscription_interval"]
            | null
          subscription_price?: number | null
          theme?: Database["public"]["Enums"]["community_theme"] | null
          total_members?: number | null
          updated_at?: string | null
        }
        Update: {
          courses_count?: number | null
          cover_url?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          features?: string[] | null
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          slug?: string
          subscription_interval?:
            | Database["public"]["Enums"]["subscription_interval"]
            | null
          subscription_price?: number | null
          theme?: Database["public"]["Enums"]["community_theme"] | null
          total_members?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          is_moderator: boolean | null
          joined_at: string | null
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          is_moderator?: boolean | null
          joined_at?: string | null
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          is_moderator?: boolean | null
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          community_id: string
          created_at: string | null
          creator_id: string
          description: string | null
          duration_minutes: number | null
          enrollment_count: number | null
          id: string
          is_published: boolean | null
          lesson_count: number | null
          price: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          community_id: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          duration_minutes?: number | null
          enrollment_count?: number | null
          id?: string
          is_published?: boolean | null
          lesson_count?: number | null
          price?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          community_id?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          duration_minutes?: number | null
          enrollment_count?: number | null
          id?: string
          is_published?: boolean | null
          lesson_count?: number | null
          price?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          comment_count: number | null
          community_id: string
          content: string | null
          created_at: string | null
          id: string
          is_pinned: boolean | null
          like_count: number | null
          media_url: string | null
          title: string | null
          type: Database["public"]["Enums"]["post_type"] | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          comment_count?: number | null
          community_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          media_url?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["post_type"] | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          comment_count?: number | null
          community_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          media_url?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["post_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
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
      community_theme: "light" | "dark" | "custom"
      post_type: "text" | "video" | "image" | "poll" | "quiz"
      subscription_interval: "monthly" | "yearly"
      user_role: "creator" | "member" | "admin"
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
    Enums: {
      community_theme: ["light", "dark", "custom"],
      post_type: ["text", "video", "image", "poll", "quiz"],
      subscription_interval: ["monthly", "yearly"],
      user_role: ["creator", "member", "admin"],
    },
  },
} as const
