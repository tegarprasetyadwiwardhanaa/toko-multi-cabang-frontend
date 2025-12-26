<template>
  <div class="min-h-screen bg-slate-50 font-sans p-4 sm:p-6">
    
    <div class="max-w-6xl mx-auto space-y-6">
      
      <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <History class="w-8 h-8 text-indigo-600" />
            Riwayat Penjualan
          </h2>
          <p class="text-slate-500 mt-1 text-sm">Rekapitulasi transaksi harian toko Anda.</p>
        </div>

        <div class="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
            <div class="flex gap-1 bg-slate-100 p-1 rounded-lg">
                <button @click="setFilter('today')" :class="filterMode === 'today' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 text-xs font-bold rounded-md transition-all">Hari Ini</button>
                <button @click="setFilter('yesterday')" :class="filterMode === 'yesterday' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="px-3 py-1.5 text-xs font-bold rounded-md transition-all">Kemarin</button>
            </div>

            <div class="flex items-center gap-2 px-2">
                <div class="relative">
                    <Calendar class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input v-model="startDate" type="date" class="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 text-slate-600 font-medium cursor-pointer hover:bg-white transition-colors" />
                </div>
                <span class="text-slate-300 font-bold">-</span>
                <input v-model="endDate" type="date" class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 text-slate-600 font-medium cursor-pointer hover:bg-white transition-colors" />
                
                <button 
                    @click="fetchTransactions" 
                    class="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg transition-colors shadow-sm ml-1"
                    title="Terapkan Filter"
                >
                    <Search class="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/20 transition-all"></div>
            
            <div class="relative z-10">
                <p class="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <TrendingUp class="w-4 h-4" /> Total Omset
                </p>
                <h3 class="text-3xl font-extrabold tracking-tight">Rp {{ formatPrice(totalRevenue) }}</h3>
                <p class="text-xs text-indigo-200 mt-2 font-medium">Periode: {{ formatDateSimple(startDate) }} - {{ formatDateSimple(endDate) }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner">
                <Wallet class="w-8 h-8 text-white" />
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
             <div class="flex items-center gap-3 mb-2">
                 <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                     <Receipt class="w-5 h-5" />
                 </div>
                 <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Jumlah Transaksi</span>
             </div>
             <p class="text-2xl font-bold text-slate-800">{{ transactions.length }} <span class="text-sm font-medium text-slate-400">Nota</span></p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Info Nota</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kasir</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Belanja</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              
              <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-24"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-32"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-20"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-24 ml-auto"></div></td>
                 <td class="px-6 py-4"><div class="h-8 w-8 bg-slate-100 rounded-full mx-auto"></div></td>
              </tr>

              <tr v-else-if="transactions.length === 0">
                <td colspan="5" class="px-6 py-16 text-center">
                   <div class="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                       <FileSearch class="w-8 h-8 text-slate-300" />
                   </div>
                   <p class="text-slate-500 font-medium">Tidak ada data transaksi</p>
                   <p class="text-xs text-slate-400 mt-1">Coba ubah filter tanggal di atas.</p>
                </td>
              </tr>
              
              <tr 
                v-else
                v-for="trx in transactions" 
                :key="trx._id" 
                class="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                @click="viewDetail(trx._id)"
              >
                <td class="px-6 py-4">
                   <div class="flex items-center gap-3">
                       <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                           <Receipt class="w-4 h-4" />
                       </div>
                       <div>
                           <span class="font-mono font-bold text-slate-700 block text-sm">{{ trx.no_nota }}</span>
                           <span class="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-bold">LUNAS</span>
                       </div>
                   </div>
                </td>
                
                <td class="px-6 py-4 text-sm text-slate-600">
                   <div class="flex flex-col">
                       <span class="font-bold text-slate-700">{{ formatDateOnly(trx.createdAt) }}</span>
                       <span class="text-xs text-slate-400 font-mono">{{ formatTimeOnly(trx.createdAt) }} WIB</span>
                   </div>
                </td>
                
                <td class="px-6 py-4">
                   <div class="flex items-center gap-2">
                       <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                           {{ (trx.cashier_name?.[0] || 'K').toUpperCase() }}
                       </div>
                       <span class="text-sm font-medium text-slate-700 capitalize">{{ trx.cashier_name || 'Kasir' }}</span>
                   </div>
                </td>
                
                <td class="px-6 py-4 text-right">
                  <span class="text-sm font-bold text-slate-800 font-mono tracking-tight">
                    Rp {{ formatPrice(trx.total) }}
                  </span>
                </td>
                
                <td class="px-6 py-4 text-center">
                  <button 
                    class="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
                    title="Lihat Detail"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

            <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] transform transition-all animate-bounce-in">
                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">Detail Transaksi</h3>
                        <p class="text-xs text-slate-500 font-mono">{{ selectedTransaction?.no_nota }}</p>
                    </div>
                    <button @click="closeModal" class="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <div class="p-0 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
                    <div v-if="detailLoading" class="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Loader2 class="w-8 h-8 animate-spin text-indigo-500 mb-2" />
                        <p class="text-xs">Memuat struk...</p>
                    </div>

                    <div v-else-if="selectedTransaction" class="bg-white m-4 p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div class="text-center mb-6 border-b border-dashed border-slate-200 pb-4">
                            <h4 class="font-bold text-slate-800 text-lg mb-1">TOKO ANDA</h4>
                            <p class="text-xs text-slate-500">{{ formatDate(selectedTransaction.createdAt) }}</p>
                            <p class="text-xs text-slate-400">Kasir: {{ selectedTransaction.cashier_name }}</p>
                        </div>

                        <div class="space-y-3 mb-6">
                            <div v-for="item in selectedTransaction.items" :key="item._id" class="flex justify-between text-sm group">
                                <div class="flex-1">
                                    <p class="font-bold text-slate-700">{{ item.product?.nama_barang || 'Item Terhapus' }}</p>
                                    <p class="text-xs text-slate-500 font-mono">
                                        {{ item.qty }} x {{ formatPrice(item.harga) }}
                                    </p>
                                </div>
                                <div class="text-right font-medium text-slate-800">
                                    {{ formatPrice(item.subtotal) }}
                                </div>
                            </div>
                        </div>

                        <div class="border-t border-dashed border-slate-300 pt-4 space-y-1">
                            <div class="flex justify-between text-sm font-bold text-slate-800">
                                <span>TOTAL</span>
                                <span>Rp {{ formatPrice(selectedTransaction.total) }}</span>
                            </div>
                            <div class="flex justify-between text-xs text-slate-500">
                                <span>Tunai</span>
                                <span>Rp {{ formatPrice(selectedTransaction.uang_bayar) }}</span>
                            </div>
                            <div class="flex justify-between text-xs text-slate-500">
                                <span>Kembali</span>
                                <span>Rp {{ formatPrice(selectedTransaction.kembalian) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 border-t border-slate-100 bg-white flex gap-3">
                    <button 
                        @click="closeModal" 
                        class="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl font-bold text-sm transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '../../api/axios'; 
import { 
  History, Loader2, Eye, X, Clock, Calendar, 
  TrendingUp, Wallet, Receipt, FileSearch, Search
} from 'lucide-vue-next';
import { Toast } from '../../utils/alert';

// STATE
const transactions = ref([]);
const loading = ref(false);
const showModal = ref(false);
const detailLoading = ref(false);
const selectedTransaction = ref(null);
const filterMode = ref('today'); 

// DATES
const today = new Date().toISOString().split('T')[0];
const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterday = yesterdayDate.toISOString().split('T')[0];

const startDate = ref(today);
const endDate = ref(today);

// HELPERS
const formatPrice = (val) => val?.toLocaleString('id-ID') || '0';
const formatDate = (d) => d ? new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-';
const formatDateOnly = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-';
const formatTimeOnly = (d) => d ? new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':') : '-';
const formatDateSimple = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-';

// COMPUTED
const totalRevenue = computed(() => transactions.value.reduce((acc, trx) => acc + trx.total, 0));

// FILTER LOGIC
const setFilter = (mode) => {
    filterMode.value = mode;
    if (mode === 'today') {
        startDate.value = today;
        endDate.value = today;
    } else if (mode === 'yesterday') {
        startDate.value = yesterday;
        endDate.value = yesterday;
    }
    fetchTransactions();
};

const fetchTransactions = async () => {
  loading.value = true;
  if (startDate.value !== today && startDate.value !== yesterday) filterMode.value = 'custom';

  try {
    const response = await axios.get('/transactions', {
      params: {
        startDate: startDate.value,
        endDate: endDate.value
      }
    });
    transactions.value = response.data;
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal Memuat Data' });
  } finally {
    loading.value = false;
  }
};

// DETAIL LOGIC
const viewDetail = async (id) => {
  showModal.value = true;
  detailLoading.value = true;
  selectedTransaction.value = null;

  try {
    const response = await axios.get(`/transactions/${id}`);
    selectedTransaction.value = response.data;
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal Memuat Detail' });
    showModal.value = false;
  } finally {
    detailLoading.value = false;
  }
};

const closeModal = () => showModal.value = false;

onMounted(() => {
  fetchTransactions();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

/* Animation */
@keyframes bounceIn {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounceIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>