"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function VerifyPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const verifyEmail = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn")

        if (!email) {
          // If email is not found in localStorage, handle appropriately
          setError("Email verification failed. Please try signing up again.")
          return
        }

        try {
          await signInWithEmailLink(auth, email, window.location.href)
          window.localStorage.removeItem("emailForSignIn")
          router.push("/dashboard")
        } catch (error) {
          console.error("Error signing in:", error)
          setError("Failed to complete sign in. Please try again.")
        }
      } else {
        setError("Invalid verification link.")
      }
    }

    verifyEmail()
  }, [router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Verification Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Verifying your email</CardTitle>
          <CardDescription>Please wait while we complete the verification...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    </div>
  )
}