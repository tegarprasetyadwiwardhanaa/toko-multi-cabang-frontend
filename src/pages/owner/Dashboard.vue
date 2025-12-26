<template>
  <div class="p-6 space-y-6 min-h-screen animate-fade-in">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Ringkasan Toko</h1>
        <p class="text-slate-500 text-sm mt-1">Pantau performa bisnis dan pertumbuhan omzet Anda.</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
        
        <div class="relative group">
          <Store class="w-4 h-4 text-slate-400 absolute left-3 top-2.5 group-hover:text-indigo-500 transition-colors" />
          <select 
            v-model="selectedBranch" 
            @change="fetchStatsOnly"
            class="pl-9 pr-8 py-2 text-sm font-medium bg-transparent hover:bg-slate-50 rounded-lg text-slate-700 outline-none cursor-pointer appearance-none transition-colors border-r border-slate-100 sm:border-r-0 w-full sm:w-auto focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Semua Cabang</option>
            <option v-for="branch in branches" :key="branch._id" :value="branch._id">
              {{ branch.nama_cabang }}
            </option>
          </select>
          <ChevronDown class="w-4 h-4 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        <div class="hidden sm:block w-px bg-slate-200 my-1"></div>

        <div class="relative group">
          <Calendar class="w-4 h-4 text-slate-400 absolute left-3 top-2.5 group-hover:text-indigo-500 transition-colors" />
          <select 
            v-model="selectedPeriod" 
            @change="fetchStatsOnly"
            class="pl-9 pr-8 py-2 text-sm font-medium bg-transparent hover:bg-slate-50 rounded-lg text-slate-700 outline-none cursor-pointer appearance-none transition-colors w-full sm:w-auto focus:ring-2 focus:ring-indigo-500/20"
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
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group hover:shadow-md hover:border-indigo-200 transition-all duration-300 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        
        <div v-if="isLoading" class="animate-pulse w-full relative z-10">
           <div class="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
           <div class="h-8 bg-slate-200 rounded w-3/4"></div>
        </div>
        <div v-else class="flex flex-col relative z-10">
          <span class="text-slate-500 text-sm font-medium mb-1">Total Omzet</span>
          <h3 class="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">{{ formatPrice(stats.omzet) }}</h3>
          <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit mt-2 inline-flex items-center gap-1">
             <TrendingUp class="w-3 h-3" /> Revenue
          </span>
        </div>
        <div class="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors relative z-10 shadow-sm">
          <Wallet class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

        <div v-if="isLoading" class="animate-pulse w-full relative z-10">
           <div class="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
           <div class="h-8 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div v-else class="flex flex-col relative z-10">
          <span class="text-slate-500 text-sm font-medium mb-1">Total Transaksi</span>
          <h3 class="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">{{ stats.transaksi }}</h3>
          <span class="text-xs font-medium text-slate-400 mt-2">Pesanan berhasil</span>
        </div>
        <div class="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10 shadow-sm">
          <ShoppingBag class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group hover:shadow-md hover:border-orange-200 transition-all duration-300 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

        <div v-if="isLoading" class="animate-pulse w-full relative z-10">
           <div class="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
           <div class="h-8 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div v-else class="flex flex-col w-full relative z-10">
          <span class="text-slate-500 text-sm font-medium mb-1">Produk Terlaris</span>
          <h3 class="text-xl font-bold text-slate-800 tracking-tight line-clamp-1" :title="stats.topProducts[0]?.nama_barang">
            {{ stats.topProducts[0]?.nama_barang || '-' }}
          </h3>
          <span v-if="stats.topProducts[0]" class="text-xs text-orange-600 font-medium mt-2 inline-flex items-center gap-1">
            🔥 Terjual {{ stats.topProducts[0]?.qty }} unit
          </span>
          <span v-else class="text-xs text-slate-400 mt-2">Belum ada data</span>
        </div>
        <div class="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors relative z-10 shrink-0 ml-4 shadow-sm">
          <Award class="w-6 h-6" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-slate-800">Tren Pendapatan</h3>
          <div class="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
             <span class="w-2 h-2 rounded-full bg-indigo-500"></span> Grafik Omzet
          </div>
        </div>
        
        <div class="h-72 relative w-full">
          <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-lg">
            <svg class="animate-spin h-8 w-8 text-indigo-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span class="text-slate-400 text-xs font-medium">Memuat data...</span>
          </div>

          <div v-else-if="!lineChartData" class="flex flex-col items-center justify-center h-full text-slate-400">
             <div class="bg-slate-50 p-4 rounded-full mb-3">
                <TrendingUp class="w-6 h-6 text-slate-300" />
             </div>
             <span class="text-sm">Data grafik belum tersedia untuk periode ini</span>
          </div>

          <Line v-else :data="lineChartData" :options="lineOptions" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Top 5 Produk</h3>
        <div class="h-72 relative w-full">
          
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-lg"></div>
          
          <div v-else-if="!barChartData" class="flex flex-col items-center justify-center h-full text-slate-400">
             <div class="bg-slate-50 p-4 rounded-full mb-3">
                <ShoppingBag class="w-6 h-6 text-slate-300" />
             </div>
             <span class="text-sm">Belum ada penjualan</span>
          </div>

          <Bar v-else :data="barChartData" :options="barOptions" />
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
import { Wallet, ShoppingBag, Award, Calendar, Store, ChevronDown, TrendingUp } from 'lucide-vue-next';
import { Toast } from '../../utils/alert'; // Import Alert Utility yang sudah kita buat

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// STATE
const branches = ref([]);
const selectedBranch = ref('all');
const selectedPeriod = ref('7d');
const isLoading = ref(true);

