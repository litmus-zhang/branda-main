import type { ElysiaApp } from "../../server.ts"
import { t } from "elysia"
import { authGuard } from "../../auth/auth.ts"
import {
  deleteOne,
  EventCheckin,
  getAllEvents,
  getOneByID,
  getSingleEvent,
  getSingleEventStats,
  getUserEvents,
  insertOne,
  issueTicketArtifacts,
  updateOne,
} from "../../db/index.ts"
import { models } from "../../db/model.ts"

const { events: eventInsert, tickets: ticketInsert } = models.insert

export type NewEvent = typeof eventInsert
export type NewTicket = typeof ticketInsert

export default (events: ElysiaApp) => events.model({
  Event: t.Object(eventInsert as any),
})
  .guard({
    tags: ["Events"],
    detail: {
      description: "Require user to be logged in",
    },
  })
  .use(authGuard)
  .get("", ({ query: { page, pageSize }, user: { id: userId } }: { query: { page?: number, pageSize?: number }, user: { id: string } }) =>
    getUserEvents(userId, page, pageSize), {
    auth: true,
    query: t.Object({
      page: t.Optional(t.Number()),
      pageSize: t.Optional(t.Number()),
    }),
  })
  .get("/all", ({ query: { page, pageSize } }: { query: { page?: number, pageSize?: number }, user: { id: string } }) =>
    getAllEvents(page, pageSize), {
    query: t.Object({
      page: t.Optional(t.Number(
        {
          default: 1,
        },
      )),
      pageSize: t.Optional(t.Number(
        {
          default: 10,
        },
      )),
    }),
  })
  .get("/:id", ({ params: { id } }: { params: { id: string } }) => getSingleEvent(id), {
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })
  .get("/:id/stats", ({ params: { id } }: { params: { id: string } }) => getSingleEventStats(id), {
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })
  .post("/new", ({
    user: { id: user_id },
    body,
  }: {
    body: NewEvent
    user: { id: string }
  }) => insertOne("events", {
    ...body,
    user_id,
  }), {
    body: t.Object(eventInsert as any),
    auth: true,
  })
  .put("/:id", ({
    params: { id },
    body,
  }: {
    params: { id: string }
    body: NewEvent
  }) => updateOne("events", id, body), {
    body: t.Partial(t.Object(eventInsert as any)),
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })
  .put("/:id/check-in", async ({
    params: { id },
    body,
  }: {
    params: { id: string }
    body: NewTicket
  }) => EventCheckin(body.ticket_code, id), {
    body: t.Partial(t.Object(ticketInsert as any)),
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })
  .post(
    "/:id/register",
    async ({ params: { id: eventId }, body, user }) => {
      const userId = user.id

      // 1️⃣ Fetch dependencies in parallel
      const [eventRes, userRes] = await Promise.all([
        getSingleEvent(eventId),
        getOneByID("user", userId),
      ])

      if (!eventRes?.data)
        throw new Error("Event not found")
      if (!userRes?.data)
        throw new Error("User not found")

      // 2️⃣ Create ticket (critical path)
      const ticketCode = crypto.randomUUID()

      const { data: ticket } = await insertOne("ticket", {
        ...body,
        event_id: eventId,
        user_id: userId,
        ticket_code: ticketCode,
        status: "ISSUED",
      })

      // 3️⃣ Fire-and-forget side effects
      void issueTicketArtifacts({
        ticket,
        ticketCode,
        event: eventRes.data,
        user: userRes.data,
      })

      return {
        message: "You have successfully registered for the event",
        data: ticket,
      }
    },
    {
      body: t.Object(ticketInsert as any),
      params: t.Object({ id: t.String() }),
      auth: true,
    },
  )
  .delete("/:id", ({ params: { id } }: { params: { id: string } }) => {
    deleteOne("events", id)
  }, {
    auth: true,
  })
  .ws("/:id/stats", {
    // validate incoming messages (optional)
    body: t.Object({ message: t.String() }),
    params: t.Object({
      id: t.String(),
    }),
    // runs for every new client
    open(ws) {
      console.log("🔗 client connected")
      ws.send({ event: "welcome", data: "Welcome to the chat!" })
    },
    // runs for every incoming message
    message(ws, { message }) {
      console.log("📨", message)
      // echo back (you could broadcast, store, etc.)
      ws.send({ event: "echo", data: message })
    },
    // runs when a client disconnects
    close(ws, code) {
      console.log("❌ client left", code)
    },
  })
