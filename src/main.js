import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js"; // Usa il default import

createApp(App)
  .use(router) // Usa il router
  .mount("#app");
