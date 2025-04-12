"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit2 } from "lucide-react"
import { mockScheduleData } from "@/lib/mock-data"

export default function SchedulePage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState("week")
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
            {userRole === "manager" && (
              <Button onClick={() => router.push("/schedule/create")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Schedule
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="rounded-md border"
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
                  <Select defaultValue="all">
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="bob">Bob Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">
                    Department
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
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
                <Tabs defaultValue="week" onValueChange={setView}>
                  <TabsList>
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {view === "week" && (
                  <div className="border rounded-md">
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
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                        <div key={dayIndex} className="border-r last:border-r-0 p-2">
                          <div className="text-xs text-muted-foreground mb-2">
                            {new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate() - date.getDay() + dayIndex,
                            ).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
                          </div>
                          {mockScheduleData
                            .filter((shift) => {
                              const shiftDate = new Date(shift.date)
                              const currentDay = new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate() - date.getDay() + dayIndex,
                              )
                              return shiftDate.toDateString() === currentDay.toDateString()
                            })
                            .map((shift, index) => (
                              <div
                                key={index}
                                className={`mb-1 p-2 rounded-md text-xs ${
                                  shift.department === "Sales"
                                    ? "bg-blue-100"
                                    : shift.department === "Support"
                                      ? "bg-green-100"
                                      : "bg-purple-100"
                                }`}
                              >
                                <div className="font-medium">{shift.employee}</div>
                                <div>
                                  {shift.startTime} - {shift.endTime}
                                </div>
                                <div className="text-muted-foreground">{shift.department}</div>
                                {userRole === "manager" && (
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 mt-1">
                                    <Edit2 className="h-3 w-3" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                )}
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {view === "day" && (
                  <div className="border rounded-md">
                    <div className="p-4">
                      <h3 className="font-medium mb-4">
                        Shifts for{" "}
                        {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      </h3>
                      <div className="space-y-4">
                        {mockScheduleData
                          .filter((shift) => {
                            const shiftDate = new Date(shift.date)
                            return shiftDate.toDateString() === date.toDateString()
                          })
                          .map((shift, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                              <div>
                                <div className="font-medium">{shift.employee}</div>
                                <div className="text-sm text-muted-foreground">{shift.department}</div>
                              </div>
                              <div className="text-right">
                                <div>
                                  {shift.startTime} - {shift.endTime}
                                </div>
                                <div className="text-sm text-muted-foreground">{shift.hours} hours</div>
                              </div>
                              {userRole === "manager" && (
                                <Button variant="ghost" size="sm" className="ml-4">
                                  <Edit2 className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              )}
                            </div>
                          ))}
                        {mockScheduleData.filter((shift) => {
                          const shiftDate = new Date(shift.date)
                          return shiftDate.toDateString() === date.toDateString()
                        }).length === 0 && (
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

                        return (
                          <div
                            key={dayIndex}
                            className={`bg-background p-2 min-h-[100px] ${!isCurrentMonth ? "text-muted-foreground bg-muted/30" : ""}`}
                          >
                            <div className="text-xs font-medium mb-1">{isCurrentMonth ? dayNumber : ""}</div>
                            {isCurrentMonth &&
                              mockScheduleData
                                .filterer((shift) => {
                                  const shiftDate = new Date(shift.date)
                                  return (
                                    shiftDate.getDate() === dayNumber &&
                                    shiftDate.getMonth() === date.getMonth() &&
                                    shiftDate.getFullYear() === date.getFullYear()
                                  )
                                })
                                .map((shift, index) => (
                                  <div
                                    key={index}
                                    className={`mb-1 p-1 rounded-md text-xs ${
                                      shift.department === "Sales"
                                        ? "bg-blue-100"
                                        : shift.department === "Support"
                                          ? "bg-green-100"
                                          : "bg-purple-100"
                                    }`}
                                  >
                                    <div className="truncate">{shift.employee}</div>
                                    <div className="truncate text-[10px]">
                                      {shift.startTime}-{shift.endTime}
                                    </div>
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
    </DashboardLayout>
  )
}
