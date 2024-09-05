'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

const Login = () => {

    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const loginUser = () => {

        // Reset previous errors
        setEmailError(false);
        setPasswordError(false);
        setError(null);

        // Validate inputs
        let valid = true;

        if (!email) {
            setEmailError(true);
            valid = false;
        }

        if (!password) {
            setPasswordError(true);
            valid = false;
        }

        // If any field is invalid, stop execution
        if (!valid) {
            setError('All fields are required.');
            return;
        }

        // Proceed with user creation if all fields are valid
        signInWithEmailAndPassword(auth, email, password).then((res) => {
            router.push('/')
        }).catch((err) => {
            console.log(err.message);
        })
    }

    return (
        <>
            <div className="flex justify-center items-center w-full h-[100vh]">
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    className={`border p-2 ${emailError ? 'border-red-500' : ''}`}
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); if (e.target.value) setEmailError(false); }}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    className={`border p-2 ${passwordError ? 'border-red-500' : ''}`}
                                    onChange={(e) => { setPassword(e.target.value); if (e.target.value) setPasswordError(false); }}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" onClick={loginUser}>
                                Login
                            </Button>
                            <Button variant="outline" className="w-full">
                                Login with Github
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href={'/auth/signup'} className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Login