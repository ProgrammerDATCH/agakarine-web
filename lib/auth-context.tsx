"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import {
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  onAuthStateChanged,
  type User
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

interface AuthContextType {
  user: User | null
  loading: boolean
  sendLoginLink: (email: string) => Promise<void>
  completeLogin: (email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (!userDoc.exists()) {
          // Create new user document
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            createdAt: new Date(),
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const sendLoginLink = async (email: string) => {
    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/login/confirm`,
      handleCodeInApp: true,
      dynamicLinkDomain: undefined,
    }

    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    // Save email for confirmation step
    window.localStorage.setItem("emailForSignIn", email)
  }

  const completeLogin = async (email: string) => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
        throw new Error("Invalid login link")
    }

    try {
        const result = await signInWithEmailLink(auth, email, window.location.href)
        window.localStorage.removeItem("emailForSignIn")
        
        // Only try to create user document after successful authentication
        if (result.user) {
            try {
                const userDoc = await getDoc(doc(db, "users", result.user.uid))
                if (!userDoc.exists()) {
                    await setDoc(doc(db, "users", result.user.uid), {
                        email: result.user.email,
                        createdAt: new Date().toISOString(),
                    })
                }
            } catch (error) {
                // Just log the error but don't fail the login
                console.error("Error creating user document:", error)
            }
        }
    } catch (error) {
        console.error("Error signing in:", error)
        throw error
    }
}

  const logout = () => auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, sendLoginLink, completeLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}