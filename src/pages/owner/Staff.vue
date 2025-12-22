<template>
  <div class="layout">
    <Sidebar />

    <div class="content">
      <Navbar />

      <h2>Manajemen Staff</h2>

      <!-- FORM -->
      <form @submit.prevent="submit">
        <input
          v-model="form.username"
          placeholder="Username"
          required
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          required
        />

        <select v-model="form.branch" required>
          <option value="">Pilih Cabang</option>
          <option
            v-for="b in branches"
            :key="b._id"
            :value="b._id"
          >
            {{ b.nama_cabang }}
          </option>
        </select>

        <button>{{ isEdit ? "Update" : "Tambah" }}</button>
        <button
          v-if="isEdit"
          type="button"
          @click="reset"
        >
          Batal
        </button>
      </form>

      <!-- TABLE -->
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Cabang</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in staff" :key="s._id">
            <td>{{ s.username }}</td>
            <td>{{ s.branch?.nama_cabang }}</td>
            <td>
              <button @click="edit(s)">Edit</button>
              <button @click="remove(s._id)">Hapus</button>
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

const staff = ref([]);
const branches = ref([]);

const isEdit = ref(false);
const editId = ref(null);

const form = ref({
  username: "",
  password: "",
  branch: ""
});

const load = async () => {
  const [staffRes, branchRes] = await Promise.all([
    api.get("/users?role=staff"),
    api.get("/branches")
  ]);

  staff.value = staffRes.data;
  branches.value = branchRes.data;
};

onMounted(load);

const submit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/users/${editId.value}`, form.value);
    } else {
      await api.post("/users", {
        ...form.value,
        role: "staff"
      });
    }
    reset();
    load();
  } catch (err) {
    alert("Gagal menyimpan staff");
  }
};

const edit = (s) => {
  isEdit.value = true;
  editId.value = s._id;
  form.value = {
    username: s.username,
    password: "",
    branch: s.branch?._id
  };
};

const remove = async (id) => {
  if (!confirm("Hapus staff ini?")) return;
  await api.delete(`/users/${id}`);
  load();
};

const reset = () => {
  isEdit.value = false;
  editId.value = null;
  form.value = {
    username: "",
    password: "",
    branch: ""
  };
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
form input,
form select {
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
</style>
