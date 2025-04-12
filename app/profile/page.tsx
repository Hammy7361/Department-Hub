"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Your Name",
    email: "your.email@example.com",
    phone: "(555) 123-4567",
    department: "Sales",
    role: "Associate",
    hireDate: "2022-05-15",
    address: "123 Main St, Anytown, USA",
    emergencyContact: "John Doe (555) 987-6543",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  })

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Get user role
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    // Update mock data based on role
    if (role === "admin") {
      setUserData((prev) => ({
        ...prev,
        name: "System Administrator",
        email: "admin",
        role: "Admin",
        department: "IT",
        hireDate: "2020-01-01",
        bio: "System administrator with full access to all features and settings.",
      }))
    } else if (role === "manager") {
      setUserData((prev) => ({
        ...prev,
        name: "Shane Hawley",
        email: "Shanehawley2191@hotmail.com",
        role: "Manager",
      }))
    }

    setIsLoading(false)
  }, [router])

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile picture" />
                <AvatarFallback>
                  {userRole === "admin"
                    ? "AD"
                    : userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-muted-foreground mb-2">{userData.email}</p>
              <Badge
                variant={
                  userData.role === "Admin" ? "destructive" : userData.role === "Manager" ? "default" : "outline"
                }
              >
                {userData.role}
              </Badge>
              {isEditing && (
                <Button className="mt-4 w-full" size="sm">
                  Change Photo
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="work">Work Details</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{userData.name}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email/Username</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="text"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            disabled={userRole === "admin"}
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{userData.email}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{userData.phone}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        {isEditing ? (
                          <Input
                            id="address"
                            value={userData.address}
                            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{userData.address}</div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency">Emergency Contact</Label>
                      {isEditing ? (
                        <Input
                          id="emergency"
                          value={userData.emergencyContact}
                          onChange={(e) => setUserData({ ...userData, emergencyContact: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{userData.emergencyContact}</div>
                      )}
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
              <TabsContent value="work" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Information</CardTitle>
                    <CardDescription>Your work details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <div className="p-2 border rounded-md">{userData.department}</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <div className="p-2 border rounded-md">{userData.role}</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Hire Date</Label>
                        <div className="p-2 border rounded-md">{userData.hireDate}</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Employee ID</Label>
                        <div className="p-2 border rounded-md">
                          {userRole === "admin" ? "ADMIN-001" : `EMP-${Math.floor(10000 + Math.random() * 90000)}`}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      {isEditing ? (
                        <textarea
                          className="w-full min-h-[100px] p-2 border rounded-md"
                          value={userData.bio}
                          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{userData.bio}</div>
                      )}
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
              <TabsContent value="security" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>

                    {userRole === "admin" && (
                      <div className="pt-4 border-t">
                        <h3 className="font-medium mb-2">Advanced Security Options</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="api-keys">API Access Keys</Label>
                            <Button variant="outline" size="sm">
                              Manage Keys
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="login-history">Login History</Label>
                            <Button variant="outline" size="sm">
                              View History
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave}>Update Password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
