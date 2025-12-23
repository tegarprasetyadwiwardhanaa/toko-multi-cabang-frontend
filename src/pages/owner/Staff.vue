<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Manajemen Staff</h2>
        <p class="text-slate-500 text-sm">Kelola data karyawan dan akses login.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama atau username..." 
            class="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 outline-none transition-all"
          />
          <Search class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <button 
          @click="openModal()" 
          class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-medium"
        >
          <UserPlus class="w-5 h-5" />
          <span>Staff Baru</span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      <div v-if="filteredStaff.length === 0" class="p-12 text-center flex flex-col items-center">
        <Users class="w-16 h-16 text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-900">
          {{ searchQuery ? 'Staff tidak ditemukan' : 'Belum ada staff' }}
        </h3>
        <p class="text-slate-500 mt-1">Tambahkan karyawan Anda di sini.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Identitas Staff</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Penempatan Cabang</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="s in filteredStaff" :key="s._id" class="hover:bg-slate-50 transition-colors">
              
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-3 uppercase">
                    {{ getInitials(s.nama_lengkap || s.username) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-800 capitalize">{{ s.nama_lengkap }}</div>
                    <div class="text-xs text-slate-500 font-mono">@{{ s.username }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center text-slate-600">
                  <MapPin class="w-4 h-4 mr-1 text-slate-400" />
                  <span v-if="s.branch" class="font-medium">{{ s.branch.nama_cabang }}</span>
                  <span v-else class="text-red-500 text-sm italic">Belum ditempatkan</span>
                </div>
              </td>

              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Aktif
                </span>
              </td>

              <td class="px-6 py-4 text-right space-x-2">
                <button @click="edit(s)" class="text-indigo-600 hover:text-indigo-900 transition-colors" title="Edit Akun">
                  <Pencil class="w-4 h-4 inline" />
                </button>
                <button @click="remove(s._id)" class="text-red-600 hover:text-red-900 transition-colors" title="Hapus Akun">
                  <Trash2 class="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="text-lg font-bold text-slate-800">
            {{ isEdit ? "Edit Data Staff" : "Tambah Staff Baru" }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="submit" class="p-6 space-y-4">
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <div class="relative">
              <input 
                v-model="form.nama_lengkap" 
                type="text" 
                required
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none capitalize"
                placeholder="Contoh: Budi Santoso"
              />
              
              <IdCard class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Username (Login)</label>
            <div class="relative">
              <input 
                v-model="form.username" 
                type="text" 
                required
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Tanpa spasi, misal: kasir01"
              />
              <User class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Password 
              <span v-if="isEdit" class="text-xs font-normal text-slate-500 ml-1">(Kosongkan jika tidak diganti)</span>
            </label>
            <div class="relative">
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'"
                :required="!isEdit"
                class="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
              />
              <Lock class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Penempatan Cabang</label>
            <div class="relative">
              <select 
                v-model="form.branch" 
                required
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
              >
                <option value="">-- Pilih Cabang --</option>
                <option v-for="b in branches" :key="b._id" :value="b._id">
                  {{ b.nama_cabang }}
                </option>
              </select>
              <Store class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 mt-2">
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
              {{ isEdit ? "Update Akun" : "Buat Akun" }}
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
import { 
  Users, UserPlus, Search, Pencil, Trash2, X, 
  User, Lock, Eye, EyeOff, Store, MapPin, IdCard
} from 'lucide-vue-next';

// State
const staff = ref([]);
const branches = ref([]);
const searchQuery = ref("");
const showModal = ref(false);
const showPassword = ref(false); 
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
  nama_lengkap: "", // Field Baru
  username: "",
  password: "",
  branch: ""
});

// Load Data
const load = async () => {
  try {
    const [staffRes, branchRes] = await Promise.all([
      api.get("/users?role=staff"),
      api.get("/branches")
    ]);
    staff.value = staffRes.data;
    branches.value = branchRes.data;
  } catch (err) {
    console.error("Gagal load data", err);
  }
};

onMounted(load);

// Helper: Ambil inisial nama
const getInitials = (name) => {
  if (!name) return "S";
  return name.substring(0, 2).toUpperCase();
};

// Search Logic (Sekarang bisa cari berdasarkan Nama Lengkap juga)
const filteredStaff = computed(() => {
  if (!searchQuery.value) return staff.value;
  const lower = searchQuery.value.toLowerCase();
  return staff.value.filter(s => 
    (s.nama_lengkap && s.nama_lengkap.toLowerCase().includes(lower)) ||
    s.username.toLowerCase().includes(lower) ||
    (s.branch && s.branch.nama_cabang.toLowerCase().includes(lower))
  );
});

// Modal Logic
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
  form.value = { nama_lengkap: "", username: "", password: "", branch: "" };
  editId.value = null;
  isEdit.value = false;
  showPassword.value = false; 
};

// CRUD Logic
const submit = async () => {
  try {
    if (isEdit.value) {
      const payload = { ...form.value };
      if (!payload.password) delete payload.password;

      await api.put(`/users/${editId.value}`, payload);
    } else {
      await api.post("/users", {
        ...form.value,
        role: "staff"
      });
    }
    closeModal();
    load();
  } catch (err) {
    alert("Gagal menyimpan data staff");
  }
};

const edit = (s) => {
  form.value = {
    nama_lengkap: s.nama_lengkap || "", // Load nama lengkap
    username: s.username,
    password: "", 
    branch: s.branch?._id || ""
  };
  editId.value = s._id;
  isEdit.value = true;
  showModal.value = true;
};

const remove = async (id) => {
  if (!confirm("Hapus akun staff ini?")) return;
  try {
    await api.delete(`/users/${id}`);
    load();
  } catch (err) {
    alert("Gagal menghapus staff");
  }
};
</script>