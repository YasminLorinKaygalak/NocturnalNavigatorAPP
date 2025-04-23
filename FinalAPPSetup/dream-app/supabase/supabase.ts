import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zxqxxhnrngrlanrrcfvk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cXh4aG5ybmdybGFucnJjZnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NzMzNTksImV4cCI6MjA0NTQ0OTM1OX0.ToSvWc_Zp5N-Ab4Q9ZD08dnsUsLOe00-7Hh6OfGuNzY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })