/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify';
import router from '../router';
import ToastPlugin from 'vue-toast-notification';
import * as Sentry from '@sentry/vue';

// Themese
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Types
import type { App } from 'vue';

export function registerPlugins(app: App) {
  registerSentry(app).use(vuetify).use(router).use(ToastPlugin);
}

export const registerSentry = (app: App) => {
  const dsn = import.meta.env['VITE_SENTRY_DNS'];

  if (!dsn) {
    return app;
  }

  Sentry.init({
    app,
    dsn,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

  return app;
};
