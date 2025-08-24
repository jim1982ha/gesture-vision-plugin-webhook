/* FILE: extensions/plugins/webhook/action-handler.webhook.ts */
import { processActionTemplate } from '#shared/utils/index.js';
import { createErrorResult, executeWithRetry } from '#backend/utils/action-helpers.js';
import { type WebhookActionInstanceSettings } from './schemas.js';

import type { ActionDetails, ActionResult } from '#shared/types/index.js';
import type { ActionHandler } from '#backend/types/index.js';

export class WebhookActionHandler implements ActionHandler {
  private readonly REQUEST_TIMEOUT_MS = 8000;
  private readonly MAX_RETRIES = 2;
  private readonly INITIAL_RETRY_DELAY_MS = 1500;

  constructor() {}

  async execute(
    instanceSettings: WebhookActionInstanceSettings,
    actionDetails: ActionDetails,
    _pluginGlobalConfig?: unknown
  ): Promise<ActionResult> {
    if (!instanceSettings.webhookUrl) {
      return createErrorResult(
        'Webhook Action Error: URL not configured in action settings.',
        { settings: instanceSettings }
      );
    }

    let url: string;
    let bodyString: string | undefined;
    const headers: Record<string, string> = {};

    try {
      url = processActionTemplate(
        instanceSettings.webhookUrl,
        actionDetails as unknown as Record<string, unknown>
      );
      bodyString = instanceSettings.webhookBodyTemplate
        ? processActionTemplate(
            instanceSettings.webhookBodyTemplate,
            actionDetails as unknown as Record<string, unknown>
          )
        : undefined;
      Object.entries(instanceSettings.webhookHeaders || {}).forEach(([k, v]) => {
        headers[k] = v
          ? processActionTemplate(v, actionDetails as unknown as Record<string, unknown>)
          : '';
      });
    } catch (e: unknown) {
      return createErrorResult(`Webhook template processing error: ${(e as Error).message}`, {
        error: e,
      });
    }

    const method = instanceSettings.webhookMethod || 'POST';
    if (
      bodyString &&
      !Object.keys(headers).some((h) => h.toLowerCase() === 'content-type')
    ) {
      try {
        JSON.parse(bodyString);
        headers['Content-Type'] = 'application/json';
      } catch {
        headers['Content-Type'] = 'text/plain';
      }
    }

    const actionFn = async (): Promise<{
      response: Response;
      responseBody: WebhookActionInstanceSettings | string | null;
    }> => {
      const response = await fetch(url, {
        method,
        headers,
        body: bodyString,
        signal: AbortSignal.timeout(this.REQUEST_TIMEOUT_MS),
      });

      if (response.ok) {
        return { response, responseBody: instanceSettings };
      }

      let errorTextResponse: string | null = response.statusText || 'Unknown error';
      try {
        const text = await response.text();
        if (text) {
          errorTextResponse = text;
        }
      } catch (_parseError: unknown) {
        /* no-op */
      }
      return { response, responseBody: errorTextResponse };
    };

    const isRetryable = (error: unknown, response?: Response): boolean => {
      if (response && response.status >= 400 && response.status < 500) return false;
      if (error instanceof Error && error.name === 'AbortError') return true;
      return true;
    };

    return executeWithRetry<WebhookActionInstanceSettings>({
      actionFn,
      isRetryableError: isRetryable,
      maxRetries: this.MAX_RETRIES,
      initialDelayMs: this.INITIAL_RETRY_DELAY_MS,
      actionName: `Webhook ${method} to ${url.substring(0, 50)}... (Plugin)`,
    });
  }
}