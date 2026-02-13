import { gte } from "better-auth"
import { and, count, desc, eq, lte, sql } from "drizzle-orm"
import { NotFoundError } from "elysia"
import { PAGE_SIZE } from "../constants.ts"
import { db, getPaginatedMeta } from "../index.ts"
import * as schema from "../schema.ts"

export async function getSingleEvent(eventId: string) {
  const post = await db.query.events.findFirst({
    where: eq(schema.events.id, eventId),
    with: {
      // post_media: true,
    },
    orderBy: [desc(schema.events.startDate)],
  })
  return {
    message: `Successfully retrieved a event`,
    data: post,
  }
}
export async function getSingleEventStats(eventId: string) {
  // 1. Fetch event details and ticket stats in parallel or a single join
  const result = await db
    .select({
      event: schema.events,
      totalTickets: count(schema.ticket.id),
      // Using conditional aggregation to count statuses in one go
      issuedCount: sql<number>`count(${schema.ticket.id}) filter (where ${schema.ticket.status} = 'ISSUED')`,
      checkedInCount: sql<number>`count(${schema.ticket.id}) filter (where ${schema.ticket.status} = 'CHECKED_IN')`,
    })
    .from(schema.events)
    .leftJoin(schema.ticket, eq(schema.events.id, schema.ticket.event_id))
    .where(eq(schema.events.id, eventId))
    .groupBy(schema.events.id)

  const stats = result[0]

  if (!stats) {
    throw new NotFoundError("Event not found")
  }

  return {
    message: `Successfully retrieved event stats`,
    data: {
      event: stats.event,
      stats: {
        total: Number(stats.totalTickets),
        issued: Number(stats.issuedCount),
        checkedIn: Number(stats.checkedInCount),
      },
    },
  }
}
export async function getUserEvents(userId: string, page = 1, pageSize = PAGE_SIZE) {
  const data = await db.query.events.findMany({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    with: {
      // post_media: true,
      // user: true,
      tickets: {
        where: eq(schema.ticket.user_id, userId),
      },
    },
    orderBy: [desc(schema.events.createdAt)],
    where: and(eq(schema.ticket.user_id, userId), eq(schema.events.status, "valid")),
  })
  const total = await db.$count(
    schema.events,
    and(eq(schema.ticket.user_id, userId)),
  )

  return {
    message: `Successfully retrieved all events for a user`,
    data,
    meta: getPaginatedMeta(page, pageSize, total),
  }
}
export async function getAllEvents(page = 1, pageSize = PAGE_SIZE) {
  // 1. Sanitize inputs
  const limit = Math.min(Math.max(1, pageSize), 100)
  const offset = (Math.max(1, page) - 1) * limit

  // 2. Run queries in parallel to save time
  const [events, totalResult] = await Promise.all([
    db.query.events.findMany({
      limit,
      offset,
      orderBy: [desc(schema.events.createdAt)],
    }),
    db.select({ value: count() }).from(schema.events),
  ])

  const total = totalResult[0]?.value ?? 0

  return {
    message: `Successfully retrieved all events`,
    data: events,
    meta: getPaginatedMeta(page, limit, total),
  }
}

export async function EventCheckin(ticketCode: string, eventId: string) {
  // Event is currently active
  // Ticket exists
  // Ticket belongs to this event
  // Ticket status == ISSUED
  // eslint-disable-next-line no-useless-catch
  try {
    const event = await db.query.events.findFirst({
      where: and(
        eq(schema.events.id, eventId),
        eq(schema.events.status, "ongoing"),
        // lte(schema.events.startDate, new Date()),
        // gte(schema.events.endDate, new Date())
      ),
    })
    const ticket = await db.query.ticket.findFirst({
      where: and(eq(schema.ticket.ticket_code, ticketCode), eq(schema.ticket.status, "ISSUED")),
    })
    if (!event || !ticket) {
      throw new Error("Event or ticket not found")
    }

    await db.update(schema.ticket).set({
      status: "CHECKED_IN",
      updatedAt: new Date(),
    }).where(eq(schema.ticket.id, ticket.id))

    return {
      message: "Ticket checked in successfully",
      data: ticket,
    }
  }
  catch (error) {
    throw error
  }
}
