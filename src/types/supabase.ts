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
      tables: {
        Row: {
          id: string
          name: string
          qr_code: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          qr_code: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          qr_code?: string
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}
