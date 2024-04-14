/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify';
import router from '../router';
import ToastPlugin from 'vue-toast-notification';

// Themese
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Types
import type { App } from 'vue';

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(ToastPlugin);
}
