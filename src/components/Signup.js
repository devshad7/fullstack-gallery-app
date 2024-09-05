'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from "react"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

const Signup = () => {

    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [error, setError] = useState(null);
    const [fnameError, setFnameError] = useState(false);
    const [lnameError, setLnameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const name = fname + " " + lname;

    const createUser = () => {
        // Reset previous errors
        setFnameError(false);
        setLnameError(false)
        setEmailError(false);
        setPasswordError(false);
        setError(null);

        // Validate inputs
        let valid = true;

        if (!fname) {
            setFnameError(true);
            valid = false;
        }

        if (!lname) {
            setLnameError(true);
            valid = false;
        }

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
        createUserWithEmailAndPassword(auth, email, password).then((res) => {
            return updateProfile(auth.currentUser, {
                displayName: name
            })
                .then(() => {
                    console.log(res.user);
                    router.push('/auth/login')
                })
        }).catch((err) => {
            console.log(err.message);
        })
    }

    return (
        <>
            <div className="flex justify-center items-center w-full h-[100vh]">
                <Card className="max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your information to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input
                                        id="first-name"
                                        placeholder="Max"
                                        value={fname}
                                        onChange={(e) => { setFname(e.target.value); if (e.target.value) setFnameError(false) }}
                                        className={`border p-2 ${fnameError ? 'border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input
                                        id="last-name"
                                        placeholder="Robinson"
                                        value={lname}
                                        onChange={(e) => { setLname(e.target.value); if (e.target.value) setLnameError(false); }}
                                        className={`border p-2 ${lnameError ? 'border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); if (e.target.value) setEmailError(false); }}
                                    className={`border p-2 ${emailError ? 'border-red-500' : ''}`}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    className={`border p-2 ${passwordError ? 'border-red-500' : ''}`}
                                    onChange={(e) => { setPassword(e.target.value); if (e.target.value) setPasswordError(false); }}
                                />
                            </div>
                            <Button type="submit" className="w-full" onClick={createUser}>
                                Create an account
                            </Button>
                            <Button variant="outline" className="w-full">
                                Sign up with GitHub
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href={'/auth/login'} className="underline">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Signup