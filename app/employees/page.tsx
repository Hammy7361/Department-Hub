"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, MoreHorizontal, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

// Define our employee data structure
interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  role: string
  hireDate: string
  position?: string
}

// Meat Market employees
const MEAT_MARKET_EMPLOYEES: Employee[] = [
  {
    id: "emp-shane",
    name: "Shane",
    email: "shane@example.com",
    phone: "(555) 123-4567",
    department: "Meat Market",
    role: "Manager",
    hireDate: "2018-05-15",
    position: "Manager",
  },
  {
    id: "emp-james",
    name: "James",
    email: "james@example.com",
    phone: "(555) 234-5678",
    department: "Meat Market",
    role: "Associate",
    hireDate: "2019-06-22",
    position: "Assistant Manager",
  },
  {
    id: "emp-randy",
    name: "Randy",
    email: "randy@example.com",
    phone: "(555) 345-6789",
    department: "Meat Market",
    role: "Associate",
    hireDate: "2020-03-10",
    position: "Meat Cutter",
  },
  {
    id: "emp-david",
    name: "David",
    email: "david@example.com",
    phone: "(555) 456-7890",
    department: "Meat Market",
    role: "Associate",
    hireDate: "2021-01-05",
    position: "Meat Cutter",
  },
  {
    id: "emp-crystal",
    name: "Crystal",
    email: "crystal@example.com",
    phone: "(555) 567-8901",
    department: "Meat Market",
    role: "Associate",
    hireDate: "2019-11-15",
    position: "Cleanup",
  },
  {
    id: "emp-jamey",
    name: "Jamey",
    email: "jamey@example.com",
    phone: "(555) 678-9012",
    department: "Meat Market",
    role: "Associate",
    hireDate: "2022-02-20",
    position: "Meat Cutter",
  },
  {
    id: "emp-roland",
    name: "Roland",
    email: "rnisley7361@gmail.com",
    phone: "(555) 789-0123",
    department: "Meat Market",
    role: "Associate",
    hireDate: "2020-07-12",
    position: "Meat Cutter",
  },
  {
    id: "emp-taylor",
    name: "Taylor",
    email: "taylor@example.com",
    phone: "(555) 890-1234",
    department: "Meat Market",
    role: "Associate",
    hireDate: "2021-09-03",
    position: "Trainee",
  },
]

// Other department employees
const OTHER_EMPLOYEES: Employee[] = [
  {
    id: "emp001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    department: "Deli",
    role: "Associate",
    hireDate: "2021-03-15",
  },
  {
    id: "emp002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 234-5678",
    department: "Produce",
    role: "Associate",
    hireDate: "2020-06-22",
  },
  {
    id: "emp003",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "(555) 345-6789",
    department: "Grocery",
    role: "Manager",
    hireDate: "2019-11-05",
  },
  {
    id: "emp004",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    phone: "(555) 456-7890",
    department: "Cashier",
    role: "Associate",
    hireDate: "2022-01-10",
  },
  {
    id: "emp005",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    phone: "(555) 567-8901",
    department: "Deli",
    role: "Associate",
    hireDate: "2021-08-17",
  },
  {
    id: "emp006",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    phone: "(555) 678-9012",
    department: "Produce",
    role: "Associate",
    hireDate: "2020-04-30",
  },
]

// Combine all employees
const ALL_EMPLOYEES: Employee[] = [...MEAT_MARKET_EMPLOYEES, ...OTHER_EMPLOYEES]

export default function EmployeesPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
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
    setIsLoading(false)
  }, [router])

  // Apply filters to employee data
  const filteredEmployees = ALL_EMPLOYEES.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.position && employee.position.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  // Check if the current user is Roland
  const isRoland = userEmail === "rnisley7361@gmail.com"

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
            {(userRole === "manager" || userRole === "admin") && (
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
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
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
                <div className="w-full md:w-48">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>{departmentFilter === "all" ? "All Departments" : departmentFilter}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Meat Market">Meat Market</SelectItem>
                      <SelectItem value="Deli">Deli</SelectItem>
                      <SelectItem value="Produce">Produce</SelectItem>
                      <SelectItem value="Grocery">Grocery</SelectItem>
                      <SelectItem value="Cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                        {employee.position && <div className="text-xs text-muted-foreground">{employee.position}</div>}
                      </div>
                    </div>
                    <div className="mb-2 md:mb-0">
                      <div>{employee.email}</div>
                      <div className="text-sm text-muted-foreground">{employee.phone}</div>
                    </div>
                    <div className="mb-2 md:mb-0">
                      <Badge
                        variant="outline"
                        className={
                          employee.department === "Meat Market"
                            ? "bg-red-50"
                            : employee.department === "Deli"
                              ? "bg-yellow-50"
                              : employee.department === "Produce"
                                ? "bg-green-50"
                                : employee.department === "Grocery"
                                  ? "bg-blue-50"
                                  : "bg-purple-50"
                        }
                      >
                        {employee.department}
                      </Badge>
                    </div>
                    <div className="mb-2 md:mb-0">
                      <Badge variant={employee.role === "Manager" ? "default" : "outline"}>{employee.role}</Badge>
                    </div>
                    <div className="flex justify-end">
                      {userRole === "manager" || userRole === "admin" || isRoland ? (
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
                            {(userRole === "manager" || userRole === "admin") && (
                              <DropdownMenuItem onClick={() => router.push(`/employees/${employee.id}/edit`)}>
                                Edit
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/schedule?employee=${employee.name}`)}>
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
