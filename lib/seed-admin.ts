"use server"

import { createServerSupabaseClient } from "./supabase"
import { hashPassword } from "./auth-utils"

export async function seedAdminUser() {
  const supabase = createServerSupabaseClient()

  try {
    // Check if admin user already exists
    const { data: existingAdmin } = await supabase.from("users").select("id").eq("email", "admin").single()

    if (existingAdmin) {
      console.log("Admin user already exists")
      return { success: true, message: "Admin user already exists" }
    }

    // Create admin user with special password
    const ADMIN_PASSWORD = "]tY~J%y-\\zhQOW(Zj0*h"
    const passwordHash = await hashPassword(ADMIN_PASSWORD)

    const { error } = await supabase.from("users").insert({
      name: "System Administrator",
      email: "admin",
      password_hash: passwordHash,
      role: "admin",
      department: "IT",
      hire_date: new Date().toISOString().split("T")[0],
    })

    if (error) {
      console.error("Error creating admin user:", error)
      return { success: false, message: "Failed to create admin user" }
    }

    return { success: true, message: "Admin user created successfully" }
  } catch (error) {
    console.error("Error in seedAdminUser:", error)
    return { success: false, message: "An error occurred while creating admin user" }
  }
}
