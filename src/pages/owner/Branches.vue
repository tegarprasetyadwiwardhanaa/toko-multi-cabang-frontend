<template>
  <div class="layout">
    <Sidebar />
    <div class="content">
      <Navbar />

      <h2>Manajemen Cabang</h2>

      <!-- FORM -->
      <form class="form" @submit.prevent="submit">
        <input v-model="form.nama_cabang" placeholder="Nama Cabang" />
        <input v-model="form.alamat" placeholder="Alamat" />
        <input v-model="form.kota" placeholder="Kota" />
        <button>{{ isEdit ? "Update" : "Tambah" }}</button>
        <button v-if="isEdit" type="button" @click="reset">Batal</button>
      </form>

      <!-- TABLE -->
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Kota</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in branches" :key="b._id">
            <td>{{ b.nama_cabang }}</td>
            <td>{{ b.alamat }}</td>
            <td>{{ b.kota }}</td>
            <td>
              <button @click="edit(b)">Edit</button>
              <button @click="remove(b._id)">Hapus</button>
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

const branches = ref([]);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
  nama_cabang: "",
  alamat: "",
  kota: ""
});

const load = async () => {
  const res = await api.get("/branches");
  branches.value = res.data;
};

onMounted(load);

// CREATE / UPDATE
const submit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/branches/${editId.value}`, form.value);
    } else {
      await api.post("/branches", form.value);
    }
    reset();
    load();
  } catch (e) {
    alert("Gagal menyimpan cabang");
  }
};

const edit = (b) => {
  isEdit.value = true;
  editId.value = b._id;
  form.value = {
    nama_cabang: b.nama_cabang,
    alamat: b.alamat,
    kota: b.kota
  };
};

const remove = async (id) => {
  if (!confirm("Hapus cabang ini?")) return;
  await api.delete(`/branches/${id}`);
  load();
};

const reset = () => {
  isEdit.value = false;
  editId.value = null;
  form.value = { nama_cabang: "", alamat: "", kota: "" };
};
</script>

<style scoped>
.layout { display: flex; }
.content { flex: 1; padding: 20px; }
.form input { margin-right: 10px; }
table { width: 100%; margin-top: 20px; border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 8px; }
button { margin-right: 5px; }
</style>
