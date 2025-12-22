<template>
  <div class="layout">
    <Sidebar />
    <div class="content">
      <Navbar />

      <h2>Manajemen Kategori</h2>

      <!-- FORM -->
      <form class="form" @submit.prevent="submit">
        <input
          v-model="form.nama_kategori"
          placeholder="Nama Kategori"
          required
        />
        <button>{{ isEdit ? "Update" : "Tambah" }}</button>
        <button v-if="isEdit" type="button" @click="reset">Batal</button>
      </form>

      <!-- TABLE -->
      <table>
        <thead>
          <tr>
            <th>Nama Kategori</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in categories" :key="c._id">
            <td>{{ c.nama_kategori }}</td>
            <td>
              <button @click="edit(c)">Edit</button>
              <button @click="remove(c._id)">Hapus</button>
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

const categories = ref([]);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
  nama_kategori: ""
});

const load = async () => {
  const res = await api.get("/categories");
  categories.value = res.data;
};

onMounted(load);

// CREATE / UPDATE
const submit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/categories/${editId.value}`, form.value);
    } else {
      await api.post("/categories", form.value);
    }
    reset();
    load();
  } catch (err) {
    alert("Gagal menyimpan kategori");
  }
};

const edit = (c) => {
  isEdit.value = true;
  editId.value = c._id;
  form.value.nama_kategori = c.nama_kategori;
};

const remove = async (id) => {
  if (!confirm("Hapus kategori ini?")) return;
  await api.delete(`/categories/${id}`);
  load();
};

const reset = () => {
  isEdit.value = false;
  editId.value = null;
  form.value.nama_kategori = "";
};
</script>

<style scoped>
.layout { display: flex; }
.content { flex: 1; padding: 20px; }
.form input { margin-right: 10px; }
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
