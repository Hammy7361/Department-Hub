import { NextResponse } from "next/server"
import { seedInitialUsers } from "@/lib/seed-admin"

export async function GET() {
  try {
    const results = await seedInitialUsers()

    return NextResponse.json(
      {
        admin: results.admin,
        manager: results.manager,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in seed-users route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
