<template>
  <div class="p-6 space-y-6 min-h-screen">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Ringkasan Toko</h1>
        <p class="text-slate-500 text-sm">Pantau performa bisnis Anda secara real-time.</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
        
        <div class="relative">
          <Store class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <select 
            v-model="selectedBranch" 
            @change="fetchDashboardData"
            class="pl-9 pr-8 py-2 text-sm font-medium bg-transparent hover:bg-slate-50 rounded-lg text-slate-700 outline-none cursor-pointer appearance-none transition-colors border-r border-slate-100 sm:border-r-0"
          >
            <option value="all">Semua Cabang</option>
            <option v-for="branch in branches" :key="branch._id" :value="branch._id">
              {{ branch.nama_cabang }}
            </option>
          </select>
          <ChevronDown class="w-4 h-4 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        <div class="hidden sm:block w-px bg-slate-200 my-1"></div>

        <div class="relative">
          <Calendar class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <select 
            v-model="selectedPeriod" 
            @change="fetchDashboardData"
            class="pl-9 pr-8 py-2 text-sm font-medium bg-transparent hover:bg-slate-50 rounded-lg text-slate-700 outline-none cursor-pointer appearance-none transition-colors"
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
            <option value="6m">6 Bulan Terakhir</option>
            <option value="1y">Tahun Ini</option>
          </select>
          <ChevronDown class="w-4 h-4 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group hover:border-indigo-200 transition-all duration-300">
        <div v-if="isLoading" class="animate-pulse w-full">
          <div class="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div class="h-8 bg-slate-200 rounded w-3/4"></div>
        </div>
        <div v-else class="flex flex-col">
          <span class="text-slate-500 text-sm font-medium mb-1">Total Omzet</span>
          <h3 class="text-3xl font-bold text-slate-800 tracking-tight">{{ formatPrice(stats.omzet) }}</h3>
          <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit mt-2 inline-flex items-center gap-1">
             <TrendingUp class="w-3 h-3" /> Revenue
          </span>
        </div>
        <div class="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
          <Wallet class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group hover:border-blue-200 transition-all duration-300">
        <div v-if="isLoading" class="animate-pulse w-full">
          <div class="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div class="h-8 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div v-else class="flex flex-col">
          <span class="text-slate-500 text-sm font-medium mb-1">Total Transaksi</span>
          <h3 class="text-3xl font-bold text-slate-800 tracking-tight">{{ stats.transaksi }}</h3>
          <span class="text-xs font-medium text-slate-400 mt-2">
            Pesanan berhasil
          </span>
        </div>
        <div class="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
          <ShoppingBag class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group hover:border-orange-200 transition-all duration-300">
        <div v-if="isLoading" class="animate-pulse w-full">
          <div class="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div class="h-8 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div v-else class="flex flex-col w-full">
          <span class="text-slate-500 text-sm font-medium mb-1">Produk Terlaris</span>
          <h3 class="text-xl font-bold text-slate-800 tracking-tight line-clamp-1" :title="stats.topProducts[0]?.nama_barang">
            {{ stats.topProducts[0]?.nama_barang || '-' }}
          </h3>
          <span v-if="stats.topProducts[0]" class="text-xs text-orange-600 font-medium mt-2">
            🔥 Terjual {{ stats.topProducts[0]?.qty }} unit
          </span>
        </div>
        <div class="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform shrink-0 ml-4">
          <Award class="w-6 h-6" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-slate-800">Tren Penjualan</h3>
          <div class="flex items-center gap-2 text-xs text-slate-500">
             <span class="w-2 h-2 rounded-full bg-indigo-500"></span> Pendapatan
          </div>
        </div>
        
        <div class="h-72 relative w-full">
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-lg animate-pulse">
            <span class="text-slate-300 font-medium">Memuat Grafik...</span>
          </div>
          <Line v-else-if="lineChartData" :data="lineChartData" :options="lineOptions" />
          <div v-else class="flex items-center justify-center h-full text-slate-400 text-sm">
             Data tidak tersedia
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Top 5 Produk</h3>
        <div class="h-72 relative w-full">
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-lg animate-pulse"></div>
          <Bar v-else-if="barChartData" :data="barChartData" :options="barOptions" />
           <div v-else class="flex items-center justify-center h-full text-slate-400 text-sm">
             Belum ada penjualan
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '../../api/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'vue-chartjs';
// Gunakan icon library yang sama (lucide)
import { Wallet, ShoppingBag, Award, Calendar, Store, ChevronDown, TrendingUp } from 'lucide-vue-next';

