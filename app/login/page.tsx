"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { authenticateUser } from "@/lib/auth-utils"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check for remembered login on component mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser")
    if (rememberedUser) {
      try {
        const userData = JSON.parse(rememberedUser)
        setEmail(userData.email || "")
        setRememberMe(true)

        // Auto login if we have a remembered session
        if (localStorage.getItem("persistentLogin") === "true") {
          // Don't auto-login for admin, always require password for security
          if (userData.email !== "admin") {
            // We can't auto-login with the new system since we need password verification
            // Just pre-fill the email field
          }
        }
      } catch (error) {
        console.error("Error parsing remembered user data", error)
        localStorage.removeItem("rememberedUser")
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First, try to seed the initial users if they don't exist
      // This helps with the transition to the database
      try {
        await fetch("/api/seed-admin")
      } catch (error) {
        console.error("Error seeding initial users:", error)
        // Continue with login attempt even if seeding fails
      }

      const result = await authenticateUser(email, password)

      if (result.success && result.user) {
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify({ email }))
          localStorage.setItem("persistentLogin", "true")
        } else {
          localStorage.removeItem("rememberedUser")
          localStorage.removeItem("persistentLogin")
        }

        // Store user info in localStorage for client-side access
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userRole", result.user.role)
        localStorage.setItem("userEmail", result.user.email)
        localStorage.setItem("userId", result.user.id)
        localStorage.setItem("userName", result.user.name)

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid username or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Quick login buttons for demo purposes
  const handleQuickLogin = (userType: string) => {
    if (userType === "admin") {
      setEmail("admin")
      setPassword("]tY~J%y-\\zhQOW(Zj0*h")
    } else if (userType === "manager") {
      setEmail("Shanehawley2191@hotmail.com")
      setPassword("ManagerPassword123")
    } else if (userType === "roland") {
      setEmail("rnisley7361@gmail.com")
      setPassword("MeatCutter123")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span className="text-xl font-bold">Warehouse Discount Grocery</span>
            <span className="text-xs ml-2 text-muted-foreground">Hanceville</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username or Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="username or email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>

              {/* Quick login buttons for demo purposes */}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Demo Accounts:</p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => handleQuickLogin("admin")}>
                    Admin
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleQuickLogin("manager")}>
                    Manager (Shane)
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleQuickLogin("roland")}>
                    Roland
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      <footer className="border-t bg-muted">
        <div className="container flex flex-col gap-2 py-6 px-4 md:flex-row md:items-center md:gap-4 md:px-6">
          <p className="text-xs text-muted-foreground md:text-sm">
            © 2024 Warehouse Discount Grocery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
