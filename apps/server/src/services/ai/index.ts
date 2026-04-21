
import { config } from "../../config.ts";
import * as restate from "@restatedev/restate-sdk/fetch";
import { aiService } from "./restate.ts";
import * as clients from "@restatedev/restate-sdk-clients";


export const restateHandler = restate.createEndpointHandler({
    services: [aiService],
    identityKeys: config.NODE_ENV === "development" || config.NODE_ENV === "test" ? [] : [config.RESTATE_PUBLIC_KEY ?? "Sample"],
    bidirectional: true,
});

// export const restateClient = clients.connect({ url: config.RESTATE_INGRESS_URL! });

export const generateBusinessPlan = async (data: {
    niche: string;
    businessName: string;
    details: string;
    country: string;
}) => {
    const rs = clients.connect({ url: config.RESTATE_URL });

    try {
        const plan = await rs.serviceClient(aiService).generateBusinessPlan(data);
        return plan;
    } catch (error) {
        console.error("Durable AI generation failed:", error);
        throw error;
    }
};
