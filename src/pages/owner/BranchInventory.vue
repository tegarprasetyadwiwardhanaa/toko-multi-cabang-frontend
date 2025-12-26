<template>
  <div class="space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Stok & Harga Cabang</h2>
        <p class="text-slate-500 text-sm mt-1">Monitoring stok fisik dan penyesuaian harga jual per lokasi.</p>
      </div>

      <div class="w-full md:w-80">
         <div class="relative group">
            <Store class="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
            <select 
              v-model="selectedBranch" 
              @change="fetchInventory" 
              class="pl-12 w-full appearance-none border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-white transition-all cursor-pointer hover:border-indigo-200"
            >
              <option value="" disabled>-- Pilih Lokasi Cabang --</option>
              <option v-for="b in branches" :key="b._id" :value="b._id">
                {{ b.nama_cabang }}
              </option>
            </select>
            <ChevronDown class="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
         </div>
      </div>
    </div>

    <div v-if="!selectedBranch" class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center animate-fade-in">
      <div class="bg-indigo-50 p-6 rounded-full shadow-sm mb-6 animate-bounce-slow">
        <MapPin class="w-12 h-12 text-indigo-400" />
      </div>
      <h3 class="text-xl font-bold text-slate-800 mb-2">Pilih Cabang Terlebih Dahulu</h3>
      <p class="text-slate-500 max-w-md mx-auto leading-relaxed">Silakan pilih cabang melalui dropdown di pojok kanan atas untuk melihat stok fisik dan mengatur harga jual khusus wilayah tersebut.</p>
    </div>

    <div v-else class="space-y-6 animate-slide-up">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Total Stok Fisik</p>
                    <p v-if="loading" class="h-8 w-24 bg-slate-100 rounded animate-pulse"></p>
                    <p v-else class="text-2xl font-bold text-slate-800">{{ totalItems }} <span class="text-sm font-medium text-slate-400">Unit</span></p>
                </div>
                <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Box class="w-6 h-6" />
                </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Estimasi Aset (Modal)</p>
                    <p v-if="loading" class="h-8 w-32 bg-slate-100 rounded animate-pulse"></p>
                    <p v-else class="text-2xl font-bold text-indigo-600 font-mono">{{ formatRupiah(totalAsset) }}</p>
                </div>
                <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Banknote class="w-6 h-6" />
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[500px] overflow-hidden">
            
            <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                <div class="relative w-full sm:w-96">
                    <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        placeholder="Cari kode atau nama barang..." 
                        class="pl-10 pr-4 py-2.5 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                    />
                </div>
                <div class="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm whitespace-nowrap">
                    Menampilkan <span class="font-bold text-indigo-600">{{ filteredItems.length }}</span> produk
                </div>
            </div>

            <div class="overflow-x-auto flex-1">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produk</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Stok</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Modal (Pusat)</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-64">Harga Jual (Cabang)</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-24">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        
                        <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                            <td class="px-6 py-4">
                                <div class="space-y-2">
                                    <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                                    <div class="h-3 bg-slate-100 rounded w-1/4"></div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center"><div class="h-6 w-12 bg-slate-100 rounded mx-auto"></div></td>
                            <td class="px-6 py-4 text-right"><div class="h-4 w-20 bg-slate-100 rounded ml-auto"></div></td>
                            <td class="px-6 py-4"><div class="h-10 w-full bg-slate-100 rounded"></div></td>
                            <td class="px-6 py-4"><div class="h-8 w-8 bg-slate-100 rounded mx-auto"></div></td>
                        </tr>

                        <tr v-else-if="filteredItems.length === 0">
                            <td colspan="5" class="p-16 text-center text-slate-500">
                                <p class="font-bold text-slate-700 mb-1">Produk tidak ditemukan</p>
                                <p class="text-sm text-slate-400">Pastikan pencarian benar atau lakukan distribusi stok dari Gudang Pusat.</p>
                            </td>
                        </tr>
                        
                        <tr v-else v-for="item in filteredItems" :key="item._id" class="hover:bg-slate-50/80 transition-colors group">
                            <td class="px-6 py-4 align-middle">
                                <div class="flex flex-col">
                                    <span class="font-bold text-slate-700 text-sm">{{ item.nama_barang }}</span>
                                    <span class="text-[11px] text-slate-400 font-mono mt-0.5 bg-slate-100 w-fit px-1 rounded">{{ item.kode_barang }}</span>
                                </div>
                            </td>
                            
                            <td class="px-6 py-4 align-middle text-center">
                                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-sm">
                                    {{ item.stok }} {{ item.satuan }}
                                </span>
                            </td>

                            <td class="px-6 py-4 align-middle text-right">
                                <span class="text-xs font-mono text-slate-400">{{ formatRupiah(item.harga_modal) }}</span>
                            </td>

                            <td class="px-6 py-4 align-middle text-right">
                                <div class="relative">
                                    <span class="absolute left-3 top-2.5 text-xs font-medium transition-colors z-10"
                                        :class="item.edit_price !== item.harga_jual ? 'text-amber-700' : 'text-slate-400'">Rp</span>
                                    
                                    <input 
                                        type="number" 
                                        v-model="item.edit_price" 
                                        class="w-full pl-8 pr-10 py-2 border rounded-lg text-right text-sm font-bold focus:ring-2 outline-none transition-all"
                                        :class="[
                                            item.edit_price !== item.harga_jual 
                                                ? 'border-amber-400 bg-amber-50 text-amber-800 focus:ring-amber-500/50' 
                                                : 'border-slate-200 text-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500 bg-white'
                                        ]"
                                        @keyup.enter="savePrice(item)"
                                    />
                                    
                                    <button 
                                        v-if="item.edit_price !== item.harga_jual"
                                        @click="item.edit_price = item.harga_jual"
                                        class="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-red-500 transition-colors"
                                        title="Reset Harga"
                                    >
                                        <X class="w-4 h-4" />
                                    </button>
                                </div>
                                <div v-if="item.edit_price !== item.harga_jual" class="text-[10px] text-amber-600 mt-1 text-right font-medium animate-pulse">
                                    Belum disimpan
                                </div>
                            </td>

                            <td class="px-6 py-4 align-middle text-center">
                                <button 
                                    @click="savePrice(item)"
                                    :disabled="item.edit_price === item.harga_jual || isSaving === item._id" 
                                    class="w-9 h-9 rounded-lg transition-all duration-200 flex items-center justify-center mx-auto relative group/btn"
                                    :class="[
                                        item.edit_price !== item.harga_jual 
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:-translate-y-0.5' 
                                            : 'text-slate-300 bg-slate-100 cursor-not-allowed'
                                    ]"
                                    title="Simpan Perubahan"
                                >
                                    <Loader2 v-if="isSaving === item._id" class="w-4 h-4 animate-spin" />
                                    <Save v-else class="w-4 h-4" />
                                    
                                    <span v-if="item.edit_price !== item.harga_jual" class="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        Simpan
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/axios";
import { Store, Search, Save, MapPin, Box, Banknote, ChevronDown, X, Loader2 } from 'lucide-vue-next';
import { Toast, ConfirmAlert } from '../../utils/alert'; 

