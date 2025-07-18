'use client'

import { useSupabase } from '../hooks/useSupabase'
import { User } from '@supabase/supabase-js'

interface ClientPageProps {
    user: User
}

export default function ClientPage({ user }: ClientPageProps) {
    const { supabase } = useSupabase()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Welcome to Your Home App</h1>
                <div>
                    <span style={{ marginRight: '1rem' }}>Hello, {user.email}</span>
                    <button onClick={handleSignOut} className="auth-button" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                        Sign Out
                    </button>
                </div>
            </div>

            <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
                <h2>🎉 Authentication Success!</h2>
                <p style={{ marginTop: '1rem' }}>
                    You are now logged in with Supabase authentication. Your app is deployed on Vercel
                    with server-side rendering, which means your Supabase credentials are securely handled
                    on the server side.
                </p>

                <div style={{ marginTop: '2rem' }}>
                    <h3>Your User Info:</h3>
                    <ul style={{ marginTop: '1rem', marginLeft: '1rem' }}>
                        <li><strong>Email:</strong> {user.email}</li>
                        <li><strong>User ID:</strong> {user.id}</li>
                        <li><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</li>
                    </ul>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h3>Security Features:</h3>
                    <ul style={{ marginTop: '1rem', marginLeft: '1rem' }}>
                        <li>✅ Server-side authentication validation</li>
                        <li>✅ Secure cookie-based session management</li>
                        <li>✅ Automatic session refresh</li>
                        <li>✅ Protected routes with middleware</li>
                        <li>✅ Environment variables secured on server</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
