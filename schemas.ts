/* FILE: extensions/plugins/webhook/schemas.ts */
import { z } from 'zod';

// Settings for a specific action instance
export interface WebhookActionInstanceSettings {
    webhookUrl: string;
    webhookMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    webhookHeaders?: Record<string, string>;
    webhookBodyTemplate?: string;
}

export const WebhookActionSettingsSchema = z.object({
    webhookUrl: z.string().url({ message: "Webhook URL must be a valid URL (http or https)" }),
    webhookMethod: z.enum(['GET', 'POST', 'PUT', 'DELETE']).optional(),
    // FIX: z.record() now requires two arguments: key and value schemas.
    // The previous .refine() was redundant as z.record already ensures an object type.
    webhookHeaders: z.record(z.string(), z.string()).optional(),
    webhookBodyTemplate: z.string().optional(),
});