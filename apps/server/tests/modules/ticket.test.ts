// Anyone can get a ticket

import { faker } from "@faker-js/faker";
import { createCrudTestSuite } from "../helpers/crudTestFactory.js";
import { CreateUserAndVerify } from "../helpers/payload.js";


const res = await CreateUserAndVerify({
    email: "ticket@test.com",
    password: "Ticket1234",
    name: "Ticket User",
})

createCrudTestSuite({
    resource: "ticket",
    basePath: "/tickets",
    withAuth: true,
    storeId: "ticketId",
    createPayload: () => ({
        title: faker.lorem.words(2),
        description: faker.lorem.sentence(),
        event_id: "$S{eventId}",
        user_id: "$S{userId}",
        ticket_code: faker.internet.ip(),
    }),
    updatePayload: o => ({
        ...o,
        title: `${o.title} Updated`,
        description: `${o.description} Updated`,
    }),
})