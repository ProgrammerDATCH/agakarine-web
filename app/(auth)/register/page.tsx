"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { sendSignInLinkToEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type FormData = z.infer<typeof formSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/verify`,
        handleCodeInApp: true,
        dynamicLinkDomain: undefined,
      }

      await sendSignInLinkToEmail(auth, data.email, actionCodeSettings)

      // Save the email for confirmation
      window.localStorage.setItem("emailForSignIn", data.email)

      toast({
        title: "Check your email",
        description: "We sent you a link to create your account.",
      })

      form.reset()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your email to create an account or sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Continue with Email
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button variant="outline" className="w-full">
            Continue as Guest
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
            <span className="bg-red-500 text-yellow-500 text-4xl">Dangote</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}