import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jbohbzkwmhjhpezbmmuv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impib2hiemt3bWhqaHBlemJtbXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNTY1ODMsImV4cCI6MjA0NzczMjU4M30.uJw070pcoZWfV40TDxQm4ZrSi9tDzJT3w2iGiOoL3PE'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: false
    }
  }
);
