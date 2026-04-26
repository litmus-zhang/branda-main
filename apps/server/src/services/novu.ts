import { Novu } from "@novu/api";
import { config, initConfig } from "../config.js";

// Ensure config is initialized
await initConfig();

/**
 * Workflow IDs as defined in your Novu dashboard.
 * Using an enum ensures type-safety and makes it easy to track supported notifications.
 */
export enum NotificationWorkflow {
    EMAIL_VERIFICATION = "email-verification",
    PASSWORD_RESET = "forgot-password",
    OTP_VERIFICATION = "otp-verification",
    TEAM_INVITATION = "team-invitation",
}

export interface NotificationPayload {
    [key: string]: any;
}

export interface Recipient {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export class NotificationService {
    private novu: Novu;

    constructor() {
        if (!config.NOVU_API_KEY) {
            console.warn("[Novu] API Key is missing. Notifications will fail.");
        }
        this.novu = new Novu({ secretKey: config.NOVU_API_KEY });
    }

    /**
     * Triggers a notification workflow.
     * This replaces the direct "sendEmail" approach with a more scalable event-based system.
     */
    async trigger(workflowId: NotificationWorkflow | string, recipient: Recipient, payload: NotificationPayload) {
        try {
            console.log(`[Novu] Triggering workflow: ${workflowId} for ${recipient.email}`);

            const { result } = await this.novu.trigger({
                to: {
                    subscriberId: recipient.id,
                    email: recipient.email,
                    firstName: recipient.firstName,
                    lastName: recipient.lastName,
                },
                workflowId,
                payload,
            });

            return result
        } catch (error) {
            console.error(`[Novu] Failed to trigger workflow ${workflowId}:`, error);
            throw error;
        }
    }
    async getWorkflow(id: string) {
        try {
            const { result } = await this.novu.workflows.get(id);
            return result.id
        } catch (err) {
            console.error(`[Novu] Failed to get workflows:`, err);
            throw err;
        }
    }

    /**
     * Update subscriber profile in Novu.
     * Use this when a user changes their name or email to keep Novu in sync.
     */
    async identify(recipient: Recipient) {
        try {
            await this.novu.subscribers.retrieve(recipient.id);
        } catch (error) {
            console.error(`[Novu] Failed to identify subscriber ${recipient.id}:`, error);
        }
    }
}

export const notificationService = new NotificationService();

/**
 * Backward compatibility helper for the transition from Resend.
 * @deprecated Use notificationService.trigger() directly for new features.
 */
export async function sendEmail({
    to,
    subject,
    template,
    html
}: {
    to: string[];
    subject: string;
    template?: { id: string; variables?: Record<string, any> };
    html?: string;
}) {
    const email = to[0];
    if (!email) return;

    // Map old Resend template IDs to new Novu Workflow IDs
    let workflowId: string = NotificationWorkflow.OTP_VERIFICATION;

    if (template?.id === "verify-email") workflowId = NotificationWorkflow.EMAIL_VERIFICATION;
    if (template?.id === "forgot-password") workflowId = NotificationWorkflow.PASSWORD_RESET;

    return notificationService.trigger(workflowId, { id: email, email }, {
        ...template?.variables,
        subject,
        html,
        // Fallback for simple OTP sends
        otp: template?.variables?.otp || html?.match(/\d{4,6}/)?.[0]
    });
}