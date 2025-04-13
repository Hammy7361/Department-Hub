"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit2, Trash2 } from "lucide-react"
import { mockScheduleData } from "@/lib/mock-data"
import { ShiftModal, type ShiftData } from "@/components/shift-modal"
import { toast } from "@/components/ui/use-toast"
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
import { SendScheduleModal } from "@/components/send-schedule-modal"

// Local storage key for shifts
const SHIFTS_STORAGE_KEY = "department-hub-shifts"

export default function SchedulePage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState("week")
  const [scheduleData, setScheduleData] = useState<ShiftData[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentShift, setCurrentShift] = useState<ShiftData | undefined>(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [employeeFilter, setEmployeeFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [shiftToDelete, setShiftToDelete] = useState<string | undefined>(undefined)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)

  const router = useRouter()

  // Load shifts from localStorage on component mount
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

    // Try to load shifts from localStorage first
    const savedShifts = localStorage.getItem(SHIFTS_STORAGE_KEY)

    if (savedShifts) {
      try {
        const parsedShifts = JSON.parse(savedShifts)
        setScheduleData(parsedShifts)
        setIsLoading(false)
        return
      } catch (error) {
        console.error("Error parsing saved shifts:", error)
        // If there's an error parsing, we'll fall back to mock data
      }
    }

    // If no saved shifts or error parsing, use mock data
    const dataWithIds = mockScheduleData.map((shift, index) => ({
      ...shift,
      id: `shift-${index + 1}`,
    }))
    setScheduleData(dataWithIds)
    setIsLoading(false)
  }, [router])

  // Save shifts to localStorage whenever scheduleData changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(SHIFTS_STORAGE_KEY, JSON.stringify(scheduleData))
    }
  }, [scheduleData, isLoading])

  useEffect(() => {
    // Reset employee filter when department filter changes
    if (departmentFilter === "Meat Market") {
      if (
        employeeFilter !== "all" &&
        !["Shane", "James", "Randy", "David", "Crystal", "Jamey", "Roland", "Taylor"].includes(employeeFilter)
      ) {
        setEmployeeFilter("all")
      }
    } else if (
      departmentFilter !== "all" &&
      employeeFilter !== "all" &&
      ["Shane", "James", "Randy", "David", "Crystal", "Jamey", "Roland", "Taylor"].includes(employeeFilter)
    ) {
      setEmployeeFilter("all")
    }
  }, [departmentFilter, employeeFilter])

  const handleCreateShift = () => {
    setCurrentShift(undefined)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleEditShift = (shift: ShiftData) => {
    setCurrentShift(shift)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDeleteShift = (shiftId: string) => {
    setShiftToDelete(shiftId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteShift = () => {
    if (shiftToDelete) {
      const updatedShifts = scheduleData.filter((shift) => shift.id !== shiftToDelete)
      setScheduleData(updatedShifts)
      toast({
        title: "Shift Deleted",
        description: "The shift has been removed from the schedule.",
      })
      setIsDeleteDialogOpen(false)
    }
  }

  const handleSaveShift = (shiftData: ShiftData) => {
    let updatedShifts: ShiftData[] = []

    if (isEditing && currentShift?.id) {
      // Update existing shift
      updatedShifts = scheduleData.map((shift) =>
        shift.id === currentShift.id ? { ...shiftData, id: currentShift.id } : shift,
      )
      setScheduleData(updatedShifts)
      toast({
        title: "Shift Updated",
        description: "The shift has been updated successfully.",
      })
    } else {
      // Create new shift
      const newShift = {
        ...shiftData,
        id: `shift-${Date.now()}`,
      }
      updatedShifts = [...scheduleData, newShift]
      setScheduleData(updatedShifts)
      toast({
        title: "Shift Created",
        description: "A new shift has been added to the schedule.",
      })
    }

    // Save to localStorage immediately
    localStorage.setItem(SHIFTS_STORAGE_KEY, JSON.stringify(updatedShifts))
    setIsModalOpen(false)
  }

  // Reset all shifts to default mock data
  const handleResetShifts = () => {
    const dataWithIds = mockScheduleData.map((shift, index) => ({
      ...shift,
      id: `shift-${index + 1}`,
    }))
    setScheduleData(dataWithIds)
    localStorage.setItem(SHIFTS_STORAGE_KEY, JSON.stringify(dataWithIds))
    toast({
      title: "Schedule Reset",
      description: "The schedule has been reset to default data.",
    })
  }

  const getDateRange = () => {
    if (view === "day") {
      return { startDate: date, endDate: date }
    } else if (view === "week") {
      const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())
      const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6)
      return { startDate, endDate }
    } else {
      // Month view
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      return { startDate, endDate }
    }
  }

  // Apply filters to schedule data
  const filteredScheduleData = scheduleData.filter((shift) => {
    const matchesEmployee = employeeFilter === "all" || shift.employee === employeeFilter
    const matchesDepartment = departmentFilter === "all" || shift.department === departmentFilter
    return matchesEmployee && matchesDepartment
  })

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
            <h1 className="text-3xl font-bold">Schedule</h1>
            <p className="text-muted-foreground">View and manage work schedules</p>
          </div>
          <div className="flex items-center gap-2">
            {(userRole === "manager" || userRole === "admin") && (
              <>
                <Button onClick={handleCreateShift}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Shift
                </Button>
                <Button variant="secondary" onClick={() => setIsSendModalOpen(true)}>
                  Send Schedule
                </Button>
                <Button variant="outline" onClick={handleResetShifts}>
                  Reset Schedule
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Date</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="rounded-md border w-full max-w-[280px]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="employee" className="text-sm font-medium">
                    Employee
                  </label>
                  <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {departmentFilter === "Meat Market" ? (
                        <>
                          <SelectItem value="Shane">Shane</SelectItem>
                          <SelectItem value="James">James</SelectItem>
                          <SelectItem value="Randy">Randy</SelectItem>
                          <SelectItem value="David">David</SelectItem>
                          <SelectItem value="Crystal">Crystal</SelectItem>
                          <SelectItem value="Jamey">Jamey</SelectItem>
                          <SelectItem value="Roland">Roland</SelectItem>
                          <SelectItem value="Taylor">Taylor</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="John Doe">John Doe</SelectItem>
                          <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                          <SelectItem value="Bob Johnson">Bob Johnson</SelectItem>
                          <SelectItem value="Alice Williams">Alice Williams</SelectItem>
                          <SelectItem value="Charlie Brown">Charlie Brown</SelectItem>
                          <SelectItem value="Diana Prince">Diana Prince</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">
                    Department
                  </label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
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
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Work Schedule</CardTitle>
                  <CardDescription>
                    {view === "day"
                      ? `${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`
                      : view === "week"
                        ? `Week of ${new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay()).toLocaleDateString("en-US", { month: "long", day: "numeric" })} - ${new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
                        : `${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
                  </CardDescription>
                </div>
                <Tabs defaultValue="week" onValueChange={setView} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {view === "week" && (
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-7 bg-muted text-center py-2 font-medium border-b">
                      <div>Sun</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 min-h-[500px]">
                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const currentDay = new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate() - date.getDay() + dayIndex,
                        )
                        const currentDayStr = currentDay.toISOString().split("T")[0]

                        return (
                          <div key={dayIndex} className="border-r last:border-r-0 p-2 relative">
                            <div className="text-xs text-muted-foreground mb-2">
                              {currentDay.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
                            </div>
                            {filteredScheduleData
                              .filter((shift) => shift.date === currentDayStr)
                              .map((shift) => (
                                <div
                                  key={shift.id}
                                  className={`mb-1 p-2 rounded-md text-xs relative group ${
                                    shift.department === "Meat Market"
                                      ? "bg-red-100"
                                      : shift.department === "Deli"
                                        ? "bg-yellow-100"
                                        : shift.department === "Produce"
                                          ? "bg-green-100"
                                          : shift.department === "Grocery"
                                            ? "bg-blue-100"
                                            : "bg-purple-100"
                                  }`}
                                >
                                  <div className="font-medium">{shift.employee}</div>
                                  <div>
                                    {shift.startTime} - {shift.endTime}
                                  </div>
                                  <div className="text-muted-foreground">{shift.department}</div>
                                  {shift.position && <div className="text-xs italic">{shift.position}</div>}
                                  {(userRole === "manager" || userRole === "admin") && (
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 p-0"
                                        onClick={() => handleEditShift(shift)}
                                      >
                                        <Edit2 className="h-3 w-3" />
                                        <span className="sr-only">Edit</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 p-0 text-red-500"
                                        onClick={() => handleDeleteShift(shift.id!)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            {(userRole === "manager" || userRole === "admin") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-1 h-6 text-xs border border-dashed border-gray-300 hover:border-gray-400"
                                onClick={() => {
                                  setCurrentShift({
                                    employee: "",
                                    date: currentDayStr,
                                    startTime: "09:00",
                                    endTime: "17:00",
                                    hours: 8,
                                    department: "",
                                    position: "",
                                  })
                                  setIsEditing(false)
                                  setIsModalOpen(true)
                                }}
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {view === "day" && (
                  <div className="border rounded-md">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">
                          Shifts for{" "}
                          {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </h3>
                        {(userRole === "manager" || userRole === "admin") && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setCurrentShift({
                                employee: "",
                                date: date.toISOString().split("T")[0],
                                startTime: "09:00",
                                endTime: "17:00",
                                hours: 8,
                                department: "",
                                position: "",
                              })
                              setIsEditing(false)
                              setIsModalOpen(true)
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add Shift
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        {filteredScheduleData
                          .filter((shift) => shift.date === date.toISOString().split("T")[0])
                          .map((shift) => (
                            <div
                              key={shift.id}
                              className="flex items-center justify-between p-3 border rounded-md group"
                            >
                              <div>
                                <div className="font-medium">{shift.employee}</div>
                                <div className="text-sm text-muted-foreground">{shift.department}</div>
                                {shift.position && <div className="text-xs italic">{shift.position}</div>}
                              </div>
                              <div className="text-right">
                                <div>
                                  {shift.startTime} - {shift.endTime}
                                </div>
                                <div className="text-sm text-muted-foreground">{shift.hours} hours</div>
                              </div>
                              {(userRole === "manager" || userRole === "admin") && (
                                <div className="ml-4 flex gap-2 opacity-0 group-hover:opacity-100">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditShift(shift)}>
                                    <Edit2 className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500"
                                    onClick={() => handleDeleteShift(shift.id!)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        {filteredScheduleData.filter((shift) => shift.date === date.toISOString().split("T")[0])
                          .length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">No shifts scheduled for this day</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {view === "month" && (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-7 gap-px bg-muted">
                      <div className="bg-muted text-center py-2 font-medium">Sun</div>
                      <div className="bg-muted text-center py-2 font-medium">Mon</div>
                      <div className="bg-muted text-center py-2 font-medium">Tue</div>
                      <div className="bg-muted text-center py-2 font-medium">Wed</div>
                      <div className="bg-muted text-center py-2 font-medium">Thu</div>
                      <div className="bg-muted text-center py-2 font-medium">Fri</div>
                      <div className="bg-muted text-center py-2 font-medium">Sat</div>

                      {Array.from({ length: 35 }).map((_, dayIndex) => {
                        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
                        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
                        const dayNumber = dayIndex - firstDayOfMonth + 1
                        const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth

                        // Create date string for this day in the month view
                        const currentMonthDay = isCurrentMonth
                          ? new Date(date.getFullYear(), date.getMonth(), dayNumber).toISOString().split("T")[0]
                          : ""

                        return (
                          <div
                            key={dayIndex}
                            className={`bg-background p-2 min-h-[100px] relative ${!isCurrentMonth ? "text-muted-foreground bg-muted/30" : ""}`}
                          >
                            <div className="text-xs font-medium mb-1 flex justify-between">
                              <span>{isCurrentMonth ? dayNumber : ""}</span>
                              {isCurrentMonth && (userRole === "manager" || userRole === "admin") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 opacity-0 hover:opacity-100 focus:opacity-100"
                                  onClick={() => {
                                    setCurrentShift({
                                      employee: "",
                                      date: currentMonthDay,
                                      startTime: "09:00",
                                      endTime: "17:00",
                                      hours: 8,
                                      department: "",
                                      position: "",
                                    })
                                    setIsEditing(false)
                                    setIsModalOpen(true)
                                  }}
                                >
                                  <PlusCircle className="h-3 w-3" />
                                  <span className="sr-only">Add Shift</span>
                                </Button>
                              )}
                            </div>
                            {isCurrentMonth &&
                              filteredScheduleData
                                .filter((shift) => shift.date === currentMonthDay)
                                .map((shift) => (
                                  <div
                                    key={shift.id}
                                    className={`mb-1 p-1 rounded-md text-xs group cursor-pointer ${
                                      shift.department === "Meat Market"
                                        ? "bg-red-100"
                                        : shift.department === "Deli"
                                          ? "bg-yellow-100"
                                          : shift.department === "Produce"
                                            ? "bg-green-100"
                                            : shift.department === "Grocery"
                                              ? "bg-blue-100"
                                              : "bg-purple-100"
                                    }`}
                                    onClick={() =>
                                      (userRole === "manager" || userRole === "admin") && handleEditShift(shift)
                                    }
                                  >
                                    <div className="truncate">{shift.employee}</div>
                                    <div className="truncate text-[10px]">
                                      {shift.startTime}-{shift.endTime}
                                    </div>
                                    {shift.position && (
                                      <div className="truncate text-[10px] italic">{shift.position}</div>
                                    )}
                                  </div>
                                ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Shift Modal */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveShift}
        initialData={currentShift}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shift</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this shift? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteShift} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Schedule Modal */}
      <SendScheduleModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        scheduleData={filteredScheduleData}
        startDate={getDateRange().startDate}
        endDate={getDateRange().endDate}
      />
    </DashboardLayout>
  )
}
