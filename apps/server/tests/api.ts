import { treaty } from "@elysiajs/eden"
import { app } from "../src/server.js"

export const api = treaty(app)
