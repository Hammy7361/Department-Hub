"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CreateSchedulePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main schedule page since we now have interactive editing
    router.push("/schedule")
  }, [router])

  return null
}
