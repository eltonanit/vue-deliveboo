import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./components/pages/HomePage.vue";
import MenuPage from "./components/pages/MenuPage.vue";
import CartPage from "./components/pages/CartPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/dishes/:restaurantId",
    name: "Menu",
    component: MenuPage,
    props: true, // Per passare l'ID del ristorante come prop
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
