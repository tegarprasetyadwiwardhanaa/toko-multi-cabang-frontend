<template>
  <div class="flex h-screen bg-gray-100 font-sans overflow-hidden">
    
    <div class="flex-1 flex flex-col p-4 pr-2">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutGrid class="w-6 h-6 text-indigo-600" />
            Katalog Produk
          </h2>
          <p class="text-sm text-slate-500">Pilih barang untuk ditambahkan ke keranjang</p>
        </div>
        
        <div class="relative w-72">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            v-model="keyword" 
            type="text" 
            placeholder="Cari nama atau kode barang..." 
            class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div v-if="loading" class="flex-1 flex justify-center items-center bg-white rounded-xl border border-gray-200 border-dashed">
        <div class="text-center text-slate-500 animate-pulse">
          <Loader2 class="w-10 h-10 mx-auto mb-2 animate-spin text-indigo-500" />
          <p>Memuat data produk...</p>
        </div>
      </div>
      
      <div v-else class="flex-1 overflow-y-auto pr-2 pb-4">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div 
            v-for="item in filteredProducts" 
            :key="item._id" 
            @click="addToCart(item)"
            class="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all duration-200 relative overflow-hidden"
            :class="{ 'opacity-60 cursor-not-allowed bg-gray-50': item.stok <= 0 }"
          >
            <div v-if="item.stok <= 0" class="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/50 backdrop-blur-[1px]">
              <span class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">HABIS</span>
            </div>

            <div class="flex flex-col h-full justify-between">
              <div>
                <h3 class="font-bold text-slate-800 line-clamp-2 leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                  {{ item.product.nama_barang }}
                </h3>
                <p class="text-xs text-slate-400 font-mono bg-gray-100 inline-block px-1.5 py-0.5 rounded mb-3">
                  {{ item.product.kode_barang }}
                </p>
              </div>
              
              <div class="flex justify-between items-end mt-2 border-t border-dashed border-gray-100 pt-3">
                <span class="text-indigo-600 font-bold text-lg">
                  <span class="text-xs font-normal text-slate-500 mr-0.5">Rp</span>{{ formatPrice(item.harga_jual) }}
                </span>
                
                <span 
                  class="text-xs font-medium px-2 py-1 rounded-full border"
                  :class="item.stok < 5 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'"
                >
                  Stok: {{ item.stok }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full max-w-md bg-white border-l border-gray-200 shadow-xl flex flex-col h-full z-10">
      
      <div class="p-5 border-b border-gray-100 bg-white flex justify-between items-center">
        <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
          <ShoppingCart class="w-5 h-5 text-indigo-600" />
          Keranjang Belanja
        </h3>
        <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {{ cart.reduce((acc, item) => acc + item.qty, 0) }} Item
        </span>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-3">
        <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
          <ShoppingCart class="w-16 h-16 mb-4 text-slate-300" />
          <p class="text-sm">Belum ada barang dipilih</p>
        </div>

        <div 
          v-for="(cartItem, index) in cart" 
          :key="index" 
          class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 group hover:border-indigo-200 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div>
               <h4 class="font-bold text-slate-700 text-sm mb-1">{{ cartItem.product.nama_barang }}</h4>
               <p class="text-xs text-slate-500">@ Rp {{ formatPrice(cartItem.harga_jual) }}</p>
            </div>
            <button 
              @click="removeItem(index)"
              class="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-all"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <div class="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
             <div class="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                <button 
                  @click="decreaseQty(index)"
                  class="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-slate-600 rounded text-xs transition-colors"
                >
                  <Minus class="w-3 h-3" />
                </button>
                <span class="font-bold text-sm text-slate-700 w-4 text-center">{{ cartItem.qty }}</span>
                <button 
                  @click="increaseQty(index, cartItem.maxStock)"
                  class="w-6 h-6 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-xs transition-colors"
                >
                  <Plus class="w-3 h-3" />
                </button>
             </div>
             <div class="font-bold text-indigo-600 text-sm">
               Rp {{ formatPrice(cartItem.harga_jual * cartItem.qty) }}
             </div>
          </div>
        </div>
      </div>

      <div class="p-5 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        <div class="flex justify-between items-end mb-6">
          <span class="text-slate-500 text-sm font-medium">Total Tagihan</span>
          <span class="text-2xl font-extrabold text-slate-800">
            <span class="text-base font-normal text-slate-400 mr-1">Rp</span>{{ formatPrice(totalAmount) }}
          </span>
        </div>
        
        <div class="space-y-4 mb-6">
          <div class="relative">
            <label class="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Uang Diterima</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">Rp</span>
              <input 
                type="number" 
                v-model="uangBayar" 
                placeholder="0" 
                class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div class="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <span class="text-sm font-medium text-indigo-700">Kembalian</span>
            <span 
              class="font-bold text-lg" 
              :class="kembalian < 0 ? 'text-red-500' : 'text-indigo-700'"
            >
              Rp {{ formatPrice(kembalian) }}
            </span>
          </div>
        </div>

        <button 
          class="w-full py-4 px-4 rounded-xl shadow-lg font-bold text-white text-lg flex justify-center items-center gap-2 transition-all duration-200 transform hover:-translate-y-1"
          :class="cart.length === 0 || uangBayar < totalAmount ? 'bg-gray-300 cursor-not-allowed shadow-none hover:translate-y-0' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'"
          :disabled="cart.length === 0 || uangBayar < totalAmount"
          @click="processTransaction"
        >
          <CreditCard class="w-5 h-5" />
          <span>BAYAR SEKARANG</span>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Loader2, 
  LayoutGrid,
  CreditCard 
} from 'lucide-vue-next';
import axios from '../../api/axios';

