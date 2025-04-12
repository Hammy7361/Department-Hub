import { NextResponse } from "next/server"
import { seedAdminUser } from "@/lib/seed-admin"

export async function GET() {
  try {
    const result = await seedAdminUser()

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 })
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in seed-admin route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
