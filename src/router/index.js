import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import OwnerDashboard from "../pages/owner/Dashboard.vue";
import Branches from "../pages/owner/Branches.vue";
import Categories from "../pages/owner/Categories.vue";
import Products from "../pages/owner/Products.vue";
import Inventory from "../pages/owner/Inventory.vue";
import Staff from "../pages/owner/Staff.vue";
import BranchInventory from '../pages/owner/BranchInventory.vue';
import Profile from '../pages/Profile.vue';

// STAFF PAGES
import Transactions from "../pages/staff/Transaction.vue";
import History from "../pages/staff/History.vue"; 

const routes = [
  { path: "/login", component: Login },
  { 
    path: '/profile', 
    name: 'Profile',
    component: Profile, 
    meta: { requiresAuth: true } 
  },

  // === OWNER ROUTES ===
  {
    path: "/",
    component: OwnerDashboard,
    meta: { requiresAuth: true, role: "owner" }
  },
  {
    path: "/branches",
    component: Branches,
    meta: { requiresAuth: true, role: "owner" }
  },
  {
    path: "/categories",
    component: Categories,
    meta: { requiresAuth: true, role: "owner" }
  },
  {
    path: "/products",
    component: Products,
    meta: { requiresAuth: true, role: "owner" }
  },
  {
    path: "/inventory",
    component: Inventory,
    meta: { requiresAuth: true, role: "owner" }
  },
  {
    path: "/staff",
    component: Staff,
    meta: { requiresAuth: true, role: "owner" }
  },
  { 
    path: '/branch-inventory', 
    name: 'BranchInventory',
    component: BranchInventory, 
    meta: { requiresAuth: true, role: 'owner' } 
  },

  // === STAFF ROUTES ===
  {
    path: "/transactions",
    component: Transactions,
    meta: { requiresAuth: true, role: "staff" }
  },
  {
    path: "/history",
    name: "StaffHistory",
    component: History,
    meta: { requiresAuth: true, role: "staff" }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  if (to.meta.role && to.meta.role !== role) {
    // Jika role tidak cocok, kembalikan ke login atau halaman error
    // (Opsional: bisa redirect ke halaman default masing-masing role)
    return next("/login");
  }

  next();
});

export default router;