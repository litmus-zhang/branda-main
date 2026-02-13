import { and, desc, eq } from "drizzle-orm"
import { PAGE_SIZE } from "../constants.ts"
import { db, getPaginatedMeta } from "../index.ts"
import * as schema from "../schema.ts"

import QRCode from "qrcode";
import { sendEmail } from "../../services/resend.ts";
import { generatePdfFromHtml } from "../../services/pdf-gen.ts";

export async function generateQrSvg(ticketCode: string): Promise<string> {
    return QRCode.toString(ticketCode, {
        type: "svg",
        errorCorrectionLevel: "H",
        margin: 1,
        width: 256,
    });
}

type BuildTicketHtmlInput = {
    event: {
        name: string;
        start_time?: string;
        venue?: string;
    };
    user: {
        name: string;
        email: string;
    };
    ticketCode: string;
    qrSvg: string;
};

export function buildTicketHtml({
    event,
    user,
    ticketCode,
    qrSvg,
}: BuildTicketHtmlInput): string {
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${event.name} – Ticket</title>

    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
        background: #f5f5f5;
        padding: 40px;
      }

      .ticket {
        background: #ffffff;
        width: 800px;
        margin: auto;
        padding: 32px;
        border-radius: 12px;
        border: 2px dashed #ccc;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .event-name {
        font-size: 28px;
        font-weight: 700;
      }

      .meta {
        margin-top: 16px;
        font-size: 14px;
        color: #555;
      }

      .qr {
        margin-top: 32px;
        display: flex;
        justify-content: center;
      }

      .qr svg {
        width: 220px;
        height: 220px;
      }

      .code {
        margin-top: 16px;
        text-align: center;
        font-size: 12px;
        letter-spacing: 1px;
        color: #999;
      }

      .footer {
        margin-top: 32px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="ticket">
      <div class="header">
        <div class="event-name">${event.name}</div>
      </div>

      <div class="meta">
        <div><strong>Attendee:</strong> ${user.name}</div>
        <div><strong>Email:</strong> ${user.email}</div>
        ${event.start_time ? `<div><strong>Date:</strong> ${event.start_time}</div>` : ""}
        ${event.venue ? `<div><strong>Venue:</strong> ${event.venue}</div>` : ""}
      </div>

      <div class="qr">
        ${qrSvg}
      </div>

      <div class="code">
        Ticket Code: ${ticketCode}
      </div>

      <div class="footer">
        Please present this QR code at the event entrance.
      </div>
    </div>
  </body>
</html>
`;
}


export async function getUserTickets(userId: string, page = 1, pageSize = PAGE_SIZE) {
    const data = await db.query.ticket.findMany({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        with: {
            // post_media: true,
            // user: true,
        },
        orderBy: [desc(schema.ticket.createdAt)],
        where: and(eq(schema.ticket.user_id, userId), eq(schema.ticket.status, "ISSUED")),
    })
    const total = await db.$count(
        schema.ticket,
        and(eq(schema.ticket.user_id, userId), eq(schema.ticket.status, "ISSUED")),
    )

    return {
        message: `Successfully retrieved all ticket`,
        data,
        meta: getPaginatedMeta(page, pageSize, total),
    }
}

export async function getSingleTicket(ticketId: string) {
    const data = await db.query.ticket.findFirst({
        where: eq(schema.ticket.id, ticketId),
        with: {
            // post_media: true,
            // user: true,
        },
        orderBy: [desc(schema.ticket.createdAt)],
    })
    return {
        message: `Successfully retrieved a ticket`,
        data,
    }
}

export async function issueTicketArtifacts({
    ticket,
    ticketCode,
    event,
    user,
}: {
    ticket: any;
    ticketCode: string;
    event: any;
    user: any;
}) {
    try {
        // 1️⃣ Generate QR
        const qrSvg = await generateQrSvg(ticketCode);

        // 2️⃣ Generate HTML
        const html = buildTicketHtml({
            event,
            user,
            ticketCode,
            qrSvg,
        });

        // 3️⃣ Generate PDF
        const pdfBuffer = await generatePdfFromHtml(html, event.name);

        // 4️⃣ Email
        await sendEmail({
            to: user.email,
            subject: `Your Ticket for ${event.name}`,
            html: `<p>Your ticket is attached.</p>`,
            attachments: [
                {
                    filename: `${event.name}-ticket.pdf`,
                    content: Buffer.from(pdfBuffer).toString("base64"),
                    type: "application/pdf",
                },
            ],
        });


    } catch (err) {
        console.error("Ticket side-effect failure", err);
    }
}
