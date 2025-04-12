"use server"

import { createServerSupabaseClient } from "./supabase"
import crypto from "crypto"

// Hash password using SHA-256 with salt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

// Verify password against stored hash
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, storedHash] = hashedPassword.split(":")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return storedHash === hash
}

// User authentication server action
export async function authenticateUser(email: string, password: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Get user from database
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Check if this is the admin account
    if (email === "admin") {
      // For admin, we'll keep the special password check
      const ADMIN_PASSWORD = "]tY~J%y-\\zhQOW(Zj0*h"
      if (password === ADMIN_PASSWORD) {
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        }
      }
      return { success: false, message: "Invalid email or password" }
    }

    // Verify password for regular users
    const isValidPassword = verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, message: "Invalid email or password" }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, message: "An error occurred during authentication" }
  }
}

// Registration request server action
export async function createRegistrationRequest(userData: {
  name: string
  email: string
  password: string
  department: string
  phone?: string
}) {
  const supabase = createServerSupabaseClient()

  try {
    // Hash the password
    const passwordHash = hashPassword(userData.password)

    // Check if email already exists in users table
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", userData.email).single()

    if (existingUser) {
      return { success: false, message: "Email already registered" }
    }

    // Check if email already exists in registration_requests table
    const { data: existingRequest } = await supabase
      .from("registration_requests")
      .select("id")
      .eq("email", userData.email)
      .eq("status", "pending")
      .single()

    if (existingRequest) {
      return { success: false, message: "Registration request already pending" }
    }

    // Create registration request
    const { error } = await supabase.from("registration_requests").insert({
      name: userData.name,
      email: userData.email,
      password_hash: passwordHash,
      department: userData.department,
      phone: userData.phone || null,
      status: "pending",
    })

    if (error) {
      console.error("Registration request error:", error)
      return { success: false, message: "Failed to create registration request" }
    }

    return { success: true, message: "Registration request submitted successfully" }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "An error occurred during registration" }
  }
}

// Admin actions for registration requests
export async function approveRegistrationRequest(requestId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Get the registration request
    const { data: request, error: requestError } = await supabase
      .from("registration_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (requestError || !request) {
      return { success: false, message: "Registration request not found" }
    }

    // Create user from the request
    const { error: userError } = await supabase.from("users").insert({
      name: request.name,
      email: request.email,
      password_hash: request.password_hash,
      department: request.department,
      phone: request.phone,
      role: "associate", // Default role
      hire_date: new Date().toISOString().split("T")[0], // Current date
    })

    if (userError) {
      console.error("User creation error:", userError)
      return { success: false, message: "Failed to create user account" }
    }

    // Update request status
    const { error: updateError } = await supabase
      .from("registration_requests")
      .update({ status: "approved" })
      .eq("id", requestId)

    if (updateError) {
      console.error("Request update error:", updateError)
      return { success: false, message: "Failed to update request status" }
    }

    return { success: true, message: "User account created successfully" }
  } catch (error) {
    console.error("Approval error:", error)
    return { success: false, message: "An error occurred during approval" }
  }
}

export async function rejectRegistrationRequest(requestId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Update request status
    const { error } = await supabase.from("registration_requests").update({ status: "rejected" }).eq("id", requestId)

    if (error) {
      console.error("Request update error:", error)
      return { success: false, message: "Failed to update request status" }
    }

    return { success: true, message: "Registration request rejected" }
  } catch (error) {
    console.error("Rejection error:", error)
    return { success: false, message: "An error occurred during rejection" }
  }
}

// Get user profile data
export async function getUserProfile(userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Get user profile error:", error)
      return { success: false, message: "Failed to fetch user profile" }
    }

    return {
      success: true,
      profile: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        phone: data.phone,
        address: data.address,
        emergency_contact: data.emergency_contact,
        bio: data.bio,
        hire_date: data.hire_date,
      },
    }
  } catch (error) {
    console.error("Get profile error:", error)
    return { success: false, message: "An error occurred while fetching profile" }
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profileData: {
    name?: string
    phone?: string
    address?: string
    emergency_contact?: string
    bio?: string
  },
) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase
      .from("users")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Update profile error:", error)
      return { success: false, message: "Failed to update profile" }
    }

    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, message: "An error occurred while updating profile" }
  }
}
