<template>
  <div>
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Gudang Utama</h2>
          <p class="text-slate-500 text-sm">Pusat kontrol stok dan distribusi barang ke cabang.</p>
        </div>
        
        <div class="flex gap-3">
          <button 
            @click="openRestockModal" 
            class="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <Truck class="w-5 h-5 text-orange-500" />
            <span>Kirim ke Cabang</span>
          </button>
          
          <button 
            @click="openStockModal" 
            class="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md transition-all"
          >
            <PackagePlus class="w-5 h-5" />
            <span>Update Stok / Harga</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Package class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs text-slate-500 uppercase font-semibold">Total Item Fisik</p>
            <p class="text-xl font-bold text-slate-800">{{ totalItems }} Unit</p>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-green-50 text-green-600 rounded-lg">
            <DollarSign class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs text-slate-500 uppercase font-semibold">Estimasi Aset (Modal)</p>
            <p class="text-xl font-bold text-slate-800">{{ formatRupiah(totalAssetValue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center">
        <div class="relative w-full md:w-64">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama barang..." 
            class="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Produk</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Stok Gudang</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Harga Modal</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Harga Jual</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Margin</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in filteredInventory" :key="item._id" class="hover:bg-slate-50 transition-colors">
              
              <td class="px-6 py-4">
                <div class="font-medium text-slate-800">{{ item.product?.nama_barang || 'Item dihapus' }}</div>
                <div class="text-xs text-slate-400">{{ item.product?.kode_barang }}</div>
              </td>

              <td class="px-6 py-4 text-center">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="item.stok < 10 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'"
                >
                  {{ item.stok }} Unit
                </span>
              </td>

              <td class="px-6 py-4 text-right text-slate-600">
                {{ formatRupiah(item.harga_modal) }}
              </td>

              <td class="px-6 py-4 text-right font-medium text-slate-800">
                {{ formatRupiah(item.harga_jual) }}
              </td>

              <td class="px-6 py-4 text-right text-xs text-green-600 font-semibold">
                +{{ formatRupiah(item.harga_jual - item.harga_modal) }}
              </td>
            </tr>

            <tr v-if="filteredInventory.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-500">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showStockModal" class="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
          <h3 class="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <PackagePlus class="w-5 h-5" /> Barang Masuk / Update
          </h3>
          <button @click="showStockModal = false"><X class="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        <form @submit.prevent="addStock" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Pilih Produk</label>
            <select v-model="formStock.product" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="" disabled>-- Pilih Produk --</option>
              <option v-for="p in products" :key="p._id" :value="p._id">{{ p.nama_barang }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Stok Baru</label>
              <input type="number" v-model="formStock.stok" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Harga Modal</label>
              <input type="number" v-model="formStock.harga_modal" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Rp" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Harga Jual</label>
            <input type="number" v-model="formStock.harga_jual" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Rp" />
          </div>

          <div class="pt-2">
            <button class="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 shadow-lg">Simpan Stok</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showRestockModal" class="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-orange-50">
          <h3 class="text-lg font-bold text-orange-900 flex items-center gap-2">
            <Truck class="w-5 h-5" /> Distribusi ke Cabang
          </h3>
          <button @click="showRestockModal = false"><X class="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
        </div>

        <form @submit.prevent="submitRestock" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Cabang Tujuan</label>
            <select v-model="formRestock.branch" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">-- Pilih Cabang --</option>
              <option v-for="b in branches" :key="b._id" :value="b._id">{{ b.nama_cabang }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Produk</label>
            <select v-model="formRestock.product" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">-- Pilih Produk --</option>
              <option v-for="p in products" :key="p._id" :value="p._id">{{ p.nama_barang }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Jumlah Dikirim</label>
            <input type="number" v-model="formRestock.qty" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="Qty" />
            <p class="text-xs text-slate-400 mt-1">Stok gudang akan berkurang otomatis.</p>
          </div>

          <div class="pt-2">
            <button class="w-full bg-orange-600 text-white py-2.5 rounded-lg font-medium hover:bg-orange-700 shadow-lg">Kirim Barang</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/axios";
import { 
  Package, 
  PackagePlus, 
  Truck, 
  DollarSign, 
  Search, 
  X 
} from 'lucide-vue-next';

// State Data
const inventory = ref([]);
const products = ref([]);
const branches = ref([]);
const searchQuery = ref("");

// State Modals
const showStockModal = ref(false);
const showRestockModal = ref(false);

// State Forms
const formStock = ref({
  product: "",
  stok: 0,
  harga_modal: 0,
  harga_jual: 0
});

const formRestock = ref({
  product: "",
  branch: "",
  qty: 1
});

// --- HELPER FUNCTIONS ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};

// --- DATA LOADING ---
const load = async () => {
  try {
    const [invRes, prodRes, branchRes] = await Promise.all([
      api.get("/inventory/main"),
      api.get("/products"),
      api.get("/branches")
    ]);

    inventory.value = invRes.data;
    products.value = prodRes.data;
    branches.value = branchRes.data;
  } catch (e) {
    console.error("Gagal load data", e);
  }
};

onMounted(load);

// --- COMPUTED LOGIC ---
const filteredInventory = computed(() => {
  if (!searchQuery.value) return inventory.value;
  const lower = searchQuery.value.toLowerCase();
  return inventory.value.filter(item => 
    item.product?.nama_barang.toLowerCase().includes(lower)
  );
});

// Hitung total item fisik di gudang
const totalItems = computed(() => {
  return inventory.value.reduce((acc, item) => acc + item.stok, 0);
});

// Hitung total nilai aset (Stok * Harga Modal)
const totalAssetValue = computed(() => {
  return inventory.value.reduce((acc, item) => acc + (item.stok * item.harga_modal), 0);
});


// --- ACTION HANDLERS ---

const openStockModal = () => {
  formStock.value = { product: "", stok: 0, harga_modal: 0, harga_jual: 0 };
  showStockModal.value = true;
};

const openRestockModal = () => {
  formRestock.value = { product: "", branch: "", qty: 1 };
  showRestockModal.value = true;
};

const addStock = async () => {
  try {
    await api.post("/inventory/main", formStock.value);
    showStockModal.value = false;
    load();
    // Opsional: Beri notifikasi sukses
  } catch (err) {
    alert("Gagal menambah stok. Pastikan semua field terisi.");
  }
};

const submitRestock = async () => {
  try {
    if(formRestock.value.qty <= 0) {
      alert("Jumlah kirim minimal 1");
      return;
    }
    await api.post("/inventory/restock", formRestock.value);
    showRestockModal.value = false;
    load();
  } catch (err) {
    alert("Restock gagal. Cek stok gudang apakah mencukupi.");
  }
};
</script>