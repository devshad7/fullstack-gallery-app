'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { onAuthStateChanged, updatePassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import toast from "react-hot-toast"

const Security = () => {

    const [user, setUser] = useState([])
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (data) => {
            if (data) {
                setUser(data)
                // console.log(data);
            } else {
                setUser(null)
            }
        })

        return () => unsubscribe();


    }, [])

    // handle password change
    const handlePasswordChange = () => {
        updatePassword(auth.currentUser, newPassword).then((res) => {
            toast.success("Password Changed")
        }).catch((err) => {
            toast.error("Something went wrong...")
            console.log(err.message);
        })
    }

    return (
        <>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">Settings</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <nav
                        className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                    >
                        <Link href="/dashboard/setting">
                            General
                        </Link>
                        <Link href="/dashboard/setting/security" className="font-semibold text-primary">Security</Link>
                    </nav>
                    <div className="grid gap-6">
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Manage your password
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <Input
                                        type='password'
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </form>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button onClick={handlePasswordChange}>Update Password</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Security