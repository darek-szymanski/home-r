'use client'

import { getBaseUrl, getCallbackUrl } from '../lib/utils'

export default function DebugUrls() {
    const baseUrl = getBaseUrl()
    const callbackUrl = getCallbackUrl()

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999
        }}>
            <div><strong>Debug URLs:</strong></div>
            <div>Base URL: {baseUrl}</div>
            <div>Callback URL: {callbackUrl}</div>
            <div>ENV: {process.env.NEXT_PUBLIC_SITE_URL || 'not set'}</div>
        </div>
    )
}
