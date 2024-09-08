'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth"
import { auth } from "@/lib/firebase"
import toast from "react-hot-toast"
import DeleteAccount from "./DeleteAccount"
import { useRouter } from "next/navigation"

const Setting = () => {

    const router = useRouter();

    const [user, setUser] = useState([])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (data) => {
            if (data) {
                setUser(data)
                // console.log(data);
            } else {
                setUser(null)
                router.push('/')                
            }
        })

        return () => unsubscribe();


    }, [])

    // send email verification link
    const handleEmailVerification = () => {
        sendEmailVerification(auth.currentUser).then((res) => {
            toast.success("Verification link send. Check email")
        }).catch((err) => (
            toast.error("Failed to send verfication link. Try again")
        ))
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
                        <Link href="/dashboard/setting" className="font-semibold text-primary">
                            General
                        </Link>
                        <Link href="/dashboard/setting/security">Security</Link>
                    </nav>
                    <div className="grid gap-6">
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Name</CardTitle>
                                <CardDescription>
                                    Account owner name
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {user ? (
                                    <form>
                                        <Input placeholder={user.displayName} />
                                    </form>
                                ) : (
                                    <form>
                                        <Input placeholder="Null" />
                                    </form>
                                )}
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button>Save</Button>
                            </CardFooter>
                        </Card>
                        <Card x-chunk="dashboard-04-chunk-2">
                            <CardHeader>
                                <CardTitle>Personal Details</CardTitle>
                                <CardDescription>
                                    Account personal details
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {user ? (
                                    <form className="flex flex-col gap-2">
                                        <Input
                                            placeholder={user.email}
                                            disabled
                                        />
                                        <Input
                                            placeholder={user.phoneNumber == null ? "+1 (123) 456-7890" : user.phoneNumber}
                                        />
                                        <p className={user.emailVerified == false ? "text-sm mt-2" : "hidden"}>
                                            Email is not verified, {''}
                                            <span className="text-blue-700 cursor-pointer hover:underline" onClick={handleEmailVerification}>send verfication link</span>
                                        </p>
                                    </form>
                                ) : (
                                    <form className="flex flex-col gap-4">
                                        <Input
                                            placeholder="Project Name"
                                        />
                                    </form>
                                )}
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button>Save</Button>
                            </CardFooter>
                        </Card>
                    <DeleteAccount />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Setting