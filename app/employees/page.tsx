"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockEmployeeData } from "@/lib/mock-data"

export default function EmployeesPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
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
    setUserRole(role)
    setIsLoading(false)
  }, [router])

  const filteredEmployees = mockEmployeeData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()),
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage your team members</p>
          </div>
          <div className="flex items-center gap-2">
            {userRole === "manager" && (
              <Button onClick={() => router.push("/employees/add")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <CardTitle>Team Members</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search employees..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_150px_100px_50px] py-3 px-4 border-b font-medium">
                <div>Name</div>
                <div>Contact</div>
                <div>Department</div>
                <div>Role</div>
                <div></div>
              </div>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_150px_100px_50px] py-3 px-4 border-b last:border-b-0 items-center"
                  >
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={employee.name} />
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground hidden md:block">ID: {employee.id}</div>
                      </div>
                    </div>
                    <div className="mb-2 md:mb-0">
                      <div>{employee.email}</div>
                      <div className="text-sm text-muted-foreground">{employee.phone}</div>
                    </div>
                    <div className="mb-2 md:mb-0">{employee.department}</div>
                    <div className="mb-2 md:mb-0">
                      <Badge variant={employee.role === "Manager" ? "default" : "outline"}>{employee.role}</Badge>
                    </div>
                    <div className="flex justify-end">
                      {userRole === "manager" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/employees/${employee.id}`)}>
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/employees/${employee.id}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/schedule?employee=${employee.id}`)}>
                              View Schedule
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/employees/${employee.id}`)}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">No employees found matching your search</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
