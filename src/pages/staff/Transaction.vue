<template>
  <div class="layout">
    <Sidebar />

    <div class="content">
      <Navbar />

      <h2>Transaksi Kasir</h2>

      <!-- BUAT TRANSAKSI -->
      <button @click="createTransaction">+ Transaksi Baru</button>

      <div v-if="trxId">
        <h3>ID Transaksi: {{ trxId }}</h3>

        <!-- TAMBAH ITEM -->
        <form class="form" @submit.prevent="addItem">
          <select v-model="item.product" required>
            <option value="">Pilih Produk</option>
            <option
              v-for="p in products"
              :key="p._id"
              :value="p._id"
            >
              {{ p.nama_barang }}
            </option>
          </select>

          <input
            type="number"
            v-model.number="item.qty"
            min="1"
            placeholder="Qty"
            required
          />

          <button>Tambah Item</button>
        </form>

        <!-- DAFTAR ITEM -->
        <table v-if="items.length">
          <thead>
            <tr>
              <th>Produk</th>
              <th>Qty</th>
              <th>Harga</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in items" :key="i._id">
              <td>{{ i.product?.nama_barang }}</td>
              <td>{{ i.qty }}</td>
              <td>{{ i.harga }}</td>
              <td>{{ i.subtotal }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else>Belum ada item</p>

        <h3>Total: {{ total }}</h3>

        <!-- CHECKOUT -->
        <form class="form" @submit.prevent="checkout">
          <input
            type="number"
            v-model.number="uangBayar"
            placeholder="Uang Bayar"
            required
          />
          <button>Checkout</button>
        </form>

        <p v-if="kembalian !== null">
          Kembalian: {{ kembalian }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/axios";
import Navbar from "../../components/Navbar.vue";
import Sidebar from "../../components/Sidebar.vue";

const products = ref([]);
const trxId = ref(null);
const items = ref([]);
const total = ref(0);
const uangBayar = ref(0);
const kembalian = ref(null);

const item = ref({
  product: "",
  qty: 1
});

// LOAD PRODUK
onMounted(async () => {
  const res = await api.get("/products");
  products.value = res.data;
});

// BUAT TRANSAKSI BARU
const createTransaction = async () => {
  const res = await api.post("/transactions");
  trxId.value = res.data._id;

  items.value = [];
  total.value = 0;
  uangBayar.value = 0;
  kembalian.value = null;
};

// TAMBAH ITEM TRANSAKSI
const addItem = async () => {
  try {
    const res = await api.post(
      `/transactions/${trxId.value}/items`,
      item.value
    );

    // ✅ PUSH ITEM LANGSUNG
    items.value.push(res.data);

    // ✅ HITUNG TOTAL DARI FRONTEND (AMAN)
    total.value = items.value.reduce(
      (sum, i) => sum + i.subtotal,
      0
    );

    // reset form
    item.value = { product: "", qty: 1 };
  } catch (err) {
    alert("Stok tidak cukup atau error");
  }
};

// CHECKOUT
const checkout = async () => {
  try {
    const res = await api.post(
      `/transactions/${trxId.value}/checkout`,
      { uang_bayar: uangBayar.value }
    );

    total.value = res.data.total;
    kembalian.value = res.data.kembalian;
  } catch (err) {
    alert("Checkout gagal");
  }
};
</script>

<style scoped>
.layout {
  display: flex;
}

.content {
  flex: 1;
  padding: 20px;
}

.form select,
.form input {
  margin-right: 10px;
}

table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
}

button {
  margin-bottom: 10px;
}
</style>
