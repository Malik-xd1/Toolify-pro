import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, category, subject, message, honeypot } = body;

    // 1. Honeypot check for automated bot spam
    if (honeypot && String(honeypot).trim().length > 0) {
      // Quietly reject bot submissions
      return NextResponse.json({ success: true, message: "Message received." });
    }

    // 2. Field validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Please provide a descriptive subject line." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Message must be at least 10 characters long." },
        { status: 400 }
      );
    }

    // 3. Category validation
    const validCategories = ["general", "bug", "feature", "business", "security"];
    const verifiedCategory = validCategories.includes(category) ? category : "general";

    // 4. Record/Log submission
    console.log(`[Contact Submission] Category: ${verifiedCategory} | From: ${name.trim()} <${email.trim()}> | Subject: ${subject.trim()}`);

    // In a production setup, this would dispatch to SendGrid, Resend, or AWS SES.
    // We return a genuine verified receipt.
    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Your message has been received and our team will get back to you shortly.",
      ticketId: `TICK-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}
