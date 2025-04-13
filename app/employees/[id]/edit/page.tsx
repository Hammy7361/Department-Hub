"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save } from "lucide-react"

// Import our employee data structure
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

export default function EditEmployeePage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [employeeData, setEmployeeData] = useState<Employee | null>(null)

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

    // Get user role
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    // Check if user has permission to edit employees
    if (role !== "admin" && role !== "manager") {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit employee profiles.",
        variant: "destructive",
      })
      router.push("/employees")
      return
    }

    // Find the employee by ID
    const foundEmployee = ALL_EMPLOYEES.find((emp) => emp.id === employeeId)
    if (foundEmployee) {
      setEmployeeData(foundEmployee)
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
  }, [router, employeeId])

  const handleInputChange = (field: keyof Employee, value: string) => {
    if (employeeData) {
      setEmployeeData({
        ...employeeData,
        [field]: value,
      })
    }
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate saving to database
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "The employee profile has been updated successfully.",
      })
      setIsSaving(false)
      router.push(`/employees/${employeeId}`)
    }, 1000)
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

  if (!employeeData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Employee not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push(`/employees/${employeeId}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Edit Employee</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the employee's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={employeeData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={employeeData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={employeeData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire-date">Hire Date</Label>
                <Input
                  id="hire-date"
                  type="date"
                  value={employeeData.hireDate}
                  onChange={(e) => handleInputChange("hireDate", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department & Role</CardTitle>
                <CardDescription>Update department and position information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={employeeData.department}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meat Market">Meat Market</SelectItem>
                      <SelectItem value="Deli">Deli</SelectItem>
                      <SelectItem value="Produce">Produce</SelectItem>
                      <SelectItem value="Grocery">Grocery</SelectItem>
                      <SelectItem value="Cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={employeeData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Associate">Associate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {employeeData.department === "Meat Market" && (
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select
                      value={employeeData.position || ""}
                      onValueChange={(value) => handleInputChange("position", value)}
                    >
                      <SelectTrigger id="position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                        <SelectItem value="Meat Cutter">Meat Cutter</SelectItem>
                        <SelectItem value="Cleanup">Cleanup</SelectItem>
                        <SelectItem value="Trainee">Trainee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Update contact and personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={employeeData.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input
                    id="emergency-contact"
                    value={employeeData.emergencyContact || ""}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={employeeData.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
