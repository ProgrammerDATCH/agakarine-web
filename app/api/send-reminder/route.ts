import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createEventReminderEmail, createDebtReminderEmail } from "@/lib/email/email-templates"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const { type, data, recipientEmail } = await request.json()

    let emailHtml: string
    let emailSubject: string

    if (type === "event") {
      const emailContent = createEventReminderEmail(data)
      emailHtml = emailContent
      emailSubject = `Reminder: ${data.title}`
    } else if (type === "debt") {
      const emailContent = createDebtReminderEmail(data)
      emailHtml = emailContent
      emailSubject = `Debt Reminder: ${data.isLent ? 'Payment to receive' : 'Payment due'}`
    } else {
      throw new Error("Invalid reminder type")
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to send reminder:", error)
    return NextResponse.json(
      { error: "Failed to send reminder" },
      { status: 500 }
    )
  }
}