// Register ChartJS plugins (tambah Filler untuk area chart)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const branches = ref([]);
const selectedBranch = ref('all');
const selectedPeriod = ref('7d');
const isLoading = ref(true); // Default true saat mounting
const stats = ref({
  omzet: 0,
  transaksi: 0,
  trend: [],
  topProducts: []
});

// --- CHART OPTIONS (Styling Grafik) ---
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  font: { family: "'Inter', sans-serif" }
};

const lineOptions = {
  ...commonOptions,
  scales: {
    y: { 
      beginAtZero: true, 
      grid: { color: '#f1f5f9', borderDash: [5, 5] },
      ticks: { 
        callback: (val) => val >= 1000 ? `${val/1000}k` : val, // Singkat angka ribuan
        font: { size: 11 },
        color: '#64748b'
      },
      border: { display: false }
    },
    x: { 
      grid: { display: false },
      ticks: { font: { size: 11 }, color: '#64748b' },
      border: { display: false }
    }
  },
  plugins: {
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (ctx) => `Rp ${ctx.parsed.y.toLocaleString('id-ID')}`
      }
    }
  }
};

const barOptions = {
  ...commonOptions,
  scales: {
    y: { display: false }, // Sembunyikan axis Y agar bersih
    x: { 
      grid: { display: false },
      ticks: { 
        font: { size: 10 }, 
        autoSkip: false, 
        maxRotation: 45, 
        minRotation: 0 
      },
      border: { display: false }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.parsed.y} Unit`
      }
    }
  }
};

// --- DATA PROCESSING ---
const lineChartData = computed(() => {
  if (!stats.value.trend?.length) return null;
  return {
    labels: stats.value.trend.map(item => {
      const date = new Date(item._id);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [{
      label: 'Omzet',
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
        return gradient;
      },
      borderColor: '#4f46e5',
      borderWidth: 2,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#4f46e5',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      data: stats.value.trend.map(item => item.total),
      tension: 0.4, // Garis melengkung halus
      fill: true
    }]
  };
});

const barChartData = computed(() => {
  if (!stats.value.topProducts?.length) return null;
  return {
    labels: stats.value.topProducts.map(item => 
      item.nama_barang.length > 10 ? item.nama_barang.substring(0,10)+'...' : item.nama_barang
    ),
    datasets: [{
      label: 'Qty',
      backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'],
      data: stats.value.topProducts.map(item => item.qty),
      borderRadius: 6,
      barThickness: 30
    }]
  };
});

const formatPrice = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

const fetchData = async () => {
  isLoading.value = true;
  try {
    // Jalankan parallel request
    const [branchRes, statsRes] = await Promise.all([
      axios.get('/branches'),
      axios.get(`/dashboard/stats`, {
        params: { branchId: selectedBranch.value, period: selectedPeriod.value }
      })
    ]);
    branches.value = branchRes.data;
    stats.value = statsRes.data;
  } catch (e) {
    console.error("Error loading dashboard", e);
  } finally {
    // Beri sedikit delay agar skeleton terlihat smooth
    setTimeout(() => isLoading.value = false, 500);
  }
};

// Method khusus saat filter berubah (tanpa reload branches)
const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`/dashboard/stats`, {
      params: { branchId: selectedBranch.value, period: selectedPeriod.value }
    });
    stats.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);
</script>