'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '../../hooks/useSupabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { getCallbackUrl } from '../../lib/utils'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const { supabase } = useSupabase()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Check for OAuth errors in URL parameters
    useEffect(() => {
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
            let errorMessage = 'Authentication failed'
            if (error === 'invalid_request') {
                errorMessage = 'OAuth configuration error. Please check your Supabase settings.'
            } else if (error === 'exchange_failed') {
                errorMessage = 'Failed to complete authentication. Please try again.'
            } else if (errorDescription) {
                errorMessage = decodeURIComponent(errorDescription)
            }
            setMessage(errorMessage)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: getCallbackUrl(),
                    },
                })
                if (error) throw error
                setMessage('Please check your email for the confirmation link!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
            }
        } catch (error) {
            setMessage((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setLoading(true)
        const callbackUrl = getCallbackUrl()
        console.log('OAuth Callback URL:', callbackUrl)
        console.log('Environment SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: callbackUrl,
                },
            })
            if (error) throw error
        } catch (error) {
            setMessage((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <h2 className="auth-title">
                {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>

            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input"
                />

                <button type="submit" disabled={loading} className="auth-button">
                    {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
            </form>

            <div style={{ margin: '1rem 0', textAlign: 'center' }}>
                <span>or</span>
            </div>

            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="auth-button"
                style={{ background: '#4285f4' }}
            >
                {loading ? 'Loading...' : 'Continue with Google'}
            </button>

            {message && (
                <div className={message.includes('error') ? 'auth-error' : 'auth-success'}>
                    {message}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#0070f3',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
            </div>
        </div>
    )
}
