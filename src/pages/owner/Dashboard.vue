<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-800 mb-6">Ringkasan Toko</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4 hover:shadow-md transition-shadow">
        <div class="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500">Total Cabang</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats.branches }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4 hover:shadow-md transition-shadow">
        <div class="p-3 bg-purple-100 text-purple-600 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500">Total Produk</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats.products }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4 hover:shadow-md transition-shadow">
        <div class="p-3 bg-green-100 text-green-600 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500">Total Transaksi</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats.transactions }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import api from "../../api/axios";

// PENTING: Saya MENGHAPUS import Sidebar dan Navbar dari sini.
// Karena sudah di-handle oleh App.vue

const stats = reactive({
  branches: 0,
  products: 0,
  transactions: 0
});

onMounted(async () => {
  try {
    const [branches, products, transactions] = await Promise.all([
      api.get("/branches"),
      api.get("/products"),
      api.get("/transactions")
    ]);

    stats.branches = branches.data.length;
    stats.products = products.data.length;
    stats.transactions = transactions.data.length;
  } catch (err) {
    console.error("Gagal memuat dashboard", err);
  }
});
</script>