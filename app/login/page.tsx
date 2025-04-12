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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Admin credentials
  const ADMIN_USERNAME = "admin"
  const ADMIN_PASSWORD = "]tY~J%y-\\zhQOW(Zj0*h"

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
          if (userData.email !== ADMIN_USERNAME) {
            handleLogin(userData.email)
          }
        }
      } catch (error) {
        console.error("Error parsing remembered user data", error)
        localStorage.removeItem("rememberedUser")
      }
    }
  }, [router])

  const handleLogin = (userEmail: string, isAdmin = false) => {
    // Determine role based on email or admin status
    let role = "associate"

    if (isAdmin) {
      role = "admin"
    } else if (userEmail === "Shanehawley2191@hotmail.com") {
      role = "manager"
    }

    // Store login state
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userRole", role)
    localStorage.setItem("userEmail", userEmail)

    // Redirect to dashboard
    router.push("/dashboard")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check for admin login
    if (email === ADMIN_USERNAME) {
      if (password === ADMIN_PASSWORD) {
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify({ email }))
          localStorage.setItem("persistentLogin", "true")
        } else {
          localStorage.removeItem("rememberedUser")
          localStorage.removeItem("persistentLogin")
        }

        // Admin login successful
        setTimeout(() => {
          handleLogin(email, true)
          setIsLoading(false)
        }, 1000)
      } else {
        // Admin password incorrect
        setTimeout(() => {
          toast({
            title: "Login Failed",
            description: "Invalid username or password. Please try again.",
            variant: "destructive",
          })
          setIsLoading(false)
        }, 1000)
      }
    } else {
      // Regular user login (in a real app, you would authenticate with a server)
      setTimeout(() => {
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify({ email }))
          localStorage.setItem("persistentLogin", "true")
        } else {
          localStorage.removeItem("rememberedUser")
          localStorage.removeItem("persistentLogin")
        }

        handleLogin(email)
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span className="text-xl font-bold">Department Hub</span>
          </Link>
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
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="#" className="text-primary underline-offset-4 hover:underline">
                  Contact your administrator
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      <footer className="border-t bg-gray-100">
        <div className="container flex flex-col gap-2 py-6 px-4 md:flex-row md:items-center md:gap-4 md:px-6">
          <p className="text-xs text-gray-500 md:text-sm">© 2024 Department Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
