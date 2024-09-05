'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Dashboard from './Dashboard'

const Home = () => {

    const [userState, setUserState] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserState(true)
            } else {
                setUserState(false)
            }
        })
    }, [])

    return (
        <>
            {userState != true ?
                <div className="h-[100vh] w-full flex justify-center items-center gap-3">
                    <Link href={'/auth/login'}>
                        <Button>Login</Button>
                    </Link>
                    <Link href={'/auth/signup'}>
                        <Button>Sign Up</Button>
                    </Link>
                </div>
                :
                <Dashboard />
            }
        </>
    )
}

export default Home