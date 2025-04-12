"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Users, RefreshCw, Save } from "lucide-react"

export default function AdminPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Get user role
    const role = localStorage.getItem("userRole")
    if (role !== "admin") {
      // Redirect non-admins
      router.push("/dashboard")
      return
    }

    setUserRole(role)
    setIsLoading(false)
  }, [router])

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been saved successfully.",
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
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage system settings and user permissions</p>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">User Accounts</h3>
                    <Button>
                      <Users className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 p-3 border-b font-medium">
                      <div>User</div>
                      <div>Email</div>
                      <div>Role</div>
                      <div>Actions</div>
                    </div>

                    <div className="grid grid-cols-4 p-3 border-b items-center">
                      <div>Admin</div>
                      <div>admin</div>
                      <div>
                        <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                          Admin
                        </span>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 p-3 border-b items-center">
                      <div>Shane Hawley</div>
                      <div>Shanehawley2191@hotmail.com</div>
                      <div>
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Manager
                        </span>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 p-3 items-center">
                      <div>John Doe</div>
                      <div>john.doe@example.com</div>
                      <div>
                        <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                          Associate
                        </span>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Configure access levels for different user roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Manager Permissions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manager-schedule">Schedule Management</Label>
                        <Switch id="manager-schedule" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manager-employees">Employee Management</Label>
                        <Switch id="manager-employees" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manager-resources">Resource Management</Label>
                        <Switch id="manager-resources" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manager-reports">Generate Reports</Label>
                        <Switch id="manager-reports" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Associate Permissions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="associate-schedule">View Schedule</Label>
                        <Switch id="associate-schedule" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="associate-employees">View Employee Directory</Label>
                        <Switch id="associate-employees" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="associate-resources">Access Resources</Label>
                        <Switch id="associate-resources" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="associate-profile">Edit Own Profile</Label>
                        <Switch id="associate-profile" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Permissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue="Meat Market" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department-name">Department Name</Label>
                      <Input id="department-name" defaultValue="Main Department" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Security Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                        <Switch id="two-factor" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password-expiry">Password Expiry (90 days)</Label>
                        <Switch id="password-expiry" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="session-timeout">Session Timeout (30 minutes)</Label>
                        <Switch id="session-timeout" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="schedule-alerts">Schedule Change Alerts</Label>
                        <Switch id="schedule-alerts" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>View system activity and audit logs</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 p-3 border-b font-medium">
                      <div>Timestamp</div>
                      <div>User</div>
                      <div>Action</div>
                      <div>Details</div>
                    </div>

                    <div className="grid grid-cols-4 p-3 border-b">
                      <div className="text-sm">2023-05-15 09:32:45</div>
                      <div>admin</div>
                      <div>Login</div>
                      <div className="text-sm">Successful login from 192.168.1.1</div>
                    </div>

                    <div className="grid grid-cols-4 p-3 border-b">
                      <div className="text-sm">2023-05-15 09:35:12</div>
                      <div>admin</div>
                      <div>Settings Update</div>
                      <div className="text-sm">Modified system settings</div>
                    </div>

                    <div className="grid grid-cols-4 p-3 border-b">
                      <div className="text-sm">2023-05-15 10:15:33</div>
                      <div>Shane Hawley</div>
                      <div>Schedule Update</div>
                      <div className="text-sm">Modified schedule for May 20-26</div>
                    </div>

                    <div className="grid grid-cols-4 p-3">
                      <div className="text-sm">2023-05-15 11:42:18</div>
                      <div>John Doe</div>
                      <div>Resource Access</div>
                      <div className="text-sm">Downloaded Employee Handbook</div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">Page 1 of 10</div>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
