"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Search, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
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

interface RegistrationRequest {
  id: string
  name: string
  email: string
  department: string
  request_date: string
}

export const mockPendingAccounts: RegistrationRequest[] = [
  {
    id: "req1",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    department: "Meat Market",
    request_date: "2024-05-14",
  },
  {
    id: "req2",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    department: "Deli",
    request_date: "2024-05-15",
  },
]

export default function AccountRequestsPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [pendingAccounts, setPendingAccounts] = useState<RegistrationRequest[]>(mockPendingAccounts)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [requestToReject, setRequestToReject] = useState<string | null>(null)
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
    fetchPendingRequests()
  }, [router])

  const fetchPendingRequests = async () => {
    try {
      // In a real app, this would fetch from Supabase
      // For now, we'll use the mock data
      setIsLoading(false)
    } catch (error) {
      console.error("Error in fetchPendingRequests:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      // In a real app, this would call the server action
      // For now, we'll simulate success
      toast({
        title: "Account Approved",
        description: "The user account has been approved and activated.",
      })

      // Remove from pending list
      setPendingAccounts(pendingAccounts.filter((account) => account.id !== id))
    } catch (error) {
      console.error("Error in handleApprove:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    setRequestToReject(id)
    setIsRejectDialogOpen(true)
  }

  const confirmReject = async () => {
    if (requestToReject) {
      try {
        // In a real app, this would call the server action
        // For now, we'll simulate success
        toast({
          title: "Account Rejected",
          description: "The user account request has been rejected.",
        })

        // Remove from pending list
        setPendingAccounts(pendingAccounts.filter((account) => account.id !== requestToReject))
        setIsRejectDialogOpen(false)
      } catch (error) {
        console.error("Error in confirmReject:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    }
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Account Requests</h1>
              <p className="text-muted-foreground">Manage new account registration requests</p>
            </div>
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
              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] p-3 border-b font-medium bg-muted">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Department</div>
                  <div>Request Date</div>
                  <div>Actions</div>
                </div>
                {filteredAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] p-3 border-b items-center hover:bg-muted/50"
                  >
                    <div>{account.name}</div>
                    <div>{account.email}</div>
                    <div>
                      <Badge variant="outline">{account.department}</Badge>
                    </div>
                    <div>{account.request_date}</div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-100"
                        onClick={() => handleApprove(account.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
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

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Account Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this account request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject} className="bg-red-600 hover:bg-red-700">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
