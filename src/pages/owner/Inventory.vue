<template>
  <div class="layout">
    <Sidebar />
    <div class="content">
      <Navbar />

      <h2>Gudang Utama</h2>

      <!-- FORM TAMBAH STOK GUDANG -->
      <form class="form" @submit.prevent="addStock">
        <select v-model="form.product" required>
          <option value="">Pilih Produk</option>
          <option v-for="p in products" :key="p._id" :value="p._id">
            {{ p.nama_barang }}
          </option>
        </select>

        <input type="number" v-model.number="form.stok" placeholder="Stok" />
        <input
          type="number"
          v-model.number="form.harga_modal"
          placeholder="Harga Modal"
        />
        <input
          type="number"
          v-model.number="form.harga_jual"
          placeholder="Harga Jual"
        />

        <button>Tambah / Update Stok</button>
      </form>

      <!-- TABLE GUDANG -->
      <table>
        <thead>
          <tr>
            <th>Produk</th>
            <th>Stok</th>
            <th>Harga Modal</th>
            <th>Harga Jual</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in inventory" :key="i._id">
            <td>{{ i.product?.nama_barang }}</td>
            <td>{{ i.stok }}</td>
            <td>{{ i.harga_modal }}</td>
            <td>{{ i.harga_jual }}</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Restock ke Cabang</h2>

      <!-- FORM RESTOCK -->
      <form class="form" @submit.prevent="restock">
        <select v-model="restockForm.product" required>
          <option value="">Pilih Produk</option>
          <option v-for="p in products" :key="p._id" :value="p._id">
            {{ p.nama_barang }}
          </option>
        </select>

        <select v-model="restockForm.branch" required>
          <option value="">Pilih Cabang</option>
          <option v-for="b in branches" :key="b._id" :value="b._id">
            {{ b.nama_cabang }}
          </option>
        </select>

        <input type="number" v-model.number="restockForm.qty" placeholder="Qty" />

        <button>Restock</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/axios";
import Navbar from "../../components/Navbar.vue";
import Sidebar from "../../components/Sidebar.vue";

const inventory = ref([]);
const products = ref([]);
const branches = ref([]);

const form = ref({
  product: "",
  stok: 0,
  harga_modal: 0,
  harga_jual: 0
});

const restockForm = ref({
  product: "",
  branch: "",
  qty: 0
});

const load = async () => {
  const [invRes, prodRes, branchRes] = await Promise.all([
    api.get("/inventory/main"),
    api.get("/products"),
    api.get("/branches")
  ]);

  inventory.value = invRes.data;
  products.value = prodRes.data;
  branches.value = branchRes.data;
};

onMounted(load);

// TAMBAH / UPDATE STOK GUDANG
const addStock = async () => {
  try {
    await api.post("/inventory/main", form.value);
    load();
  } catch (err) {
    alert("Gagal menambah stok gudang");
  }
};

// RESTOCK
const restock = async () => {
  try {
    await api.post("/inventory/restock", restockForm.value);
    load();
  } catch (err) {
    alert("Restock gagal");
  }
};
</script>

<style scoped>
.layout { display: flex; }
.content { flex: 1; padding: 20px; }
.form select, .form input {
  margin-right: 10px;
}
table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
}
</style>
