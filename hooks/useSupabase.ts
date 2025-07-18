'use client'

import { useContext } from 'react'
import { createContext } from 'react'
import { createClient } from '../lib/supabase/client'
import { User } from '@supabase/supabase-js'

type SupabaseContext = {
    supabase: ReturnType<typeof createClient>
    user: User | null
}

export const Context = createContext<SupabaseContext | undefined>(undefined)

export const useSupabase = () => {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider')
    }
    return context
}