// STATE
const products = ref([]);
const cart = ref([]);
const keyword = ref("");
const loading = ref(false);
const uangBayar = ref(0);

// COMPUTED: Filter Produk
const filteredProducts = computed(() => {
  if (!keyword.value) return products.value;
  const lower = keyword.value.toLowerCase();
  return products.value.filter(item => 
    item.product.nama_barang.toLowerCase().includes(lower) || 
    item.product.kode_barang.toLowerCase().includes(lower)
  );
});

// COMPUTED: Hitung Total
const totalAmount = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.harga_jual * item.qty), 0);
});

// COMPUTED: Hitung Kembalian
const kembalian = computed(() => {
  if (!uangBayar.value) return 0 - totalAmount.value;
  return uangBayar.value - totalAmount.value;
});

// METHODS
const formatPrice = (value) => {
  return value.toLocaleString('id-ID');
};

// Ambil data produk dari backend
const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/inventory/pos');
    products.value = response.data;
  } catch (error) {
    console.error("Gagal ambil produk", error);
    // Disarankan ganti alert dengan toast notification kedepannya
    alert("Gagal mengambil data produk."); 
  } finally {
    loading.value = false;
  }
};

// Tambah ke Cart
const addToCart = (inventoryItem) => {
  if (inventoryItem.stok <= 0) return;

  const existingItem = cart.value.find(c => c._id === inventoryItem._id);
  
  if (existingItem) {
    if (existingItem.qty < inventoryItem.stok) {
      existingItem.qty++;
    } else {
      alert("Stok tidak cukup!");
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
  if (cart.value[index].qty < max) {
    cart.value[index].qty++;
  } else {
    alert("Stok maksimal tercapai");
  }
};

const decreaseQty = (index) => {
  if (cart.value[index].qty > 1) {
    cart.value[index].qty--;
  }
};

const removeItem = (index) => {
  cart.value.splice(index, 1);
};

// Checkout / Bayar
const processTransaction = async () => {
  if (!confirm("Proses transaksi ini?")) return;

  try {
    const payload = {
      items: cart.value,
      total: totalAmount.value,
      uang_bayar: uangBayar.value,
      kembalian: kembalian.value
    };

    await axios.post('/transactions', payload);
    
    alert("Transaksi Berhasil!");
    
    // Reset state
    cart.value = [];
    uangBayar.value = 0;
    fetchProducts(); // Refresh stok terbaru dari database

  } catch (error) {
    console.error(error);
    alert("Transaksi Gagal: " + (error.response?.data?.message || error.message));
  }
};

// Lifecycle
onMounted(() => {
  fetchProducts();
});
</script>