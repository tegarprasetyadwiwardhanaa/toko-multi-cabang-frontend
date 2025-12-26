<template>
  <aside class="w-64 bg-slate-900 h-screen flex flex-col shadow-2xl fixed left-0 top-0 z-50 border-r border-slate-800 font-sans transition-all duration-300">
    
    <div class="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl">
      <div class="flex items-center gap-3">
        <div class="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
            <LayoutDashboard class="w-5 h-5 text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-lg font-bold text-white tracking-tight leading-none">
            Toko<span class="text-indigo-400"> Bangunan</span>
          </span>
          <span class="text-[10px] text-slate-500 font-medium tracking-wide">Management System</span>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
      
      <template v-if="role === 'owner'">
        <div class="px-3 mb-3 mt-2">
          <p class="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Utama</p>
        </div>
        
        <router-link to="/" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
          <LayoutDashboard class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
          <span>Dashboard</span>
        </router-link>

        <router-link to="/branches" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
          <Store class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
          <span>Cabang Toko</span>
        </router-link>

        <div class="px-3 mb-3 mt-8">
          <p class="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Inventori</p>
        </div>

        <router-link to="/categories" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
          <Tags class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
          <span>Kategori</span>
        </router-link>

        <router-link to="/products" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
          <Package class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
          <span>Produk</span>
        </router-link>

        <router-link to="/inventory" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
          <Warehouse class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
          <span>Gudang Pusat</span>
        </router-link>

        <router-link to="/branch-inventory" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
          <Store class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
          <span>Stok Cabang</span>
        </router-link>

        <div class="px-3 mb-3 mt-8">
          <p class="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Administrasi</p>
        </div>

        <router-link to="/staff" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
          <Users class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
          <span>Data Staff</span>
        </router-link>
      </template>

      <template v-else-if="role === 'staff'">
        <div class="px-3 mb-3 mt-2">
          <p class="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Kasir</p>
        </div>
        
        <router-link to="/transactions" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
          <ShoppingCart class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
          <span>Transaksi Baru</span>
        </router-link>

        <router-link to="/history" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
          <History class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
          <span>Riwayat Penjualan</span>
        </router-link>
      </template>

      <div class="px-3 mb-3 mt-8">
          <p class="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Pengaturan</p>
      </div>

      <router-link to="/profile" :class="baseNavClass" active-class="!bg-indigo-600 !text-white !shadow-lg !shadow-indigo-500/20 !border-indigo-500/50 !translate-x-0">
        <UserCog class="w-5 h-5 mr-3 transition-colors duration-200 group-hover:text-white" /> 
        <span>Akun Saya</span>
      </router-link>
    </div>

    <div class="p-4 border-t border-slate-800 bg-slate-900/50">
      <div class="flex items-center justify-between p-2 rounded-xl border border-transparent hover:border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 group">
        
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-9 h-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md ring-2 ring-slate-800 group-hover:ring-slate-700 transition-all">
            {{ getInitials(username) }}
          </div>
          
          <div class="flex flex-col min-w-0">
            <p class="text-sm font-semibold text-slate-200 truncate" :title="username">
              {{ username }}
            </p>
            <p class="text-[10px] text-indigo-400 font-bold uppercase tracking-wide truncate">
              {{ role }}
            </p>
          </div>
        </div>

        <button 
          @click="handleLogout" 
          class="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors duration-200 focus:outline-none"
          title="Keluar Aplikasi"
        >
          <LogOut class="w-4 h-4" />
        </button>

      </div>
    </div>

  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { 
  LayoutDashboard, Store, Tags, Package, Warehouse, Users, 
  History, ShoppingCart, UserCog, LogOut 
} from 'lucide-vue-next';
import { ConfirmAlert, Toast } from '../utils/alert'; 

const router = useRouter();
const role = localStorage.getItem("role") || 'guest';
const username = localStorage.getItem("username") || 'User';

const baseNavClass = "group flex items-center px-4 py-3 mb-1 text-sm font-medium text-slate-400 rounded-xl transition-all duration-200 ease-in-out border border-transparent hover:bg-slate-800 hover:text-slate-100 hover:translate-x-1 active:scale-[0.98]";

const getInitials = (name) => {
  if (!name) return "U";
  return name.substring(0, 2).toUpperCase();
};

const handleLogout = () => {
  ConfirmAlert.fire({
    title: 'Keluar Aplikasi?',
    text: "Sesi Anda akan diakhiri.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    customClass: {
    actions: 'flex gap-3 mt-4',
    confirmButton:
      'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500',
    cancelButton:
      'bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500' 
  }
  }).then((result) => {
    if (result.isConfirmed) {
      Toast.fire({
        icon: 'success',
        title: 'Berhasil Keluar'
      });
      localStorage.clear();
      router.push('/login');
    }
  });
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>