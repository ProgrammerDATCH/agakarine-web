interface EmailOptions {
    subject: string
    preview: string
  }
  
  export const createEmailTemplate = (
    content: string,
    options: EmailOptions
  ) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${options.subject}</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      :root {
        color-scheme: light;
        supported-color-schemes: light;
      }
      
      body {
        margin: 0;
        padding: 0;
        word-break: break-word;
        -webkit-font-smoothing: antialiased;
      }
      
      .preheader {
        display: none;
        max-width: 0;
        max-height: 0;
        overflow: hidden;
        mso-hide: all;
      }
      
      .main {
        margin: 0;
        padding: 20px;
        line-height: 24px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 16px;
        color: #333333;
        background-color: #ffffff;
      }
      
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
      
      .header {
        padding: 24px;
        background-color: #000000;
        color: #ffffff;
        text-align: center;
      }
      
      .content {
        padding: 32px 24px;
      }
      
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #000000;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 500;
        margin-top: 24px;
      }
      
      .footer {
        padding: 24px;
        text-align: center;
        font-size: 14px;
        color: #666666;
        border-top: 1px solid #eeeeee;
      }
    </style>
  </head>
  <body>
    <span class="preheader">${options.preview}</span>
    <div class="main">
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Agakarine</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>This is an automated reminder from Agakarine. You can manage your notifications in your account settings.</p>
          <p>© ${new Date().getFullYear()} Agakarine. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `
  
  // Event reminder template
  export const createEventReminderEmail = (event: {
    title: string
    description?: string
    startDate: string
    location?: string
  }) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(new Date(event.startDate))
  
    const content = `
      <h2 style="margin: 0 0 16px; color: #000000;">Event Reminder</h2>
      <p style="margin: 0 0 24px;">This is a reminder for your upcoming event:</p>
      <div style="background-color: #f9fafb; padding: 24px; border-radius: 6px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px; color: #000000;">${event.title}</h3>
        ${event.description ? `<p style="margin: 0 0 12px;">${event.description}</p>` : ''}
        <p style="margin: 0 0 8px;">
          <strong>Date & Time:</strong> ${formattedDate}
        </p>
        ${event.location ? `
        <p style="margin: 0;">
          <strong>Location:</strong> ${event.location}
        </p>
        ` : ''}
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/events" class="button">View Event</a>
    `
  
    return createEmailTemplate(content, {
      subject: `Reminder: ${event.title}`,
      preview: `Reminder for your event: ${event.title} on ${formattedDate}`
    })
  }
  
  // Debt reminder template
  export const createDebtReminderEmail = (debt: {
    personName: string
    amount: number
    description?: string
    dueDate?: string
    isLent: boolean
  }) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(debt.amount)
  
    const formattedDueDate = debt.dueDate
      ? new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(debt.dueDate))
      : null
  
    const content = `
      <h2 style="margin: 0 0 16px; color: #000000;">Debt Reminder</h2>
      <p style="margin: 0 0 24px;">This is a reminder about ${debt.isLent ? 'money lent to' : 'money borrowed from'} ${debt.personName}:</p>
      <div style="background-color: #f9fafb; padding: 24px; border-radius: 6px; margin-bottom: 24px;">
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px; color: #000000;">Amount: ${formattedAmount}</h3>
          <p style="margin: 0; color: ${debt.isLent ? '#16a34a' : '#dc2626'};">
            ${debt.isLent ? 'To be received' : 'To be paid'}
          </p>
        </div>
        ${debt.description ? `
        <div style="margin-bottom: 16px;">
          <strong>Details:</strong>
          <p style="margin: 8px 0 0;">${debt.description}</p>
        </div>
        ` : ''}
        ${formattedDueDate ? `
        <div>
          <strong>Due Date:</strong>
          <p style="margin: 8px 0 0;">${formattedDueDate}</p>
        </div>
        ` : ''}
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/debts" class="button">View Details</a>
    `
  
    return createEmailTemplate(content, {
      subject: `Debt Reminder: ${debt.isLent ? 'Payment to receive from' : 'Payment due to'} ${debt.personName}`,
      preview: `Reminder for ${formattedAmount} ${debt.isLent ? 'to receive from' : 'to pay to'} ${debt.personName}`
    })
  }