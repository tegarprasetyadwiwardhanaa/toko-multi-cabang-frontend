<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Manajemen Produk</h2>
        <p class="text-slate-500 text-sm">Daftar semua barang yang tersedia di toko Anda.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama atau kode..." 
            class="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64 outline-none transition-all"
          />
          <Search class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <button 
          @click="openModal()" 
          class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 font-medium whitespace-nowrap"
        >
          <Plus class="w-5 h-5" />
          <span>Produk Baru</span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      <div v-if="filteredProducts.length === 0" class="p-12 text-center flex flex-col items-center">
        <Package class="w-16 h-16 text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-900">
          {{ searchQuery ? 'Produk tidak ditemukan' : 'Belum ada produk' }}
        </h3>
        <p class="text-slate-500 mt-1">
          {{ searchQuery ? 'Coba kata kunci pencarian lain.' : 'Mulai tambahkan produk pertama Anda.' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kode</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Barang</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Satuan</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in filteredProducts" :key="p._id" class="hover:bg-slate-50 transition-colors">
              
              <td class="px-6 py-4">
                <span class="font-mono text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  {{ p.kode_barang }}
                </span>
              </td>
              
              <td class="px-6 py-4 font-medium text-slate-800">
                {{ p.nama_barang }}
              </td>

              <td class="px-6 py-4">
                <span 
                  v-if="p.category"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {{ p.category.nama_kategori }}
                </span>
                <span v-else class="text-slate-400 text-xs italic">Tanpa Kategori</span>
              </td>

              <td class="px-6 py-4 text-sm text-slate-600">
                {{ p.satuan }}
              </td>

              <td class="px-6 py-4 text-right space-x-2">
                <button @click="edit(p)" class="text-indigo-600 hover:text-indigo-900 transition-colors" title="Edit">
                  <Pencil class="w-4 h-4 inline" />
                </button>
                <button @click="remove(p._id)" class="text-red-600 hover:text-red-900 transition-colors" title="Hapus">
                  <Trash2 class="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="text-lg font-bold text-slate-800">
            {{ isEdit ? "Edit Produk" : "Tambah Produk Baru" }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="submit" class="p-6 space-y-4">
          
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2 sm:col-span-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Kode Barang</label>
              <input 
                v-model="form.kode_barang" 
                placeholder="Contoh: BRG-001" 
                required
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            
            <div class="col-span-2 sm:col-span-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Satuan</label>
              <input 
                v-model="form.satuan" 
                placeholder="Pcs / Box / Pack" 
                required
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Barang</label>
            <input 
              v-model="form.nama_barang" 
              placeholder="Masukkan nama produk..." 
              required
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
            <div class="relative">
              <select 
                v-model="form.category" 
                required
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
              >
                <option value="" disabled>-- Pilih Kategori --</option>
                <option v-for="c in categories" :key="c._id" :value="c._id">
                  {{ c.nama_kategori }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-50 mt-4">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md"
            >
              {{ isEdit ? "Simpan Perubahan" : "Simpan Produk" }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/axios";
// Import Icons
import { Search, Plus, Pencil, Trash2, Package, X } from 'lucide-vue-next';

// State Data
const products = ref([]);
const categories = ref([]);
const searchQuery = ref(""); // Variabel untuk pencarian
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

// Form Data
const form = ref({
  kode_barang: "",
  nama_barang: "",
  satuan: "",
  category: ""
});

// Load Data (Parallel Request agar cepat)
const load = async () => {
  try {
    const [prodRes, catRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories")
    ]);
    products.value = prodRes.data;
    categories.value = catRes.data;
  } catch (err) {
    console.error("Gagal memuat data", err);
  }
};

onMounted(load);

// --- SEARCH LOGIC ---
// Computed Property untuk memfilter produk secara real-time
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  
  const lowerSearch = searchQuery.value.toLowerCase();
  
  return products.value.filter(p => {
    // Cari berdasarkan Nama Barang atau Kode Barang
    return (
      p.nama_barang.toLowerCase().includes(lowerSearch) || 
      p.kode_barang.toLowerCase().includes(lowerSearch)
    );
  });
});

// --- MODAL LOGIC ---
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
  form.value = {
    kode_barang: "",
    nama_barang: "",
    satuan: "",
    category: ""
  };
  editId.value = null;
  isEdit.value = false;
};

// --- CRUD LOGIC ---
const submit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/products/${editId.value}`, form.value);
    } else {
      await api.post("/products", form.value);
    }
    closeModal();
    load();
  } catch (err) {
    alert("Gagal menyimpan produk. Periksa kembali input Anda.");
  }
};

const edit = (p) => {
  form.value = {
    kode_barang: p.kode_barang,
    nama_barang: p.nama_barang,
    satuan: p.satuan,
    category: p.category?._id || "" // Handle jika kategori null
  };
  editId.value = p._id;
  isEdit.value = true;
  showModal.value = true;
};

const remove = async (id) => {
  if (!confirm("Yakin ingin menghapus produk ini? Stok yang terkait mungkin akan hilang.")) return;
  try {
    await api.delete(`/products/${id}`);
    load();
  } catch (err) {
    alert("Gagal menghapus produk");
  }
};
</script>