"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmLoginPage() {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { completeLogin } = useAuth()
    const searchParams = useSearchParams()

    useEffect(() => {
        const email = window.localStorage.getItem("emailForSignIn")
        if (!email) {
            setError("No email found. Please try logging in again.")
            return
        }

        // Get the apiKey and oobCode from URL
        const apiKey = searchParams.get('apiKey')
        const oobCode = searchParams.get('oobCode')

        if (!apiKey || !oobCode) {
            setError("Invalid verification link.")
            return
        }

        const complete = async () => {
            try {
                await completeLogin(email)
                router.push("/dashboard")
            } catch (error: any) {
                console.error("Login error:", error)
                setError(error?.message || "Failed to complete login. Please try again.")
            }
        }

        complete()
    }, [completeLogin, router, searchParams])

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Completing login...</CardTitle>
                    <CardDescription>Please wait while we log you in.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}