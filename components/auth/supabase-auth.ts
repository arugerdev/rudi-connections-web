'use server'
import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"

async function signUpNewUser(name: string, email: string, password: string) {
    'use server'
    const supabase = await createClient()
    const origin = headers().get('origin')
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name
            },
            emailRedirectTo: `${origin}/callback`,
        },
    })

    if (error) throw error
    return data
}

async function signInWithEmail(email: string, password: string) {
    'use server'

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (error) throw error

    return data
}

export { signInWithEmail, signUpNewUser }