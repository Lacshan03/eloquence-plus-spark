
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
      analyses_eloquence: {
        Row: {
          created_at: string
          enregistrement_id: string
          feedback: string | null
          id: string
          score_fluidite: number | null
          score_grammaire: number | null
          score_rythme: number | null
          score_vocabulaire: number | null
          substitutions: Json | null
        }
        Insert: {
          created_at?: string
          enregistrement_id: string
          feedback?: string | null
          id?: string
          score_fluidite?: number | null
          score_grammaire?: number | null
          score_rythme?: number | null
          score_vocabulaire?: number | null
          substitutions?: Json | null
        }
        Update: {
          created_at?: string
          enregistrement_id?: string
          feedback?: string | null
          id?: string
          score_fluidite?: number | null
          score_grammaire?: number | null
          score_rythme?: number | null
          score_vocabulaire?: number | null
          substitutions?: Json | null
        }
      }
      enregistrements: {
        Row: {
          chemin_audio: string
          created_at: string
          date: string
          duree: number
          id: string
          score_eloquence: number | null
          transcript: string | null
          user_id: string
        }
        Insert: {
          chemin_audio: string
          created_at?: string
          date?: string
          duree: number
          id?: string
          score_eloquence?: number | null
          transcript?: string | null
          user_id: string
        }
        Update: {
          chemin_audio?: string
          created_at?: string
          date?: string
          duree?: number
          id?: string
          score_eloquence?: number | null
          transcript?: string | null
          user_id?: string
        }
      }
      mots_ameliores: {
        Row: {
          categorie: string
          created_at: string
          exemple_utilisation: string | null
          id: string
          mot_ameliore: string
          mot_original: string
          niveau: string | null
        }
        Insert: {
          categorie: string
          created_at?: string
          exemple_utilisation?: string | null
          id?: string
          mot_ameliore: string
          mot_original: string
          niveau?: string | null
        }
        Update: {
          categorie?: string
          created_at?: string
          exemple_utilisation?: string | null
          id?: string
          mot_ameliore?: string
          mot_original?: string
          niveau?: string | null
        }
      }
    }
  }
}
