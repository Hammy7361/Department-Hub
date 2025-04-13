"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { mockEmployeeData } from "@/lib/mock-data"

export interface ShiftData {
  id?: string
  employee: string
  date: string
  startTime: string
  endTime: string
  hours: number
  department: string
}

interface ShiftModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (shift: ShiftData) => void
  initialData?: ShiftData
  isEditing?: boolean
}

export function ShiftModal({ isOpen, onClose, onSave, initialData, isEditing = false }: ShiftModalProps) {
  const [shift, setShift] = useState<ShiftData>({
    employee: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "17:00",
    hours: 8,
    department: "",
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    if (initialData) {
      setShift(initialData)
      setSelectedDate(new Date(initialData.date))
    } else {
      // Reset form for new shift
      setShift({
        employee: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "17:00",
        hours: 8,
        department: "",
      })
      setSelectedDate(new Date())
    }
  }, [initialData, isOpen])

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setShift({
        ...shift,
        date: date.toISOString().split("T")[0],
      })
    }
  }

  const calculateHours = (start: string, end: string) => {
    const startHour = Number.parseInt(start.split(":")[0])
    const startMinute = Number.parseInt(start.split(":")[1])
    const endHour = Number.parseInt(end.split(":")[0])
    const endMinute = Number.parseInt(end.split(":")[1])

    let hours = endHour - startHour
    let minutes = endMinute - startMinute

    if (minutes < 0) {
      hours -= 1
      minutes += 60
    }

    return hours + minutes / 60
  }

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    const updatedShift = { ...shift, [field]: value }

    // Calculate hours when both times are set
    if (updatedShift.startTime && updatedShift.endTime) {
      updatedShift.hours = calculateHours(updatedShift.startTime, updatedShift.endTime)
    }

    setShift(updatedShift)
  }

  const handleSave = () => {
    onSave(shift)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Shift" : "Create New Shift"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the shift details below." : "Add a new shift to the schedule."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employee
            </Label>
            <div className="col-span-3">
              <Select value={shift.employee} onValueChange={(value) => setShift({ ...shift, employee: value })}>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployeeData.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <div className="col-span-3">
              <Select value={shift.department} onValueChange={(value) => setShift({ ...shift, department: value })}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start Time
            </Label>
            <div className="col-span-3">
              <Input
                id="startTime"
                type="time"
                value={shift.startTime}
                onChange={(e) => handleTimeChange("startTime", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              End Time
            </Label>
            <div className="col-span-3">
              <Input
                id="endTime"
                type="time"
                value={shift.endTime}
                onChange={(e) => handleTimeChange("endTime", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hours" className="text-right">
              Hours
            </Label>
            <div className="col-span-3">
              <Input id="hours" type="number" value={shift.hours} readOnly className="bg-muted" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!shift.employee || !shift.department}>
            {isEditing ? "Update Shift" : "Create Shift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
