import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from './login-form'
import DebugUrls from '../../components/debug-urls'

export default async function LoginPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        redirect('/')
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center', margin: '2rem 0' }}>
                Welcome to Your Home App
            </h1>
            <LoginForm />
            <DebugUrls />
        </div>
    )
}
