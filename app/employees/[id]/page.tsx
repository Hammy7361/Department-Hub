"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Mail, Phone, Clock, ArrowLeft, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Import our employee data
interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  role: string
  hireDate: string
  position?: string
  address?: string
  emergencyContact?: string
  bio?: string
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
    address: "123 Main St, Hanceville, AL",
    emergencyContact: "Jane Doe (555) 987-6543",
    bio: "Department manager with over 10 years of experience in the meat industry.",
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
    address: "456 Oak Ave, Hanceville, AL",
    emergencyContact: "John Smith (555) 876-5432",
    bio: "Assistant manager responsible for inventory management and staff scheduling.",
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
    address: "789 Pine St, Hanceville, AL",
    emergencyContact: "Mary Johnson (555) 765-4321",
    bio: "Experienced meat cutter specializing in custom cuts and special orders.",
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
    address: "101 Elm St, Hanceville, AL",
    emergencyContact: "Robert Brown (555) 654-3210",
    bio: "Meat cutter with expertise in beef and pork preparation.",
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
    address: "202 Maple Ave, Hanceville, AL",
    emergencyContact: "Sarah Wilson (555) 543-2109",
    bio: "Responsible for maintaining cleanliness and sanitation standards in the department.",
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
    address: "303 Cedar Ln, Hanceville, AL",
    emergencyContact: "Michael Davis (555) 432-1098",
    bio: "Skilled meat cutter with a focus on quality and presentation.",
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
    address: "404 Birch St, Hanceville, AL",
    emergencyContact: "Jennifer Taylor (555) 321-0987",
    bio: "Experienced meat cutter with excellent customer service skills.",
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
    address: "505 Walnut Dr, Hanceville, AL",
    emergencyContact: "Christopher Miller (555) 210-9876",
    bio: "New team member learning all aspects of meat department operations.",
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
    address: "606 Cherry St, Hanceville, AL",
    emergencyContact: "Jane Doe (555) 987-6543",
    bio: "Deli associate with expertise in sandwich preparation and customer service.",
  },
  {
    id: "emp002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 234-5678",
    department: "Produce",
    role: "Associate",
    hireDate: "2020-06-22",
    address: "707 Apple Rd, Hanceville, AL",
    emergencyContact: "John Smith (555) 876-5432",
    bio: "Produce associate responsible for maintaining fresh fruit and vegetable displays.",
  },
  {
    id: "emp003",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "(555) 345-6789",
    department: "Grocery",
    role: "Manager",
    hireDate: "2019-11-05",
    address: "808 Peach Ave, Hanceville, AL",
    emergencyContact: "Mary Johnson (555) 765-4321",
    bio: "Grocery department manager overseeing inventory and staff scheduling.",
  },
  {
    id: "emp004",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    phone: "(555) 456-7890",
    department: "Cashier",
    role: "Associate",
    hireDate: "2022-01-10",
    address: "909 Plum St, Hanceville, AL",
    emergencyContact: "Robert Williams (555) 654-3210",
    bio: "Cashier with excellent customer service skills and attention to detail.",
  },
  {
    id: "emp005",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    phone: "(555) 567-8901",
    department: "Deli",
    role: "Associate",
    hireDate: "2021-08-17",
    address: "1010 Orange Ln, Hanceville, AL",
    emergencyContact: "Lucy Brown (555) 543-2109",
    bio: "Deli associate specializing in prepared foods and catering orders.",
  },
  {
    id: "emp006",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    phone: "(555) 678-9012",
    department: "Produce",
    role: "Associate",
    hireDate: "2020-04-30",
    address: "1111 Grape Dr, Hanceville, AL",
    emergencyContact: "Steve Trevor (555) 432-1098",
    bio: "Produce associate with knowledge of organic and specialty produce items.",
  },
]

// Combine all employees
const ALL_EMPLOYEES: Employee[] = [...MEAT_MARKET_EMPLOYEES, ...OTHER_EMPLOYEES]

export default function EmployeeProfilePage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const { toast } = useToast()

  const router = useRouter()
  const params = useParams()
  const employeeId = params.id as string

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

    // Find the employee by ID
    const foundEmployee = ALL_EMPLOYEES.find((emp) => emp.id === employeeId)
    if (foundEmployee) {
      setEmployee(foundEmployee)
    } else {
      // If employee not found, redirect to employees list
      toast({
        title: "Employee Not Found",
        description: "The requested employee profile could not be found.",
        variant: "destructive",
      })
      router.push("/employees")
    }

    setIsLoading(false)
  }, [router, employeeId, toast])

  // Check if the current user is Roland
  const isRoland = userEmail === "rnisley7361@gmail.com"

  // Check if user has permission to view this profile
  const canViewProfile =
    userRole === "admin" || userRole === "manager" || isRoland || (employee && userEmail === employee.email)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Employee not found</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!canViewProfile) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p>You don't have permission to view this profile</p>
          <Button onClick={() => router.push("/employees")}>Back to Employees</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/employees")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Employee Profile</h1>
          </div>
          {(userRole === "admin" || userRole === "manager") && (
            <Button onClick={() => router.push(`/employees/${employee.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt={employee.name} />
                <AvatarFallback>
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{employee.name}</h2>
              <p className="text-muted-foreground mb-2">{employee.email}</p>
              <Badge
                variant={
                  employee.role === "Admin" ? "destructive" : employee.role === "Manager" ? "default" : "outline"
                }
                className="mb-2"
              >
                {employee.role}
              </Badge>
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
              {employee.position && <p className="mt-2 text-sm text-muted-foreground">{employee.position}</p>}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Information</CardTitle>
                    <CardDescription>Basic details and employment information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p>{employee.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                        <p>{employee.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Department</p>
                        <p>{employee.department}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Position</p>
                        <p>{employee.position || employee.role}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Hire Date</p>
                        <p>{new Date(employee.hireDate).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Employment Status</p>
                        <p>Full-time</p>
                      </div>
                    </div>

                    {employee.bio && (
                      <div className="space-y-1 pt-2 border-t">
                        <p className="text-sm font-medium text-muted-foreground">Bio</p>
                        <p className="text-sm">{employee.bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Schedule</CardTitle>
                    <CardDescription>Current and upcoming shifts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">This Week</h3>
                      </div>

                      <div className="border rounded-md divide-y">
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">Monday</p>
                            <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                          </div>
                          <Badge>8 hours</Badge>
                        </div>
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">Wednesday</p>
                            <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                          </div>
                          <Badge>8 hours</Badge>
                        </div>
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">Friday</p>
                            <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                          </div>
                          <Badge>8 hours</Badge>
                        </div>
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">Saturday</p>
                            <p className="text-sm text-muted-foreground">10:00 AM - 6:00 PM</p>
                          </div>
                          <Badge>8 hours</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-sm font-medium">Total Hours: 32</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/schedule?employee=${employee.name}`)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          View Full Schedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>How to reach this employee</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p>{employee.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Phone</p>
                          <p>{employee.phone}</p>
                        </div>
                      </div>
                    </div>

                    {employee.address && (
                      <div className="space-y-1 pt-2 border-t">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{employee.address}</p>
                      </div>
                    )}

                    {employee.emergencyContact && (
                      <div className="space-y-1 pt-2 border-t">
                        <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                        <p>{employee.emergencyContact}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
