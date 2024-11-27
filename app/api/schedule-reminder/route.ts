import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const { eventId, reminderTime, title, startDate } = await request.json()

    // Schedule the reminder email
    const reminder = {
      from: process.env.SMTP_FROM,
      to: "user@example.com", // Will be replaced with actual user email
      subject: `Reminder: ${title}`,
      text: `Don't forget about your event "${title}" starting at ${new Date(startDate).toLocaleString()}`,
      html: `
        <h1>Event Reminder</h1>
        <p>Don't forget about your event "${title}" starting at ${new Date(startDate).toLocaleString()}</p>
      `,
    }

    await transporter.sendMail(reminder)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to schedule reminder:", error)
    return NextResponse.json(
      { error: "Failed to schedule reminder" },
      { status: 500 }
    )
  }
}