const stats = ref({
  omzet: 0,
  transaksi: 0,
  trend: [],
  topProducts: []
});

// INITIAL LOAD
const fetchInitialData = async () => {
  isLoading.value = true;
  try {
    const branchRes = await axios.get('/branches');
    branches.value = branchRes.data;
    await fetchStatsOnly();
  } catch (e) {
    console.error("Dashboard Init Error", e);
    // UX: Beritahu user jika inisialisasi gagal total
    Toast.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Periksa koneksi internet Anda.'
    });
  }
};

// FETCH ONLY STATS
const fetchStatsOnly = async () => {
  // Tidak set isLoading=true di sini agar transisi chart lebih halus (tidak flicker skeleton)
  // Kecuali jika datanya berat, boleh di-enable
  // isLoading.value = true; 
  
  try {
    const res = await axios.get(`/dashboard/stats`, {
      params: { 
        branchId: selectedBranch.value, 
        period: selectedPeriod.value 
      }
    });
    stats.value = res.data;
  } catch (e) {
    console.error("Stats Error", e);
    Toast.fire({
        icon: 'error',
        title: 'Gagal Update Data',
        text: 'Tidak dapat mengambil statistik terbaru.'
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchInitialData);

// --- COMPUTED CHART DATA ---
const lineChartData = computed(() => {
  if (!stats.value.trend || stats.value.trend.length === 0) return null;
  
  return {
    labels: stats.value.trend.map(item => {
      // Format tanggal yang lebih ramah
      const date = new Date(item._id); // Pastikan item._id format ISO YYYY-MM-DD
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    }),
    datasets: [{
      label: 'Omzet',
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.25)'); // Indigo lebih solid
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
        return gradient;
      },
      borderColor: '#4f46e5',
      borderWidth: 2,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#4f46e5',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      data: stats.value.trend.map(item => item.total),
      tension: 0.4, // Kurva lebih halus
      fill: true
    }]
  };
});

const barChartData = computed(() => {
  if (!stats.value.topProducts || stats.value.topProducts.length === 0) return null;
  
  return {
    labels: stats.value.topProducts.map(item => 
      item.nama_barang.length > 12 ? item.nama_barang.substring(0,12)+'...' : item.nama_barang
    ),
    datasets: [{
      label: 'Terjual (Unit)',
      backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'],
      data: stats.value.topProducts.map(item => item.qty),
      borderRadius: 6,
      barThickness: 'flex', // Responsif
      maxBarThickness: 40
    }]
  };
});

// OPTIONS CHART
const formatShortCurrency = (value) => {
    if (value >= 1000000000) return 'Rp' + (value / 1000000000).toFixed(1) + 'M';
    if (value >= 1000000) return 'Rp' + (value / 1000000).toFixed(1) + 'jt';
    if (value >= 1000) return 'Rp' + (value / 1000).toFixed(0) + 'rb';
    return value;
};

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
      legend: { display: false },
      tooltip: {
          backgroundColor: '#1e293b',
          padding: 12,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", size: 13 },
          bodyFont: { family: "'Inter', sans-serif", size: 12 },
          displayColors: false, // Hilangkan kotak warna di tooltip
          callbacks: {
              label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                      label += ': ';
                  }
                  if (context.parsed.y !== null) {
                      // Format Rupiah di Tooltip
                      label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.parsed.y);
                  }
                  return label;
              }
          }
      }
  },
  font: { family: "'Inter', sans-serif" }
};

const lineOptions = {
  ...commonOptions,
  scales: {
    y: { 
        beginAtZero: true, 
        grid: { color: '#f1f5f9', drawBorder: false }, 
        ticks: { 
            font: { size: 10 },
            color: '#94a3b8',
            callback: (val) => formatShortCurrency(val) // Gunakan format singkatan (1jt, 2jt)
        },
        border: { display: false }
    },
    x: { 
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#64748b' }
    }
  },
  interaction: {
      mode: 'index',
      intersect: false,
  },
};

const barOptions = {
  ...commonOptions,
  scales: { 
      y: { display: false }, 
      x: { 
          grid: { display: false },
          ticks: { font: { size: 10 }, color: '#64748b' }
      } 
  }
};

const formatPrice = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>