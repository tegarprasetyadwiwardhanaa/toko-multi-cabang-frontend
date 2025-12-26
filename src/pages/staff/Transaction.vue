<template>
  <div class="flex h-screen bg-slate-100 font-sans overflow-hidden">
    
    <div class="flex-1 flex flex-col h-full relative">
      
      <div class="p-4 bg-white shadow-sm z-10 flex flex-col sm:flex-row gap-4 justify-between items-center px-6">
        <div>
           <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
             <LayoutGrid class="w-6 h-6 text-indigo-600" />
             Katalog Produk
           </h2>
           <p class="text-xs text-slate-500">Klik produk untuk masuk keranjang</p>
        </div>
        
        <div class="relative w-full sm:w-80">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            v-model="keyword" 
            type="text" 
            placeholder="Cari kode / nama barang (F2)..." 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner text-sm font-medium"
            id="searchProduct"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           <div v-for="i in 8" :key="i" class="bg-white rounded-xl p-4 h-40 animate-pulse border border-slate-100">
              <div class="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-slate-100 rounded w-1/2 mb-8"></div>
              <div class="flex justify-between items-end mt-auto">
                 <div class="h-6 bg-slate-100 rounded w-1/3"></div>
                 <div class="h-8 w-8 bg-slate-100 rounded-full"></div>
              </div>
           </div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400">
           <div class="bg-white p-6 rounded-full shadow-sm mb-4">
              <PackageSearch class="w-12 h-12 text-slate-300" />
           </div>
           <p class="font-medium">Produk tidak ditemukan</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 pb-20">
          <div 
            v-for="item in filteredProducts" 
            :key="item._id" 
            @click="addToCart(item)"
            class="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full select-none"
            :class="{ 'opacity-50 grayscale cursor-not-allowed': item.stok <= 0 }"
          >
            <div v-if="item.stok <= 0" class="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
               <span class="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform -rotate-12">STOK HABIS</span>
            </div>

            <div>
              <div class="flex justify-between items-start mb-2">
                 <span class="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                   {{ item.product.kode_barang }}
                 </span>
                 <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" 
                   :class="item.stok < 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'">
                   Stok: {{ item.stok }}
                 </span>
              </div>
              <h3 class="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[2.5em]">
                {{ item.product.nama_barang }}
              </h3>
            </div>
            
            <div class="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-slate-100">
              <span class="text-indigo-600 font-bold text-base">
                {{ formatPrice(item.harga_jual) }}
              </span>
              <button class="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                 <Plus class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-96 bg-white shadow-2xl z-20 flex flex-col h-full border-l border-slate-200">
      
      <div class="p-5 border-b border-slate-100 bg-white flex justify-between items-center shadow-sm z-10">
        <div>
           <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
             <ShoppingCart class="w-5 h-5 text-indigo-600" />
             Keranjang
           </h3>
           <p class="text-xs text-slate-400">{{ cartTotalQty }} Item dipilih</p>
        </div>
        <button 
            @click="clearCart" 
            v-if="cart.length > 0"
            class="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors"
        >
            Hapus Semua
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 custom-scrollbar">
        <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
          <ShoppingCart class="w-16 h-16 mb-4 text-slate-200" />
          <p class="text-sm font-medium">Keranjang Kosong</p>
          <p class="text-xs">Pilih produk di sebelah kiri</p>
        </div>

        <div 
          v-for="(item, index) in cart" 
          :key="index" 
          class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group animate-slide-in-right"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
               <h4 class="font-bold text-slate-700 text-sm line-clamp-1" :title="item.product.nama_barang">{{ item.product.nama_barang }}</h4>
               <p class="text-[10px] text-slate-400 font-mono">{{ item.product.kode_barang }}</p>
            </div>
            <button @click="removeItem(index)" class="text-slate-300 hover:text-red-500 transition-colors">
               <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <div class="flex justify-between items-center">
             <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button @click="decreaseQty(index)" class="w-6 h-6 bg-white rounded shadow-sm text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors">
                   <Minus class="w-3 h-3" />
                </button>
                <input 
                    type="number" 
                    v-model="item.qty" 
                    class="w-8 text-center bg-transparent text-sm font-bold text-slate-700 focus:outline-none"
                    readonly
                />
                <button @click="increaseQty(index, item.maxStock)" class="w-6 h-6 bg-white rounded shadow-sm text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors">
                   <Plus class="w-3 h-3" />
                </button>
             </div>
             <div class="text-right">
                <p class="text-xs text-slate-400">@ {{ formatPrice(item.harga_jual) }}</p>
                <p class="font-bold text-indigo-600 text-sm">{{ formatPrice(item.harga_jual * item.qty) }}</p>
             </div>
          </div>
        </div>
      </div>

      <div class="p-5 bg-white border-t border-slate-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
        
        <div class="flex justify-between items-end mb-4">
          <span class="text-slate-500 text-sm font-medium">Total Tagihan</span>
          <span class="text-2xl font-extrabold text-slate-800 tracking-tight">
            {{ formatPrice(totalAmount) }}
          </span>
        </div>
        
        <div class="space-y-3 mb-4">
            <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                <input 
                    type="number" 
                    v-model="uangBayar" 
                    placeholder="0" 
                    class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-right"
                    @keyup.enter="processTransaction"
                />
            </div>
            
            <div class="grid grid-cols-4 gap-2">
                <button @click="uangBayar = totalAmount" :class="quickCashPrimary">Uang Pas</button>
                <button @click="uangBayar = 20000" :class="quickCashBase">20k</button>
                <button @click="uangBayar = 50000" :class="quickCashBase">50k</button>
                <button @click="uangBayar = 100000" :class="quickCashBase">100k</button>
            </div>

            <div class="flex justify-between items-center p-2 rounded-lg" :class="kembalian < 0 ? 'bg-red-50' : 'bg-emerald-50'">
                <span class="text-xs font-bold uppercase tracking-wider" :class="kembalian < 0 ? 'text-red-500' : 'text-emerald-600'">Kembalian</span>
                <span class="font-bold font-mono" :class="kembalian < 0 ? 'text-red-600' : 'text-emerald-700'">
                    {{ formatPrice(Math.max(0, kembalian)) }}
                </span>
            </div>
        </div>

        <button 
          @click="processTransaction"
          class="w-full py-3.5 px-4 rounded-xl shadow-lg font-bold text-white text-lg flex justify-center items-center gap-2 transition-all duration-200 transform active:scale-95"
          :class="cart.length === 0 || uangBayar < totalAmount ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'"
          :disabled="cart.length === 0 || uangBayar < totalAmount"
        >
          <CreditCard class="w-5 h-5" />
          <span>BAYAR (Enter)</span>
        </button>

      </div>
    </div>

    <transition name="modal">
        <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" @click="closeSuccessModal"></div>
            
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden transform transition-all animate-bounce-in">
                <div class="bg-emerald-500 p-6 text-center text-white">
                    <div class="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <Check class="w-8 h-8 text-white" />
                    </div>
                    <h3 class="text-xl font-bold">Transaksi Berhasil!</h3>
                    <p class="text-emerald-100 text-sm opacity-90">Terima kasih telah berbelanja</p>
                </div>

                <div class="p-6 space-y-4">
                    <div class="text-center">
                        <p class="text-xs text-slate-500 uppercase tracking-widest mb-1">Kembalian</p>
                        <p class="text-3xl font-extrabold text-slate-800">{{ formatPrice(lastTransaction.kembalian) }}</p>
                    </div>

                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-slate-500">No. Nota</span>
                            <span class="font-mono font-bold text-slate-700">{{ lastTransaction.no_nota }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500">Total Barang</span>
                            <span class="font-bold text-slate-700">{{ lastTransaction.totalQty }} Item</span>
                        </div>
                    </div>

                    <div class="grid gap-3">
                        <button @click="closeSuccessModal" class="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  Search, ShoppingCart, Trash2, Plus, Minus, LayoutGrid, CreditCard, 
  PackageSearch, Check 
} from 'lucide-vue-next';
import axios from '../../api/axios';
import { Toast, ConfirmAlert } from '../../utils/alert'; 

