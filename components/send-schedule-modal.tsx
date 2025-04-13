"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import type { ShiftData } from "./shift-modal"

interface SendScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  scheduleData: ShiftData[]
  startDate?: Date
  endDate?: Date
}

// Meat Market employees with contact info
const MEAT_MARKET_EMPLOYEES = [
  { name: "Shane", email: "shane@example.com", phone: "555-123-4567" },
  { name: "James", email: "james@example.com", phone: "555-234-5678" },
  { name: "Randy", email: "randy@example.com", phone: "555-345-6789" },
  { name: "David", email: "david@example.com", phone: "555-456-7890" },
  { name: "Crystal", email: "crystal@example.com", phone: "555-567-8901" },
  { name: "Jamey", email: "jamey@example.com", phone: "555-678-9012" },
  { name: "Roland", email: "roland@example.com", phone: "555-789-0123" },
  { name: "Taylor", email: "taylor@example.com", phone: "555-890-1234" },
]

export function SendScheduleModal({ isOpen, onClose, scheduleData, startDate, endDate }: SendScheduleModalProps) {
  const [sendMethod, setSendMethod] = useState<"email" | "sms" | "both">("email")
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(MEAT_MARKET_EMPLOYEES.map((emp) => emp.name))
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(MEAT_MARKET_EMPLOYEES.map((emp) => emp.name))
    } else {
      setSelectedEmployees([])
    }
  }

  const toggleEmployee = (employee: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, employee])
    } else {
      setSelectedEmployees((prev) => prev.filter((emp) => emp !== employee))
    }
  }

  const handleSend = async () => {
    setIsLoading(true)

    // Simulate sending the schedule
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Format date range for the message
    const dateRange =
      startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : "current schedule"

    // Show success message
    toast({
      title: "Schedule Sent Successfully",
      description: `The ${dateRange} has been sent to ${selectedEmployees.length} employee(s) via ${sendMethod === "both" ? "email and SMS" : sendMethod}.`,
    })

    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Schedule</DialogTitle>
          <DialogDescription>Send the current schedule to selected employees via email or SMS.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Send Method</h3>
            <RadioGroup value={sendMethod} onValueChange={(value) => setSendMethod(value as "email" | "sms" | "both")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms">SMS only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Both Email and SMS</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Select Employees</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedEmployees.length === MEAT_MARKET_EMPLOYEES.length}
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                />
                <Label htmlFor="select-all">Select All</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {MEAT_MARKET_EMPLOYEES.map((employee) => (
                <div key={employee.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`employee-${employee.name}`}
                    checked={selectedEmployees.includes(employee.name)}
                    onCheckedChange={(checked) => toggleEmployee(employee.name, checked === true)}
                  />
                  <Label htmlFor={`employee-${employee.name}`}>{employee.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Schedule Summary</h3>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p>
                <span className="font-medium">Date Range:</span>{" "}
                {startDate && endDate
                  ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                  : "Current schedule period"}
              </p>
              <p>
                <span className="font-medium">Total Shifts:</span> {scheduleData.length}
              </p>
              <p>
                <span className="font-medium">Departments:</span> Meat Market
                {scheduleData.some((shift) => shift.department !== "Meat Market") && ", Others"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isLoading || selectedEmployees.length === 0}>
            {isLoading ? "Sending..." : "Send Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
