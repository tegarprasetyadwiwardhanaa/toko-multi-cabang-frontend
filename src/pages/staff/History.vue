<template>
  <div class="min-h-screen bg-gray-50 font-sans p-6">
    
    <div class="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <History class="w-8 h-8 text-indigo-600" />
          Riwayat Transaksi
        </h2>
        <p class="text-slate-500 mt-1">Pantau semua pemasukan dan detail penjualan toko Anda.</p>
      </div>
      
      <div class="flex gap-2">
        <button class="bg-white border border-gray-300 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
          <Calendar class="w-4 h-4" />
          Filter Tanggal
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      
      <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-slate-400">
        <Loader2 class="w-10 h-10 animate-spin mb-3 text-indigo-500" />
        <p>Sedang memuat data transaksi...</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-gray-200">
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Transaksi</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Belanja</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="transactions.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-slate-500 italic">
                  Belum ada transaksi yang tercatat.
                </td>
              </tr>
              
              <tr 
                v-for="trx in transactions" 
                :key="trx._id" 
                class="hover:bg-indigo-50/30 transition-colors duration-150 group"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                    #{{ trx._id.slice(-6).toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  <div class="flex items-center gap-2">
                    <Clock class="w-4 h-4 text-slate-400" />
                    {{ formatDate(trx.createdAt) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    Rp {{ formatPrice(trx.total) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button 
                    @click="viewDetail(trx._id)"
                    class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 shadow-sm hover:shadow transition-all"
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

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
        
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 class="text-lg font-bold text-slate-800">Detail Transaksi</h3>
            <p v-if="selectedTransaction" class="text-xs text-slate-500 font-mono mt-0.5">ID: #{{ selectedTransaction._id.toUpperCase() }}</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <div v-if="detailLoading" class="flex justify-center py-8">
            <Loader2 class="w-8 h-8 animate-spin text-indigo-500" />
          </div>

          <div v-else-if="selectedTransaction" class="space-y-6">
            
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Item Pembelian</p>
              <div class="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                <div v-for="item in selectedTransaction.items" :key="item._id" class="flex justify-between items-start text-sm border-b border-dashed border-gray-200 last:border-0 pb-2 last:pb-0">
                  <div class="flex-1">
                    <p class="font-medium text-slate-700">{{ item.product?.nama_barang || 'Item dihapus' }}</p>
                    <p class="text-xs text-slate-400">{{ item.qty }} x Rp {{ formatPrice(item.harga) }}</p>
                  </div>
                  <div class="font-semibold text-slate-700">
                    Rp {{ formatPrice(item.subtotal) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500">Total Tagihan</span>
                <span class="font-bold text-lg text-slate-800">Rp {{ formatPrice(selectedTransaction.total) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500">Uang Diterima</span>
                <span class="font-mono text-slate-700">Rp {{ formatPrice(selectedTransaction.uang_bayar) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                <span class="text-emerald-600 font-medium">Kembalian</span>
                <span class="font-bold text-emerald-600">Rp {{ formatPrice(selectedTransaction.kembalian) }}</span>
              </div>
            </div>

            <div class="text-center pt-4 border-t border-gray-100">
               <p class="text-xs text-slate-400">Transaksi dibuat pada</p>
               <p class="text-sm font-medium text-slate-600">{{ formatDate(selectedTransaction.createdAt) }}</p>
            </div>

          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button @click="printReceipt" class="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-200">
            <Printer class="w-4 h-4" />
            Cetak Struk
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../api/axios'; 
// IMPORT ICON DARI LUCIDE
import { 
  History, 
  Loader2, 
  Eye, 
  X, 
  Printer, 
  Clock,
  Calendar
} from 'lucide-vue-next';

// STATE
const transactions = ref([]);
const loading = ref(false);
const showModal = ref(false);
const detailLoading = ref(false);
const selectedTransaction = ref(null);

// HELPERS
const formatPrice = (val) => val?.toLocaleString('id-ID') || '0';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { 
    day: 'numeric', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// FETCH ALL TRANSACTIONS
const fetchTransactions = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/transactions');
    transactions.value = response.data;
  } catch (error) {
    console.error("Gagal ambil history:", error);
  } finally {
    loading.value = false;
  }
};

// VIEW DETAIL
const viewDetail = async (id) => {
  showModal.value = true;
  detailLoading.value = true;
  selectedTransaction.value = null;

  try {
    const response = await axios.get(`/transactions/${id}`);
    selectedTransaction.value = response.data;
  } catch (error) {
    console.error(error);
    alert("Gagal memuat detail transaksi.");
    showModal.value = false;
  } finally {
    detailLoading.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
};

const printReceipt = () => {
  // Disini nanti logic window.print() atau thermal printer
  alert("Sedang menghubungkan ke printer...");
};

// LIFECYCLE
onMounted(() => {
  fetchTransactions();
});
</script>