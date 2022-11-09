import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
const Team = () => import("@/views/TeamTree.vue");
const x6Demo = () => import("@/views/x6Demo.vue");

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/team",
      name: "team",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Team,
    },
    {
      path: "/x6",
      name: "x6",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: x6Demo,
    },
  ],
});

export default router;