// State
const branches = ref([]);
const selectedBranch = ref("");
const inventory = ref([]);
const loading = ref(false);
const isSaving = ref(null); 
const searchQuery = ref("");

const formatRupiah = (val) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

// Load Daftar Cabang
onMounted(async () => {
  try {
    const res = await api.get("/branches");
    branches.value = res.data.filter(b => b.is_active);
  } catch (e) {
    console.error("Gagal load cabang", e);
  }
});

const fetchInventory = async () => {
  if (!selectedBranch.value) return;
  
  loading.value = true;
  inventory.value = []; 
  searchQuery.value = ""; 
  
  try {
    const res = await api.get(`/inventory/branch-list/${selectedBranch.value}`);
    inventory.value = res.data.map(item => ({
      ...item,
      edit_price: item.harga_jual 
    }));
  } catch (e) {
    Toast.fire({
        icon: 'error',
        title: 'Gagal Memuat Stok',
        text: 'Terjadi kesalahan pada server.'
    });
  } finally {
    loading.value = false;
  }
};

// Filter Search (Client Side)
const filteredItems = computed(() => {
  if (!inventory.value) return [];
  if (!searchQuery.value) return inventory.value;
  
  const lower = searchQuery.value.toLowerCase();
  return inventory.value.filter(item => 
    item.nama_barang.toLowerCase().includes(lower) || 
    item.kode_barang.toLowerCase().includes(lower)
  );
});

const totalItems = computed(() => inventory.value.reduce((acc, item) => acc + item.stok, 0));
const totalAsset = computed(() => inventory.value.reduce((acc, item) => acc + (item.stok * item.harga_modal), 0));

const savePrice = async (item) => {
  const newPrice = Number(item.edit_price);
  const modalPrice = item.harga_modal;

  if (newPrice < 0) {
      Toast.fire({ icon: 'warning', title: 'Harga tidak valid' });
      return;
  }

  if (newPrice < modalPrice) {
    const result = await ConfirmAlert.fire({
        title: 'Harga Di Bawah Modal!',
        text: `Harga jual (Rp ${formatRupiah(newPrice)}) lebih rendah dari modal (Rp ${formatRupiah(modalPrice)}). Lanjutkan?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Simpan',
        confirmButtonColor: '#d97706', 
        cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) {
        item.edit_price = item.harga_jual; 
        return; 
    }
  }

  isSaving.value = item._id; 

  try {
    await api.put(`/inventory/price/${item._id}`, {
      harga_jual: item.edit_price
    });
    
    item.harga_jual = item.edit_price;
    
    Toast.fire({
        icon: 'success',
        title: 'Harga Diperbarui'
    });
    
  } catch (e) {
    ConfirmAlert.fire({
        icon: 'error',
        title: 'Gagal',
        text: e.response?.data?.message || "Gagal menyimpan harga"
    });
  } finally {
    isSaving.value = null; 
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
.animate-slide-up { animation: slideUp 0.5s ease-out; }
.animate-bounce-slow { animation: bounce 3s infinite; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>