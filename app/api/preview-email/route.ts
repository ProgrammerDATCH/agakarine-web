import { NextResponse } from "next/server"
import { createEventReminderEmail, createDebtReminderEmail } from "@/lib/email/email-templates"

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

    let emailHtml: string

    if (type === "event") {
      emailHtml = createEventReminderEmail(data)
    } else if (type === "debt") {
      emailHtml = createDebtReminderEmail(data)
    } else {
      throw new Error("Invalid template type")
    }

    return new NextResponse(emailHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Failed to generate email preview:", error)
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    )
  }
}