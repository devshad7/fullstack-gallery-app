'use client'

import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {

    const router = useRouter()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/')
            } else {
                router.push('/')
            }
        })
    } ,[])

    return (
        <div>loading...</div>
    )
}

export default page