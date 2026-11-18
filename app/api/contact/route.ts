import { NextResponse } from "next/server";
import { kv } from "@/utils/transfer/kv";

export interface ContactSubmission {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

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

    // 4. Generate persistent Ticket ID & submission record
    const ticketId = `TICK-${Date.now().toString(36).toUpperCase()}`;
    const submission: ContactSubmission = {
      id: ticketId,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      category: verifiedCategory,
      subject: subject.trim(),
      message: message.trim(),
    };

    // 5. Store persistently in KV store (retained for 60 days)
    try {
      await kv.hset("contact:reports", ticketId, JSON.stringify(submission), 60 * 60 * 24 * 60);
    } catch (storeErr) {
      console.warn("[Contact Storage] Warning: Could not persist to KV store:", storeErr);
    }

    // 6. Record in Server Console Output
    console.log(
      `\n==================== [NEW INQUIRY / BUG REPORT] ====================\n` +
      `Ticket ID : ${ticketId}\n` +
      `Date      : ${submission.createdAt}\n` +
      `Category  : ${verifiedCategory}\n` +
      `From      : ${name.trim()} <${email.trim()}>\n` +
      `Subject   : ${subject.trim()}\n` +
      `Message   :\n${message.trim()}\n` +
      `====================================================================\n`
    );

    // 7. Optional Discord / Slack Webhook integration for instant notifications
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.ADMIN_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `🚨 **New ToolifyPro Report [${ticketId}]**\n**From:** ${name.trim()} (\`${email.trim()}\`)\n**Category:** \`${verifiedCategory}\`\n**Subject:** ${subject.trim()}\n\`\`\`\n${message.trim().slice(0, 1500)}\n\`\`\``,
          }),
        });
      } catch (webhookErr) {
        console.warn("[Contact Webhook] Failed to dispatch webhook alert:", webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Your message has been received and our team will get back to you shortly.",
      ticketId,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const adminSecret = process.env.ADMIN_SECRET || "toolifyadmin";

    if (!key || key !== adminSecret) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const all = await kv.hgetall("contact:reports");
    const reports: ContactSubmission[] = Object.values(all)
      .map((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return null;
        }
      })
      .filter((r): r is ContactSubmission => r !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Error fetching contact reports:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching reports" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const id = searchParams.get("id");
    const adminSecret = process.env.ADMIN_SECRET || "toolifyadmin";

    if (!key || key !== adminSecret) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ticket id parameter" }, { status: 400 });
    }

    await kv.hdel("contact:reports", id);
    return NextResponse.json({ success: true, message: `Ticket ${id} successfully removed` });
  } catch (error) {
    console.error("Error deleting contact report:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error deleting report" },
      { status: 500 }
    );
  }
}
