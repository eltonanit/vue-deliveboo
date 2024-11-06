import { createRouter, createWebHistory } from 'vue-router';

import Home from './components/pages/Home.vue';
import ListRestaurant from './components/pages/ListRestaurant.vue';
import ShowSingleCar from './components/pages/ShowSingleCar.vue';
import CarNotFound from './components/pages/CarNotFound.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',

            component:
                Home,
        },
        {
            path: '/list_car',
            name: 'list_car',

            component:
                ListCar,
        },
        {
            path: '/list_car/:slug',
            name: 'show_car',

            component:
                ShowSingleCar,
        },
        {
            path: '/list_car/:pathMatch(.*)*',
            name: 'not_found',

            component:
                CarNotFound,
        },
    ]
})

export { router };