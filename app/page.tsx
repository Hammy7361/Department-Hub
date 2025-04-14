import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, Clock } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span className="text-xl font-bold">Warehouse Discount Grocery</span>
            <span className="text-xs ml-2 text-muted-foreground">Hanceville</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Login
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Warehouse Discount Grocery: Schedule Management
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Manage schedules, access department resources, collaborate with team members, and streamline workplace
                  operations.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/login">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CalendarDays className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Work Scheduling</h3>
                  <p className="text-muted-foreground">
                    Create and manage work schedules with an intuitive interface for your entire department.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Team Management</h3>
                  <p className="text-muted-foreground">
                    Access employee profiles, department resources, and team collaboration tools in one place.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Department Resources</h3>
                  <p className="text-muted-foreground">
                    Access important documents, announcements, and department policies from anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted">
        <div className="container flex flex-col gap-2 py-6 px-4 md:flex-row md:items-center md:gap-4 md:px-6">
          <p className="text-xs text-muted-foreground md:text-sm">© 2024 WorkScheduler. All rights reserved.</p>
          <nav className="flex gap-4 md:ml-auto md:gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:underline underline-offset-4 md:text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:underline underline-offset-4 md:text-sm">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
