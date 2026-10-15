export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      meal_sets: {
        Row: {
          id: string
          name: string
          diet_type: 'balanced' | 'light' | 'protein'
          duration: 'day' | 'week'
          price_rub: number
          description: string
          dishes: string[]
          image_gradient: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          diet_type: 'balanced' | 'light' | 'protein'
          duration: 'day' | 'week'
          price_rub: number
          description?: string
          dishes?: string[]
          image_gradient?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['meal_sets']['Insert']>
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'failed'
          delivery_date: string
          address: string
          total_rub: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'failed'
          delivery_date: string
          address: string
          total_rub: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          meal_set_id: string
          name: string
          quantity: number
          unit_price_rub: number
          line_total_rub: number
        }
        Insert: {
          id?: string
          order_id: string
          meal_set_id: string
          name: string
          quantity: number
          unit_price_rub: number
          line_total_rub: number
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
