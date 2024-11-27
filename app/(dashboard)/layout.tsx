import { DashboardNav } from "@/components/layouts/dashboard-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { UserNav } from "@/components/layouts/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <MobileNav />
            <h1 className="text-xl font-bold">Agakarine</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 md:py-6">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="py-6 pr-6">
            <DashboardNav />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}