// --- STYLE VARIABLES (Pengganti @apply) ---
// Ini solusi untuk error Tailwind Vite
const quickCashBase = "border border-slate-200 bg-white text-slate-600 text-xs font-bold py-2 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all active:scale-95 cursor-pointer";
const quickCashPrimary = "border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-bold py-2 rounded-lg hover:bg-indigo-100 transition-all active:scale-95 cursor-pointer";

// STATE
const products = ref([]);
const cart = ref([]);
const keyword = ref("");
const loading = ref(false);
const uangBayar = ref(0);

// Modal State
const showSuccessModal = ref(false);
const lastTransaction = ref({ kembalian: 0, no_nota: '', totalQty: 0 });

// --- COMPUTED ---
const filteredProducts = computed(() => {
  if (!keyword.value) return products.value;
  const lower = keyword.value.toLowerCase();
  return products.value.filter(item => 
    item.product.nama_barang.toLowerCase().includes(lower) || 
    item.product.kode_barang.toLowerCase().includes(lower)
  );
});

const totalAmount = computed(() => cart.value.reduce((sum, item) => sum + (item.harga_jual * item.qty), 0));
const cartTotalQty = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0));
const kembalian = computed(() => (!uangBayar.value ? 0 - totalAmount.value : uangBayar.value - totalAmount.value));

