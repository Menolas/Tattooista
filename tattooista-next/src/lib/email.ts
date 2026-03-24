import nodemailer from "nodemailer"
import type { Booking } from "@prisma/client"

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const host = process.env.SMTP_HOST
    const port = parseInt(process.env.SMTP_PORT || "587", 10)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || !user || !pass) {
      throw new Error(
        "SMTP configuration is missing. Set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables."
      )
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
  }
  return transporter
}

const FROM_EMAIL = process.env.FROM_EMAIL || "Tattooista <noreply@tattooista.com>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${APP_URL}/verify-email?token=${token}`

  try {
    await getTransporter().sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your email - Tattooista",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your email</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: #fff; margin: 0; text-align: center;">Tattooista</h1>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Verify your email address</h2>
            <p>Thank you for registering with Tattooista! Please click the button below to verify your email address.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background: #1a1a1a; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email</a>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
            <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; margin: 0;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #999; font-size: 12px; word-break: break-all;">${verificationLink}</p>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error("Failed to send verification email:", err)
    return { error: "Failed to send verification email" }
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${APP_URL}/reset-password?token=${token}`

  try {
    await getTransporter().sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your password - Tattooista",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: #fff; margin: 0; text-align: center;">Tattooista</h1>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Reset your password</h2>
            <p>You requested a password reset. Click the button below to set a new password.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #1a1a1a; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
            <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; margin: 0;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #999; font-size: 12px; word-break: break-all;">${resetLink}</p>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error("Failed to send password reset email:", err)
    return { error: "Failed to send password reset email" }
  }
}

export async function sendBookingNotification(booking: Booking) {
  if (!ADMIN_EMAIL) {
    console.warn("ADMIN_EMAIL not configured, skipping booking notification")
    return { success: true }
  }

  const bookingLink = `${APP_URL}/admin/bookings`

  const contactInfo = []
  if (booking.email) contactInfo.push(`Email: ${booking.email}`)
  if (booking.phone) contactInfo.push(`Phone: ${booking.phone}`)
  if (booking.instagram) contactInfo.push(`Instagram: ${booking.instagram}`)

  try {
    await getTransporter().sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New booking from ${booking.fullName} - Tattooista`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: #fff; margin: 0; text-align: center;">Tattooista</h1>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">New Consultation Request</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${booking.fullName}</p>
              ${contactInfo.map((info) => `<p style="margin: 0 0 10px 0;"><strong>${info.split(":")[0]}:</strong>${info.split(":")[1]}</p>`).join("")}
              ${booking.message ? `<p style="margin: 0;"><strong>Message:</strong></p><p style="margin: 5px 0 0 0; white-space: pre-wrap;">${booking.message}</p>` : ""}
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${bookingLink}" style="background: #1a1a1a; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View in Dashboard</a>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center;">Received at ${new Date(booking.createdAt).toLocaleString()}</p>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error("Failed to send booking notification:", err)
    return { error: "Failed to send booking notification" }
  }
}
