<template>
  <div class="layout">
    <Sidebar />
    <div class="content">
      <Navbar />

      <h2>Manajemen Produk</h2>

      <!-- FORM -->
      <form class="form" @submit.prevent="submit">
        <input v-model="form.kode_barang" placeholder="Kode Barang" required />
        <input v-model="form.nama_barang" placeholder="Nama Barang" required />
        <input v-model="form.satuan" placeholder="Satuan (pcs / box)" required />

        <select v-model="form.category" required>
          <option value="">-- Pilih Kategori --</option>
          <option v-for="c in categories" :key="c._id" :value="c._id">
            {{ c.nama_kategori }}
          </option>
        </select>

        <button>{{ isEdit ? "Update" : "Tambah" }}</button>
        <button v-if="isEdit" type="button" @click="reset">Batal</button>
      </form>

      <!-- TABLE -->
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Nama</th>
            <th>Satuan</th>
            <th>Kategori</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p._id">
            <td>{{ p.kode_barang }}</td>
            <td>{{ p.nama_barang }}</td>
            <td>{{ p.satuan }}</td>
            <td>{{ p.category?.nama_kategori }}</td>
            <td>
              <button @click="edit(p)">Edit</button>
              <button @click="remove(p._id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/axios";
import Navbar from "../../components/Navbar.vue";
import Sidebar from "../../components/Sidebar.vue";

const products = ref([]);
const categories = ref([]);

const isEdit = ref(false);
const editId = ref(null);

const form = ref({
  kode_barang: "",
  nama_barang: "",
  satuan: "",
  category: ""
});

const load = async () => {
  const [prodRes, catRes] = await Promise.all([
    api.get("/products"),
    api.get("/categories")
  ]);

  products.value = prodRes.data;
  categories.value = catRes.data;
};

onMounted(load);

// CREATE / UPDATE
const submit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/products/${editId.value}`, form.value);
    } else {
      await api.post("/products", form.value);
    }
    reset();
    load();
  } catch (err) {
    alert("Gagal menyimpan produk");
  }
};

const edit = (p) => {
  isEdit.value = true;
  editId.value = p._id;
  form.value = {
    kode_barang: p.kode_barang,
    nama_barang: p.nama_barang,
    satuan: p.satuan,
    category: p.category?._id
  };
};

const remove = async (id) => {
  if (!confirm("Hapus produk ini?")) return;
  await api.delete(`/products/${id}`);
  load();
};

const reset = () => {
  isEdit.value = false;
  editId.value = null;
  form.value = {
    kode_barang: "",
    nama_barang: "",
    satuan: "",
    category: ""
  };
};
</script>

<style scoped>
.layout { display: flex; }
.content { flex: 1; padding: 20px; }
.form input, .form select {
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
button { margin-right: 5px; }
</style>
