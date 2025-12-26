<template>
  <div class="space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Stok Gudang Utama</h2>
        <p class="text-slate-500 text-sm mt-1">Pusat kendali stok masuk (Supplier) dan distribusi ke cabang.</p>
      </div>
      
      <div class="bg-indigo-900 text-white px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-3">
        <div class="p-2 bg-white/10 rounded-lg">
            <Wallet class="w-5 h-5 text-indigo-200" />
        </div>
        <div>
            <p class="text-xs text-indigo-200 font-medium uppercase tracking-wider">Estimasi Aset Stok</p>
            <p class="font-bold text-lg leading-none">{{ formatRupiah(summary.totalAsset) }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
      
      <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div class="relative w-full sm:w-72">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-slate-400" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out shadow-sm" 
            placeholder="Cari produk / kode..." 
          />
        </div>

        <div class="flex items-center gap-2 text-sm text-slate-600 w-full sm:w-auto justify-between sm:justify-end">
          <span class="font-medium text-slate-500">Show:</span>
          <select 
            v-model="limit" 
            @change="fetchData(1)" 
            class="border-slate-200 rounded-lg text-sm py-1.5 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm cursor-pointer"
          >
            <option :value="10">10 baris</option>
            <option :value="20">20 baris</option>
            <option :value="50">50 baris</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produk</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Stok Fisik</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Harga Modal</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Jual (Pusat)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
               <td class="px-6 py-4">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-slate-100 rounded-lg"></div>
                    <div class="space-y-2 w-32">
                        <div class="h-4 bg-slate-100 rounded"></div>
                        <div class="h-3 bg-slate-100 rounded w-2/3"></div>
                    </div>
                 </div>
               </td>
               <td class="px-6 py-4"><div class="h-6 bg-slate-100 rounded mx-auto w-16"></div></td>
               <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded ml-auto w-24"></div></td>
               <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded ml-auto w-24"></div></td>
               <td class="px-6 py-4"><div class="h-8 bg-slate-100 rounded mx-auto w-20"></div></td>
            </tr>

            <tr v-else-if="items.length === 0">
               <td colspan="5" class="p-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <div class="bg-slate-50 p-4 rounded-full mb-3 ring-1 ring-slate-100">
                        <PackageOpen class="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 class="text-slate-800 font-bold">Produk Tidak Ditemukan</h3>
                    <p class="text-slate-500 text-sm mt-1">Coba kata kunci lain atau tambahkan produk baru di menu Master Produk.</p>
                  </div>
               </td>
            </tr>

            <tr 
              v-else
              v-for="item in items" 
              :key="item._id" 
              class="hover:bg-slate-50 transition-colors group"
              :class="{'opacity-60 bg-slate-50 grayscale': !item.is_active}"
            >
              <td class="px-6 py-4 align-middle">
                <div class="flex items-center">
                   <div :class="item.is_active ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-200 text-slate-500 border-slate-300'" 
                        class="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xs mr-3 border shrink-0">
                      {{ item.kode_barang.substring(0,2).toUpperCase() }}
                   </div>
                   <div>
                      <div class="font-bold text-slate-800 text-sm line-clamp-1" :class="{'line-through decoration-slate-400': !item.is_active}">
                        {{ item.nama_barang }}
                      </div>
                      <div class="flex gap-2 mt-1 items-center">
                        <span class="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {{ item.kode_barang }}
                        </span>
                        <span v-if="!item.is_active" class="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 font-medium">Non-Aktif</span>
                      </div>
                   </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center align-middle">
                <div class="inline-flex flex-col items-center">
                    <span 
                    class="px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm"
                    :class="getStokColor(item.stok)"
                    >
                    {{ item.stok }} {{ item.satuan }}
                    </span>
                    <span v-if="item.stok <= 5" class="text-[10px] text-red-500 font-medium mt-1 animate-pulse">Stok Menipis!</span>
                </div>
              </td>

              <td class="px-6 py-4 text-right align-middle font-mono text-sm text-slate-600">
                  {{ formatRupiah(item.harga_modal) }}
              </td>
              <td class="px-6 py-4 text-right align-middle font-mono text-sm text-slate-800 font-bold">
                  {{ formatRupiah(item.harga_jual) }}
              </td>

              <td class="px-6 py-4 text-center align-middle">
                <div class="flex justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="openUpdateModal(item)" 
                    :disabled="!item.is_active"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed tooltip-trigger"
                    title="Update Stok / Harga"
                  >
                    <PackagePlus class="w-4 h-4" />
                  </button>

                  <button 
                    @click="openRestockModal(item)" 
                    :disabled="!item.is_active || item.stok <= 0"
                    class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg border border-transparent hover:border-orange-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed tooltip-trigger"
                    title="Distribusi ke Cabang"
                  >
                    <Truck class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between" v-if="totalPages > 1">
        <span class="text-sm text-slate-500">Hal <b>{{ currentPage }}</b> dari <b>{{ totalPages }}</b></span>
        <div class="flex gap-2">
          <button 
            @click="fetchData(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-slate-300 rounded-md bg-white text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700"
          >Prev</button>
          <button 
            @click="fetchData(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-slate-300 rounded-md bg-white text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700"
          >Next</button>
        </div>
      </div>
    </div>

    <transition name="modal">
        <div v-if="showUpdateModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="showUpdateModal = false"></div>
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                
                <div class="px-6 py-4 border-b border-indigo-100 flex justify-between items-center bg-indigo-50">
                    <div>
                        <h3 class="text-lg font-bold text-indigo-900">Update Inventori</h3>
                        <p class="text-xs text-indigo-600 font-medium">{{ selectedItem?.nama_barang }}</p>
                    </div>
                    <button @click="showUpdateModal = false" class="text-slate-400 hover:text-indigo-600"><X class="w-5 h-5" /></button>
                </div>
                
                <form @submit.prevent="submitUpdate" class="p-6 space-y-5">
                    
                    <div class="grid grid-cols-2 gap-3">
                        <label class="cursor-pointer">
                            <input type="radio" v-model="formUpdate.type" value="add" class="peer sr-only" />
                            <div class="border-2 border-slate-200 rounded-xl p-3 text-center peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition-all hover:bg-slate-50">
                                <span class="block text-sm font-bold text-slate-700 peer-checked:text-indigo-700">Pembelian</span>
                                <span class="text-[10px] text-slate-500">Tambah Stok Masuk</span>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" v-model="formUpdate.type" value="set" class="peer sr-only" />
                            <div class="border-2 border-slate-200 rounded-xl p-3 text-center peer-checked:border-red-500 peer-checked:bg-red-50 transition-all hover:bg-slate-50">
                                <span class="block text-sm font-bold text-slate-700 peer-checked:text-red-700">Stock Opname</span>
                                <span class="text-[10px] text-slate-500">Koreksi/Reset Stok</span>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">
                            {{ formUpdate.type === 'add' ? 'Jumlah Barang Masuk' : 'Total Stok Fisik Saat Ini' }}
                        </label>
                        <input type="number" v-model="formUpdate.stok" class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-lg" required min="1" />
                    </div>

                    <div class="h-px bg-slate-100 my-2"></div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Harga Modal Baru</label>
                            <div class="relative">
                                <span class="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                                <input type="number" v-model="formUpdate.harga_modal" class="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Tetap" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Harga Jual Baru</label>
                            <div class="relative">
                                <span class="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                                <input type="number" v-model="formUpdate.harga_jual" class="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Tetap" />
                            </div>
                        </div>
                    </div>

                    <div v-if="isPotentialLoss" class="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg flex items-start gap-3 animate-pulse">
                        <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                            <p class="text-sm font-bold text-amber-800">Potensi Kerugian Deteksi!</p>
                            <p class="text-xs text-amber-700 mt-1">Harga Jual lebih rendah daripada Harga Modal. Pastikan ini bukan kesalahan input.</p>
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 active:scale-95 transition-all">
                        Simpan Pembaruan
                    </button>
                </form>
            </div>
        </div>
        </div>
    </transition>

    <transition name="modal">
        <div v-if="showRestockModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="showRestockModal = false"></div>
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                
                <div class="px-6 py-4 border-b border-orange-100 flex justify-between items-center bg-orange-50">
                    <div>
                        <h3 class="text-lg font-bold text-orange-900 flex items-center gap-2">
                            <Truck class="w-5 h-5" /> Distribusi Cabang
                        </h3>
                        <p class="text-xs text-orange-700">{{ selectedItem?.nama_barang }}</p>
                    </div>
                    <button @click="showRestockModal = false" class="text-slate-400 hover:text-orange-600"><X class="w-5 h-5" /></button>
                </div>

                <form @submit.prevent="submitRestock" class="p-6 space-y-5">
                    
                    <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div class="flex items-center gap-2">
                            <PackageOpen class="w-4 h-4 text-slate-500" />
                            <span class="text-sm font-medium text-slate-600">Sisa di Gudang:</span>
                        </div>
                        <span class="font-bold text-slate-800 text-lg">{{ selectedItem?.stok }} {{ selectedItem?.satuan }}</span>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">Cabang Tujuan</label>
                        <select v-model="formRestock.branch" @change="fetchBranchStock" class="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm" required>
                            <option value="">-- Pilih Cabang --</option>
                            <option v-for="b in activeBranches" :key="b._id" :value="b._id">{{ b.nama_cabang }}</option>
                        </select>
                    </div>

                    <div v-if="formRestock.branch" class="text-xs flex items-center justify-between text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 animate-fade-in">
                         <span>Stok saat ini di cabang:</span>
                         <span class="font-bold" v-if="loadingStock">Memuat...</span>
                         <span class="font-bold" v-else>{{ targetBranchStock }} Unit</span>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                           <label class="block text-sm font-bold text-slate-700 mb-1.5">Jumlah Kirim</label>
                           <input type="number" v-model="formRestock.qty" :max="selectedItem?.stok" class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-bold" required min="1" />
                        </div>
                        <div>
                           <label class="block text-sm font-bold text-slate-700 mb-1.5">Set Harga Jual</label>
                           <div class="relative">
                               <span class="absolute left-3 top-2.5 text-slate-400 text-sm">Rp</span>
                               <input type="number" v-model="formRestock.harga_jual_cabang" class="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                           </div>
                        </div>
                    </div>
                    
                    <p class="text-[10px] text-slate-400 text-center">*Harga jual default mengikuti harga jual cabang sebelumnya atau gudang pusat.</p>

                    <button type="submit" class="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Truck class="w-5 h-5" /> Proses Pengiriman
                    </button>
                </form>
            </div>
        </div>
        </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import api from "../../api/axios";
import { PackagePlus, Truck, Search, X, PackageOpen, Wallet, AlertTriangle } from 'lucide-vue-next';
import { Toast, ConfirmAlert } from '../../utils/alert';

// State
const items = ref([]);
const branches = ref([]);
const loading = ref(true); // Default true agar skeleton muncul
const summary = ref({ totalAsset: 0 });

// Pagination & Filter
const page = ref(1);
const limit = ref(10);
const searchQuery = ref("");
const totalPages = ref(1);
const currentPage = ref(1);

// Modals
const showUpdateModal = ref(false);
const showRestockModal = ref(false);
const selectedItem = ref(null);

// Forms
const formUpdate = ref({ type: 'add', stok: 0, harga_modal: 0, harga_jual: 0 });
const formRestock = ref({ branch: "", qty: 1, harga_jual_cabang: 0 });

// Extra State
const targetBranchStock = ref(0);
const loadingStock = ref(false);

const formatRupiah = (val) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

// Helper Visual Stok
const getStokColor = (stok) => {
    if (stok <= 5) return 'bg-red-50 text-red-600 border-red-200';
    if (stok <= 20) return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-emerald-50 text-emerald-600 border-emerald-200';
};

// --- DATA FETCHING ---
const fetchData = async (p = 1) => {
  if(items.value.length === 0) loading.value = true;
  
  try {
    const res = await api.get("/inventory/main", {
      params: { page: p, limit: limit.value, search: searchQuery.value }
    });
    
    items.value = res.data.data;
    currentPage.value = res.data.currentPage;
    totalPages.value = res.data.totalPages;
    
    summary.value.totalAsset = items.value.reduce((acc, i) => acc + (i.stok * i.harga_modal), 0);
    
  } catch (e) {
    Toast.fire({ icon: 'error', title: 'Gagal Memuat Data', text: 'Periksa koneksi server.' });
  } finally {
    loading.value = false;
  }
};

const fetchBranches = async () => {
  try {
      const res = await api.get("/branches");
      branches.value = res.data;
  } catch (e) {
      console.error(e);
  }
};

onMounted(() => {
  fetchData();
  fetchBranches();
});

watch([searchQuery, limit], () => fetchData(1));

const activeBranches = computed(() => branches.value.filter(b => b.is_active));

// --- MODAL UPDATE STOK ---
const openUpdateModal = (item) => {
  selectedItem.value = item;
  formUpdate.value = {
    type: 'add',
    stok: 0, 
    harga_modal: item.harga_modal,
    harga_jual: item.harga_jual
  };
  showUpdateModal.value = true;
};

// COMPUTED PROPERTY UNTUK WARNING LOSS
const isPotentialLoss = computed(() => {
    const modal = Number(formUpdate.value.harga_modal);
    const jual = Number(formUpdate.value.harga_jual);
    return jual > 0 && modal > 0 && jual < modal;
});

const submitUpdate = async () => {
  if (isPotentialLoss.value) {
      const confirmed = await ConfirmAlert.fire({
          title: 'Potensi Kerugian!',
          text: `Harga Jual (Rp ${formUpdate.value.harga_jual}) lebih kecil dari Modal. Yakin ingin lanjut?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, Saya Yakin',
          confirmButtonColor: '#d97706' 
      });
      if (!confirmed.isConfirmed) return;
  }

  try {
    await api.post("/inventory/main", {
      product: selectedItem.value._id,
      stok: formUpdate.value.stok,
      harga_modal: formUpdate.value.harga_modal,
      harga_jual: formUpdate.value.harga_jual,
      type: formUpdate.value.type
    });
    showUpdateModal.value = false;
    await fetchData(currentPage.value);
    
    Toast.fire({ icon: 'success', title: 'Stok Berhasil Diupdate' });

  } catch (err) {
    ConfirmAlert.fire({ icon: 'error', title: 'Gagal Update', text: err.response?.data?.message || "Error sistem" });
  }
};

// --- MODAL RESTOCK CABANG ---
const openRestockModal = (item) => {
  selectedItem.value = item;
  formRestock.value = { branch: "", qty: 1, harga_jual_cabang: item.harga_jual };
  targetBranchStock.value = 0; 
  showRestockModal.value = true;
};

const fetchBranchStock = async () => {
  if (!formRestock.value.branch) return;
  loadingStock.value = true;
  try {
    const res = await api.get("/inventory/branch-stock", {
      params: { 
        branchId: formRestock.value.branch, 
        productId: selectedItem.value._id 
      }
    });
    targetBranchStock.value = res.data.stok;
  } catch (e) {
    targetBranchStock.value = 0; 
  } finally {
    loadingStock.value = false;
  }
};

const submitRestock = async () => {
  if (formRestock.value.qty > selectedItem.value.stok) {
    Toast.fire({ icon: 'error', title: 'Stok Tidak Cukup', text: 'Jumlah kirim melebihi stok gudang.' });
    return;
  }

  // Validasi Harga Jual Cabang < Modal Gudang
  const hargaJualCabang = Number(formRestock.value.harga_jual_cabang);
  const modalGudang = selectedItem.value.harga_modal;

  if (hargaJualCabang > 0 && hargaJualCabang < modalGudang) {
      const confirmed = await ConfirmAlert.fire({
          title: 'Harga Jual Rendah!',
          text: `Harga jual cabang di bawah harga modal gudang. Lanjutkan pengiriman?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Kirim Saja',
          confirmButtonColor: '#d97706'
      });
      if (!confirmed.isConfirmed) return;
  }

  try {
    await api.post("/inventory/restock", {
      product: selectedItem.value._id,
      branch: formRestock.value.branch,
      qty: formRestock.value.qty,
      harga_jual_cabang: formRestock.value.harga_jual_cabang
    });
    showRestockModal.value = false;
    await fetchData(currentPage.value);

    Toast.fire({ icon: 'success', title: 'Barang Dikirim', text: 'Stok cabang telah ditambahkan.' });

  } catch (err) {
    ConfirmAlert.fire({ icon: 'error', title: 'Gagal Kirim', text: err.response?.data?.message });
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>