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
import {
  Users,
  RefreshCw,
  Save,
  Search,
  UserPlus,
  Edit,
  Trash2,
  AlertCircle,
  Info,
  Download,
  Upload,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockPendingAccounts } from "../admin/accounts/page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock system logs data
const MOCK_LOGS = [
  {
    id: "log1",
    timestamp: "2024-05-15 09:32:45",
    user: "admin",
    action: "Login",
    details: "Successful login from 192.168.1.1",
    level: "info",
  },
  {
    id: "log2",
    timestamp: "2024-05-15 09:35:12",
    user: "admin",
    action: "Settings Update",
    details: "Modified system settings",
    level: "info",
  },
  {
    id: "log3",
    timestamp: "2024-05-15 10:15:33",
    user: "Shane Hawley",
    action: "Schedule Update",
    details: "Modified schedule for May 20-26",
    level: "info",
  },
  {
    id: "log4",
    timestamp: "2024-05-15 11:42:18",
    user: "John Doe",
    action: "Resource Access",
    details: "Downloaded Employee Handbook",
    level: "info",
  },
  {
    id: "log5",
    timestamp: "2024-05-15 12:30:22",
    user: "system",
    action: "Backup",
    details: "Automatic backup completed successfully",
    level: "info",
  },
  {
    id: "log6",
    timestamp: "2024-05-15 14:15:07",
    user: "admin",
    action: "User Creation",
    details: "Created new user account for Taylor Smith",
    level: "info",
  },
  {
    id: "log7",
    timestamp: "2024-05-15 15:22:33",
    user: "system",
    action: "Error",
    details: "Failed to connect to database - timeout",
    level: "error",
  },
  {
    id: "log8",
    timestamp: "2024-05-15 16:45:19",
    user: "Roland",
    action: "Profile Update",
    details: "Updated personal information",
    level: "info",
  },
  {
    id: "log9",
    timestamp: "2024-05-15 17:30:05",
    user: "Shane Hawley",
    action: "Resource Upload",
    details: "Uploaded new training materials",
    level: "info",
  },
  {
    id: "log10",
    timestamp: "2024-05-15 18:12:41",
    user: "system",
    action: "Warning",
    details: "High server load detected",
    level: "warning",
  },
]

// Mock users data
const MOCK_USERS = [
  {
    id: "user1",
    name: "Admin",
    email: "admin",
    role: "Admin",
    department: "IT",
    lastLogin: "2024-05-15 09:32:45",
  },
  {
    id: "user2",
    name: "Shane Hawley",
    email: "Shanehawley2191@hotmail.com",
    role: "Manager",
    department: "Meat Market",
    lastLogin: "2024-05-15 08:15:22",
  },
  {
    id: "user3",
    name: "Roland",
    email: "rnisley7361@gmail.com",
    role: "Associate",
    department: "Meat Market",
    lastLogin: "2024-05-14 17:45:33",
  },
  {
    id: "user4",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Associate",
    department: "Deli",
    lastLogin: "2024-05-14 12:22:18",
  },
  {
    id: "user5",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Associate",
    department: "Produce",
    lastLogin: "2024-05-13 16:30:45",
  },
]

export default function AdminPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [logSearchQuery, setLogSearchQuery] = useState("")
  const [logFilter, setLogFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isClearLogsDialogOpen, setIsClearLogsDialogOpen] = useState(false)
  const router = useRouter()

  const LOGS_PER_PAGE = 5

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

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      toast({
        title: "User Deleted",
        description: "The user has been removed from the system.",
      })
      setIsDeleteDialogOpen(false)
    }
  }

  const handleClearLogs = () => {
    setIsClearLogsDialogOpen(true)
  }

  const confirmClearLogs = () => {
    toast({
      title: "Logs Cleared",
      description: "All system logs have been cleared.",
    })
    setIsClearLogsDialogOpen(false)
  }

  const handleExportLogs = () => {
    toast({
      title: "Logs Exported",
      description: "System logs have been exported to CSV.",
    })
  }

  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredLogs = MOCK_LOGS.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearchQuery.toLowerCase())

    const matchesLevel = logFilter === "all" || log.level === logFilter

    return matchesSearch && matchesLevel
  })

  // Pagination for logs
  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * LOGS_PER_PAGE, currentPage * LOGS_PER_PAGE)

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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and roles</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">User Accounts</h3>
                    <Button variant="outline" onClick={() => router.push("/admin/accounts")}>
                      Pending Requests
                      <Badge variant="secondary" className="ml-2">
                        {mockPendingAccounts.length}
                      </Badge>
                    </Button>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-5 p-3 border-b font-medium bg-muted">
                      <div>User</div>
                      <div>Email</div>
                      <div>Role</div>
                      <div>Department</div>
                      <div>Actions</div>
                    </div>

                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div key={user.id} className="grid grid-cols-5 p-3 border-b items-center hover:bg-muted/50">
                          <div>{user.name}</div>
                          <div>{user.email}</div>
                          <div>
                            <Badge
                              variant={
                                user.role === "Admin" ? "destructive" : user.role === "Manager" ? "default" : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                          </div>
                          <div>{user.department}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/employees/${user.id}`)}>
                              <Users className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/employees/${user.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            {user.role !== "Admin" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">No users found matching your search</div>
                    )}
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
                      <Input id="company-name" defaultValue="Warehouse Discount Grocery" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department-name">Department Name</Label>
                      <Input id="department-name" defaultValue="Meat Market" />
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
                    <h3 className="text-lg font-medium">Backup & Data Management</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="backup-frequency">Backup Frequency</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="backup-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                        <Input id="backup-retention" type="number" defaultValue="30" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Create Backup Now
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Restore Backup
                      </Button>
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
                <div className="flex items-center gap-2">
                  <div className="relative w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search logs..."
                      className="pl-8"
                      value={logSearchQuery}
                      onChange={(e) => setLogSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={logFilter} onValueChange={setLogFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Filter logs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)}>
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Refresh</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-5 p-3 border-b font-medium bg-muted">
                      <div>Timestamp</div>
                      <div>User</div>
                      <div>Action</div>
                      <div>Details</div>
                      <div>Level</div>
                    </div>

                    {paginatedLogs.length > 0 ? (
                      paginatedLogs.map((log) => (
                        <div key={log.id} className="grid grid-cols-5 p-3 border-b hover:bg-muted/50">
                          <div className="text-sm">{log.timestamp}</div>
                          <div>{log.user}</div>
                          <div>{log.action}</div>
                          <div className="text-sm">{log.details}</div>
                          <div>
                            {log.level === "error" ? (
                              <div className="flex items-center text-red-500">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Error
                              </div>
                            ) : log.level === "warning" ? (
                              <div className="flex items-center text-amber-500">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Warning
                              </div>
                            ) : (
                              <div className="flex items-center text-blue-500">
                                <Info className="h-4 w-4 mr-1" />
                                Info
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">No logs found matching your criteria</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleExportLogs}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Logs
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={handleClearLogs}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Logs
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages || 1}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Logs Confirmation Dialog */}
      <AlertDialog open={isClearLogsDialogOpen} onOpenChange={setIsClearLogsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear System Logs</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all system logs? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearLogs} className="bg-red-600 hover:bg-red-700">
              Clear Logs
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