// --- METHODS ---
const formatPrice = (value) => new Intl.NumberFormat('id-ID').format(value);

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/inventory/pos');
    products.value = response.data;
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal Memuat Produk', text: 'Periksa koneksi server.' });
  } finally {
    loading.value = false;
  }
};

const addToCart = (inventoryItem) => {
  if (inventoryItem.stok <= 0) {
      Toast.fire({ icon: 'error', title: 'Stok Habis!', timer: 1500 });
      return;
  }

  const existingItem = cart.value.find(c => c._id === inventoryItem._id);
  
  if (existingItem) {
    if (existingItem.qty < inventoryItem.stok) {
      existingItem.qty++;
    } else {
      Toast.fire({ icon: 'warning', title: 'Stok Maksimum Tercapai' });
    }
  } else {
    cart.value.push({
      ...inventoryItem,
      qty: 1,
      maxStock: inventoryItem.stok 
    });
  }
};

const increaseQty = (index, max) => {
  if (cart.value[index].qty < max) cart.value[index].qty++;
  else Toast.fire({ icon: 'warning', title: 'Stok Maksimum' });
};

const decreaseQty = (index) => {
  if (cart.value[index].qty > 1) cart.value[index].qty--;
  else removeItem(index);
};

const removeItem = (index) => cart.value.splice(index, 1);
const clearCart = () => cart.value = [];

// PROCESS TRANSACTION
const processTransaction = async () => {
  if (cart.value.length === 0 || uangBayar.value < totalAmount.value) return;

  const confirm = await ConfirmAlert.fire({
      title: 'Proses Pembayaran?',
      text: `Total: Rp ${formatPrice(totalAmount.value)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Bayar',
      confirmButtonColor: '#4f46e5'
  });

  if (!confirm.isConfirmed) return;

  try {
    const payload = {
      items: cart.value.map(item => ({ _id: item._id, qty: item.qty })),
      uang_bayar: uangBayar.value
    };

    const res = await axios.post('/transactions', payload);
    const data = res.data.data;

    // Set Data untuk Modal Sukses
    lastTransaction.value = {
        kembalian: data.kembalian,
        no_nota: data.no_nota,
        totalQty: cartTotalQty.value
    };

    showSuccessModal.value = true; // Tampilkan Modal

    // Reset Form
    cart.value = [];
    uangBayar.value = 0;
    fetchProducts(); // Refresh stok

  } catch (error) {
    ConfirmAlert.fire({ icon: 'error', title: 'Gagal', text: error.response?.data?.message || error.message });
  }
};

const closeSuccessModal = () => {
    showSuccessModal.value = false;
};

onMounted(fetchProducts);
</script>

<style scoped>
/* Scrollbar Custom */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

/* Animations */
@keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
}
.animate-slide-in-right {
    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes bounceIn {
  0% { transform: scale(0.9); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}
.animate-bounce-in {
  animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>