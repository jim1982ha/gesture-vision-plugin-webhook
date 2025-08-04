/* FILE: extensions/plugins/webhook/backend.plugin.ts */
import { BaseBackendPlugin } from '#backend/plugins/base-backend.plugin.js';
import { WebhookActionHandler } from './action-handler.webhook.js';
import { WebhookActionSettingsSchema } from './schemas.js';
import manifest from './plugin.json' with { type: 'json' };
import type { PluginManifest } from "#shared/types/index.js";

class WebhookBackendPlugin extends BaseBackendPlugin {
  constructor() {
    super(manifest as PluginManifest, new WebhookActionHandler());
  }

  getActionConfigValidationSchema() {
    return WebhookActionSettingsSchema;
  }
}

export default WebhookBackendPlugin;