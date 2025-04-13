"use server"

import { createServerSupabaseClient } from "./supabase"
import { hashPassword } from "./auth-utils"

export async function seedInitialUsers() {
  const supabase = createServerSupabaseClient()
  const results = {
    admin: { success: false, message: "" },
    manager: { success: false, message: "" },
  }

  try {
    // Check if admin user already exists
    const { data: existingAdmin } = await supabase.from("users").select("id").eq("email", "admin").single()

    if (existingAdmin) {
      console.log("Admin user already exists")
      results.admin = { success: true, message: "Admin user already exists" }
    } else {
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
        results.admin = { success: false, message: "Failed to create admin user" }
      } else {
        results.admin = { success: true, message: "Admin user created successfully" }
      }
    }

    // Check if manager user already exists
    const { data: existingManager } = await supabase
      .from("users")
      .select("id")
      .eq("email", "Shanehawley2191@hotmail.com")
      .single()

    if (existingManager) {
      console.log("Manager user already exists")
      results.manager = { success: true, message: "Manager user already exists" }
    } else {
      // Create manager user with a default password
      // In a real app, you'd want to set up a password reset flow
      const MANAGER_PASSWORD = "ManagerPassword123"
      const passwordHash = await hashPassword(MANAGER_PASSWORD)

      const { error } = await supabase.from("users").insert({
        name: "Shane Hawley",
        email: "Shanehawley2191@hotmail.com",
        password_hash: passwordHash,
        role: "manager",
        department: "Sales",
        hire_date: new Date().toISOString().split("T")[0],
      })

      if (error) {
        console.error("Error creating manager user:", error)
        results.manager = { success: false, message: "Failed to create manager user" }
      } else {
        results.manager = { success: true, message: "Manager user created successfully" }
      }
    }

    return results
  } catch (error) {
    console.error("Error in seedInitialUsers:", error)
    return {
      admin: { success: false, message: "An error occurred while creating users" },
      manager: { success: false, message: "An error occurred while creating users" },
    }
  }
}
