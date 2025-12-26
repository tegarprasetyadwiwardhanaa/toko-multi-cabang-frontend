<template>
  <nav
    class="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-6 shadow-sm sticky top-0 z-40"
  >
    <div class="flex items-center gap-3">
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-800 tracking-tight capitalize leading-none">
          {{ pageTitle }}
        </h2>
        <span class="text-xs text-slate-500 font-medium mt-1">
          Sistem Manajemen Toko
        </span>
      </div>
    </div>

    <div class="flex items-center gap-6">

      <div
        class="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 shadow-sm"
      >
        <div class="flex flex-col items-end leading-tight">
          <span class="text-xs font-semibold text-slate-600">
            {{ currentDate }}
          </span>
          <span class="text-sm font-mono font-bold text-indigo-600">
            {{ currentTime }}
          </span>
        </div>

        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200">
          <Clock class="w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div class="h-8 w-px bg-slate-200 hidden md:block"></div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Clock } from 'lucide-vue-next'

const route = useRoute()

const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard Overview',
    '/branches': 'Manajemen Cabang',
    '/categories': 'Kategori Barang',
    '/products': 'Data Master Produk',
    '/inventory': 'Stok Gudang Pusat',
    '/branch-inventory': 'Monitoring Stok Cabang',
    '/staff': 'Manajemen Staff & Akses',
    '/transactions': 'Kasir & Transaksi',
    '/profile': 'Pengaturan Akun',
    '/history': 'Riwayat Transaksi'
  }

  return titles[route.path] || 'Panel Admin'
})

const currentDate = ref('')
const currentTime = ref('')
let timer = null

const updateTime = () => {
  const now = new Date()

  currentDate.value = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  currentTime.value = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 60000) 
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>