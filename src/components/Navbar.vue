<template>
  <nav class="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 shadow-sm z-40 relative">
    
    <div class="flex items-center">
      <h2 class="text-xl font-semibold text-slate-800 tracking-tight">
        {{ pageTitle }}
      </h2>
    </div>

    <div class="flex items-center gap-4">
      
      <button class="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
        <Bell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>

      <div class="h-6 w-px bg-slate-200"></div>

      <button 
        @click="logout" 
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
      >
        <LogOut class="w-4 h-4" />
        <span>Keluar</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { LogOut, Bell } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

// Membuat Judul Halaman Dinamis berdasarkan Route Name
const pageTitle = computed(() => {
  // Mapping path ke Judul yang cantik
  const titles = {
    '/': 'Dashboard Overview',
    '/branches': 'Manajemen Cabang',
    '/categories': 'Kategori Barang',
    '/products': 'Daftar Produk',
    '/inventory': 'Stok Gudang',
    '/staff': 'Manajemen Karyawan',
    '/transactions': 'Kasir & Transaksi'
  };
  return titles[route.path] || 'Panel Admin';
});

const logout = () => {
  // Konfirmasi sederhana (opsional)
  if(confirm("Apakah Anda yakin ingin keluar?")) {
    localStorage.clear();
    router.push("/login");
  }
};
</script>