import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import { OfflineIndicator } from "@/components/offline-indicator"
import { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agakarine - Organize Your Life Effortlessly",
  description: "Agakarine is your ultimate solution for managing tasks, events, notes, and debts. Stay organized, increase productivity, and keep everything in one place with ease.",
  keywords: ["task management", "event planner", "note-taking", "debt tracking", "organizer", "productivity", "Agakarine"],
  authors: [{ name: "Agakarine" }],
  openGraph: {
    title: "Agakarine - Organize Your Life Effortlessly",
    description: "Your ultimate solution for managing tasks, events, notes, and debts. Stay organized, increase productivity, and keep everything in one place.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Agakarine Logo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agakarine - Organize Your Life Effortlessly",
    description: "Manage tasks, events, notes, and debts with ease. Agakarine is your one-stop solution for staying organized.",
    images: ["/logo.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Primary Meta Tags */}
        <title>{String(metadata.title)}</title>
        <meta name="title" content={String(metadata.title)} />
        <meta name="description" content={String(metadata.description)} />

        {/* Keywords */}
        <meta
          name="keywords"
          content="Agakarine, Datch, Programmerdatch, Rwanda, Notes, Todo"
        />

        {/* Favicons */}
        <link rel="icon" type="image/png" href="/logo.png" />
        <link
          rel="alternate icon"
          type="image/x-icon"
          href="/logo.png"
        />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ProgrammerDATCH" />
        <meta name="theme-color" content="#7f8000" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
            <OfflineIndicator />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}