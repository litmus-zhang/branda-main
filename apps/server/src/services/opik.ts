import { Opik } from "opik";
import { config } from "../config.ts";


// Initialize Opik client
export const opik = new Opik({
    projectName: "branda-backend-ai:" + config.NODE_ENV,
    apiKey: config.OPIK_API_KEY,
    workspaceName: config.OPIK_WORKSPACE,
});
