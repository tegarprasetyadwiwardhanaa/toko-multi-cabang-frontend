<template>
  <aside class="w-64 bg-slate-900 text-white h-screen flex flex-col shadow-xl fixed left-0 top-0 z-50 transition-all duration-300">
    
    <div class="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-950">
      <div class="flex items-center space-x-2 font-bold text-xl tracking-wide">
        <LayoutDashboard class="w-6 h-6 text-indigo-500" />
        <span>Toko <span class="text-indigo-500">Bangunan</span></span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-3">
        
        <template v-if="role === 'owner'">
          <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Utama</p>
          
          <router-link to="/" active-class="bg-indigo-600 text-white shadow-lg" class="flex items-center px-4 py-3 text-slate-300 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-white mb-1">
            <LayoutDashboard class="w-5 h-5 mr-3" /> Dashboard
          </router-link>

          <router-link to="/branches" active-class="bg-indigo-600 text-white shadow-lg" class="flex items-center px-4 py-3 text-slate-300 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-white mb-1">
            <Store class="w-5 h-5 mr-3" /> Cabang
          </router-link>

          <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Inventori</p>

          <router-link to="/categories" active-class="bg-indigo-600 text-white shadow-lg" class="flex items-center px-4 py-3 text-slate-300 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-white mb-1">
            <Tags class="w-5 h-5 mr-3" /> Kategori
          </router-link>

          <router-link to="/products" active-class="bg-indigo-600 text-white shadow-lg" class="flex items-center px-4 py-3 text-slate-300 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-white mb-1">
            <Package class="w-5 h-5 mr-3" /> Produk
          </router-link>

          <router-link to="/inventory" active-class="bg-indigo-600 text-white shadow-lg" class="flex items-center px-4 py-3 text-slate-300 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-white mb-1">
            <Warehouse class="w-5 h-5 mr-3" /> Gudang
          </router-link>

          <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Admin</p>

          <router-link to="/staff" active-class="bg-indigo-600 text-white shadow-lg" class="flex items-center px-4 py-3 text-slate-300 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-white mb-1">
            <Users class="w-5 h-5 mr-3" /> Staff
          </router-link>
        </template>

        <template v-else-if="role === 'staff'">
          <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Kasir</p>
          
          <router-link to="/transactions" active-class="bg-indigo-600 text-white shadow-lg" class="flex items-center px-4 py-3 text-slate-300 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:text-white mb-1">
            <ShoppingCart class="w-5 h-5 mr-3" /> Transaksi
          </router-link>
        </template>

      </ul>
    </div>

    <div class="p-4 border-t border-slate-700 bg-slate-950">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
          {{ role.charAt(0).toUpperCase() }}
        </div>
        <div>
          <p class="text-sm font-medium text-white capitalize">{{ role }}</p>
          <p class="text-xs text-slate-400">Online</p>
        </div>
      </div>
    </div>

  </aside>
</template>

<script setup>
import { 
  LayoutDashboard, 
  Store, 
  Tags, 
  Package, 
  Warehouse, 
  Users, 
  ShoppingCart 
} from 'lucide-vue-next';

const role = localStorage.getItem("role") || 'guest';
</script>