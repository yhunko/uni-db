import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Table from "../views/Table.vue";
import Settings from "../views/Settings.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/",
  },
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/table/:table",
    name: "table",
    component: Table,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
