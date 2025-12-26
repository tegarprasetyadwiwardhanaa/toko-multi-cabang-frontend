<template>
  <div class="space-y-6">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Produk</h2>
        <p class="text-slate-500 text-sm mt-1">Daftar inventaris dan katalog barang toko Anda.</p>
      </div>

      <button 
        @click="openModal()" 
        class="group inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm cursor-pointer"
      >
        <Plus class="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>Produk Baru</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
      
      <div class="p-5 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between items-center bg-slate-50/50">
        
        <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div class="relative w-full sm:w-72">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-4 w-4 text-slate-400" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out shadow-sm" 
              placeholder="Cari nama atau kode..." 
            />
          </div>

          <div class="relative">
             <select 
              v-model="sortBy"
              class="block w-full sm:w-48 pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm cursor-pointer appearance-none"
            >
              <option value="newest">📅 Terbaru Ditambahkan</option>
              <option value="name_asc">🔤 Nama (A - Z)</option>
              <option value="name_desc">🔤 Nama (Z - A)</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
               <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 text-sm text-slate-600 w-full xl:w-auto justify-between xl:justify-end">
          <span class="whitespace-nowrap font-medium text-slate-500">Tampilkan:</span>
          <select 
            v-model="itemsPerPage" 
            class="border-slate-200 rounded-lg text-sm py-1.5 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm cursor-pointer"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="whitespace-nowrap text-slate-500">per halaman</span>
        </div>
      </div>
      
      <div v-if="isLoading" class="p-6 space-y-4">
         <div v-for="i in 5" :key="i" class="flex items-center justify-between animate-pulse border-b border-slate-50 pb-4 last:border-0">
            <div class="flex items-center gap-4 w-1/3">
                <div class="w-10 h-10 bg-slate-100 rounded-lg"></div>
                <div class="space-y-2 w-full">
                    <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
            </div>
            <div class="h-6 bg-slate-100 rounded w-20"></div>
            <div class="h-6 bg-slate-100 rounded w-16"></div>
            <div class="h-8 bg-slate-100 rounded w-24"></div>
         </div>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div class="bg-slate-50 p-4 rounded-full mb-4 ring-1 ring-slate-100">
           <Package class="w-10 h-10 text-slate-400" />
        </div>
        <h3 class="text-lg font-bold text-slate-800">
          {{ searchQuery ? 'Produk Tidak Ditemukan' : 'Belum Ada Produk' }}
        </h3>
        <p class="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
          {{ searchQuery ? `Tidak ada hasil untuk kata kunci "${searchQuery}".` : 'Tambahkan produk pertama Anda untuk mulai berjualan.' }}
        </p>
        <button v-if="searchQuery" @click="searchQuery = ''" class="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Bersihkan Pencarian
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Info Produk</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Satuan</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="p in paginatedProducts" 
              :key="p._id" 
              class="transition-colors duration-150 group"
              :class="p.is_active ? 'hover:bg-slate-50' : 'bg-slate-50/50 grayscale opacity-60 hover:opacity-100'"
            >
              <td class="px-6 py-4 align-middle">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100 mr-3 shadow-sm">
                    {{ p.kode_barang.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-800 text-sm">{{ p.nama_barang }}</div>
                    <div class="flex items-center gap-1 mt-0.5">
                        <span class="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {{ p.kode_barang }}
                        </span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 align-middle">
                <span v-if="p.category" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {{ p.category.nama_kategori }}
                </span>
                <span v-else class="text-slate-400 text-xs italic flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-slate-300 rounded-full"></span> Tanpa Kategori
                </span>
              </td>

              <td class="px-6 py-4 align-middle text-sm text-slate-600 font-medium">{{ p.satuan }}</td>

              <td class="px-6 py-4 text-center align-middle">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm transition-all"
                  :class="p.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="p.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
                  {{ p.is_active ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>

              <td class="px-6 py-4 text-center align-middle">
                <div class="flex justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="edit(p)" 
                    class="p-2 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all"
                    title="Edit Produk"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    @click="toggleStatus(p)" 
                    class="p-2 rounded-lg transition-all border"
                    :class="p.is_active ? 'text-rose-600 border-transparent hover:border-rose-200 hover:bg-rose-50' : 'text-emerald-600 border-transparent hover:border-emerald-200 hover:bg-emerald-50'"
                    :title="p.is_active ? 'Nonaktifkan' : 'Aktifkan'"
                  >
                    <Power class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredProducts.length > 0" class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-slate-500">
          Menampilkan <span class="font-bold text-slate-800">{{ startIndex + 1 }}</span> 
          sampai <span class="font-bold text-slate-800">{{ Math.min(endIndex, filteredProducts.length) }}</span> 
          dari <span class="font-bold text-slate-800">{{ filteredProducts.length }}</span> data
        </div>

        <div class="flex gap-1">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div class="hidden sm:flex gap-1">
             <button 
               v-for="page in visiblePages" 
               :key="page"
               @click="currentPage = page"
               class="w-8 h-8 flex items-center justify-center border rounded-md text-sm font-medium transition-colors"
               :class="currentPage === page ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
             >
               {{ page }}
             </button>
          </div>
          <span class="sm:hidden text-sm font-medium bg-white border px-3 py-1.5 rounded-md text-slate-700">
             {{ currentPage }} / {{ totalPages }}
          </span>

          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
            
            <div class="flex min-h-full items-center justify-center p-4">
                <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                
                <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 class="text-lg font-bold text-slate-800">
                    {{ isEdit ? "Edit Produk" : "Tambah Produk Baru" }}
                    </h3>
                    <button @click="closeModal" class="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md p-1 transition-colors">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <form @submit.prevent="submit" class="p-6 space-y-5">
                    
                    <div class="grid grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Kode Barang <span class="text-rose-500">*</span></label>
                            <input 
                            v-model="form.kode_barang" 
                            placeholder="Contoh: BRG-001" 
                            required
                            class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-mono transition-all"
                            />
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Satuan <span class="text-rose-500">*</span></label>
                            <input 
                            v-model="form.satuan" 
                            placeholder="Pcs / Box / Kg" 
                            required
                            class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nama Barang <span class="text-rose-500">*</span></label>
                        <input 
                            v-model="form.nama_barang" 
                            placeholder="Masukkan nama produk..." 
                            required
                            class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Kategori <span class="text-rose-500">*</span></label>
                        <div class="relative">
                            <select 
                                v-model="form.category" 
                                required
                                class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm appearance-none transition-all cursor-pointer"
                            >
                                <option value="" disabled>-- Pilih Kategori --</option>
                                <option v-for="c in activeCategories" :key="c._id" :value="c._id">
                                {{ c.nama_kategori }}
                                </option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 pt-4 border-t border-slate-50 mt-2">
                        <button 
                            type="button" 
                            @click="closeModal" 
                            class="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            :disabled="isSubmitting"
                            class="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            {{ isEdit ? "Simpan Perubahan" : "Simpan Produk" }}
                        </button>
                    </div>
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
import { Search, Plus, Pencil, Power, Package, X } from 'lucide-vue-next';
import { Toast, ConfirmAlert } from '../../utils/alert'; // Import Alert Utility Global

// State Data
const products = ref([]);
const categories = ref([]);
const searchQuery = ref(""); 
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const isLoading = ref(true); // Default true agar skeleton muncul saat load awal
const isSubmitting = ref(false);

// State Pagination & Sort
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref("newest"); 

// Form Data
const form = ref({
  kode_barang: "",
  nama_barang: "",
  satuan: "",
  category: ""
});

// Load Data
const load = async () => {
  // Jika products kosong (first load), nyalakan skeleton. 
  // Jika refresh setelah edit, biarkan loading false agar tidak flicker.
  if (products.value.length === 0) isLoading.value = true;
  
  try {
    const [prodRes, catRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories")
    ]);
    products.value = prodRes.data;
    categories.value = catRes.data;
  } catch (err) {
    Toast.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Periksa koneksi internet Anda.'
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(load);

// --- COMPUTED: FILTER + SORT ---
const filteredProducts = computed(() => {
  let result = products.value;

  if (searchQuery.value) {
    const lowerSearch = searchQuery.value.toLowerCase();
    result = result.filter(p => 
      p.nama_barang.toLowerCase().includes(lowerSearch) || 
      p.kode_barang.toLowerCase().includes(lowerSearch)
    );
  }

  // Sorting Logic
  return result.slice().sort((a, b) => { 
    if (sortBy.value === 'name_asc') {
      return a.nama_barang.localeCompare(b.nama_barang);
    } else if (sortBy.value === 'name_desc') {
      return b.nama_barang.localeCompare(a.nama_barang);
    } else if (sortBy.value === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });
});

// --- COMPUTED: PAGINATION ---
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);
const paginatedProducts = computed(() => filteredProducts.value.slice(startIndex.value, endIndex.value));

// Helper: Pagination Angka (Hanya tampilkan max 5 halaman)
const visiblePages = computed(() => {
    let pages = [];
    if (totalPages.value <= 5) {
        for (let i = 1; i <= totalPages.value; i++) pages.push(i);
    } else {
        // Logic simple: selalu tampilkan page 1..5 jika page < 4, atau geser jika page > 4
        if (currentPage.value <= 3) {
             pages = [1, 2, 3, 4, 5];
        } else if (currentPage.value >= totalPages.value - 2) {
             for (let i = totalPages.value - 4; i <= totalPages.value; i++) pages.push(i);
        } else {
             for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) pages.push(i);
        }
    }
    return pages;
});

// Watcher untuk reset page
watch([searchQuery, itemsPerPage], () => {
  currentPage.value = 1;
});

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

const activeCategories = computed(() => categories.value.filter(c => c.is_active === true));

// --- MODAL & CRUD ---
const openModal = () => {
  resetForm();
  isEdit.value = false;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => resetForm(), 300);
};

const resetForm = () => {
  form.value = { kode_barang: "", nama_barang: "", satuan: "", category: "" };
  editId.value = null;
  isEdit.value = false;
  isSubmitting.value = false;
};

const submit = async () => {
  if (!form.value.category) {
    Toast.fire({ icon: 'warning', title: 'Kategori Wajib Dipilih' });
    return;
  }

  isSubmitting.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/products/${editId.value}`, form.value);
    } else {
      await api.post("/products", form.value);
    }
    
    closeModal();
    await load();
    
    Toast.fire({
        icon: 'success',
        title: isEdit.value ? 'Produk Diperbarui' : 'Produk Ditambahkan'
    });

  } catch (err) {
    const msg = err.response?.data?.message || "Gagal menyimpan data";
    ConfirmAlert.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        confirmButtonText: 'Tutup'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const edit = (p) => {
  form.value = {
    kode_barang: p.kode_barang,
    nama_barang: p.nama_barang,
    satuan: p.satuan,
    category: p.category?._id || "" 
  };
  editId.value = p._id;
  isEdit.value = true;
  showModal.value = true;
};

const toggleStatus = async (p) => {
  const isDeactivating = p.is_active;
  
  const result = await ConfirmAlert.fire({
    title: isDeactivating ? 'Nonaktifkan Produk?' : 'Aktifkan Produk?',
    text: isDeactivating 
      ? `Produk "${p.nama_barang}" tidak akan muncul di kasir.` 
      : `Produk "${p.nama_barang}" siap dijual kembali.`,
    icon: isDeactivating ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: isDeactivating ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan',
    confirmButtonColor: isDeactivating ? '#ef4444' : '#10b981', 
    cancelButtonText: 'Batal',
  });

  if (result.isConfirmed) {
    try {
        await api.delete(`/products/${p._id}`);
        load();
        Toast.fire({
            icon: 'success',
            title: isDeactivating ? 'Produk Nonaktif' : 'Produk Aktif'
        });
    } catch (err) {
        Toast.fire({ icon: 'error', title: 'Gagal update status' });
    }
  }
};
</script>

<style scoped>
/* Animasi Modal */
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