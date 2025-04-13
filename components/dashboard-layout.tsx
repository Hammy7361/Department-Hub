"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CalendarDays,
  Users,
  Home,
  LogOut,
  Menu,
  X,
  Clock,
  User,
  FileText,
  Settings,
  Shield,
  UserPlus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Get user role and email
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")
    setUserRole(role)
    setUserEmail(email)
  }, [router])

  const handleLogout = () => {
    // Clear login state but keep remembered user if that option was selected
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")

    // Only remove persistent login, but keep the remembered email if it exists
    localStorage.removeItem("persistentLogin")

    router.push("/login")
  }

  // Base navigation items for all users
  const baseNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "Schedule",
      href: "/schedule",
      icon: CalendarDays,
      // Add a description that will be shown in tooltips or other UI elements
      description:
        userRole === "manager" || userRole === "admin" ? "View and manage work schedules" : "View work schedules",
    },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Resources", href: "/resources", icon: FileText },
    { name: "My Profile", href: "/profile", icon: User },
  ]

  // Admin-specific navigation items
  const adminNavItems = [
    { name: "Admin Panel", href: "/admin", icon: Shield },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Account Requests", href: "/admin/accounts", icon: UserPlus },
  ]

  // Determine which nav items to show based on role
  const navItems = userRole === "admin" ? [...baseNavItems, ...adminNavItems] : baseNavItems

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          <span className="text-xl font-bold">Warehouse Discount Grocery</span>
          <span className="text-xs ml-2 text-muted-foreground">Hanceville</span>
        </Link>
        {userRole === "admin" && (
          <Badge variant="destructive" className="ml-2">
            Admin
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                  <AvatarFallback>
                    {userRole === "admin" ? "AD" : userEmail?.substring(0, 2).toUpperCase() || "UN"}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {userRole === "admin" ? "Admin Account" : "My Account"}
                {userRole && (
                  <span className="block text-xs text-muted-foreground mt-1">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/schedule")}>My Schedule</DropdownMenuItem>
              {userRole === "admin" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/admin")}>Admin Panel</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>System Settings</DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside
          className={`${isMobileMenuOpen ? "block" : "hidden"} md:block border-r bg-background w-64 fixed md:sticky top-16 h-[calc(100vh-4rem)] z-20`}
        >
          <nav className="grid gap-2 p-4">
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    pathname === item.href ? "bg-muted font-medium" : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
