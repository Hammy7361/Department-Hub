"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Search, CheckCircle, XCircle } from "lucide-react"

// Mock pending account requests
export const mockPendingAccounts = [
  {
    id: "req001",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    department: "Sales",
    requestDate: "2023-05-14",
  },
  {
    id: "req002",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    department: "Support",
    requestDate: "2023-05-15",
  },
  {
    id: "req003",
    name: "David Brown",
    email: "david.brown@example.com",
    department: "Marketing",
    requestDate: "2023-05-15",
  },
]

export default function AccountRequestsPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [pendingAccounts, setPendingAccounts] = useState(mockPendingAccounts)
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

  const handleApprove = (id: string) => {
    // In a real app, you would send this to your server
    // For demo purposes, we'll just update the UI
    setPendingAccounts(pendingAccounts.filter((account) => account.id !== id))
    toast({
      title: "Account Approved",
      description: "The user account has been approved and activated.",
    })
  }

  const handleReject = (id: string) => {
    // In a real app, you would send this to your server
    // For demo purposes, we'll just update the UI
    setPendingAccounts(pendingAccounts.filter((account) => account.id !== id))
    toast({
      title: "Account Rejected",
      description: "The user account request has been rejected.",
    })
  }

  const filteredAccounts = pendingAccounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <h1 className="text-3xl font-bold">Account Requests</h1>
            <p className="text-muted-foreground">Manage new account registration requests</p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Review and approve new user accounts</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredAccounts.length > 0 ? (
              <div className="border rounded-md">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] p-3 border-b font-medium">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Department</div>
                  <div>Request Date</div>
                  <div>Actions</div>
                </div>
                {filteredAccounts.map((account) => (
                  <div key={account.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] p-3 border-b items-center">
                    <div>{account.name}</div>
                    <div>{account.email}</div>
                    <div>
                      <Badge variant="outline">{account.department}</Badge>
                    </div>
                    <div>{account.requestDate}</div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600"
                        onClick={() => handleApprove(account.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleReject(account.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No pending account requests found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
