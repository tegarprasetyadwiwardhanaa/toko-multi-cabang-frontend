<template>
  <div class="space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Staff</h2>
        <p class="text-slate-500 text-sm mt-1">Kelola data karyawan, penempatan cabang, dan hak akses sistem.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative group">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama atau username..." 
            class="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 outline-none transition-all shadow-sm group-hover:border-indigo-300"
          />
          <Search class="w-5 h-5 text-slate-400 absolute left-3 top-2.5 group-hover:text-indigo-500 transition-colors" />
        </div>

        <button 
          @click="openModal()" 
          class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all font-bold text-sm"
        >
          <UserPlus class="w-5 h-5" />
          <span>Staff Baru</span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
      
      <div v-if="isLoading" class="p-6 space-y-4">
         <div v-for="i in 5" :key="i" class="flex items-center justify-between animate-pulse border-b border-slate-50 pb-4 last:border-0">
            <div class="flex items-center gap-4 w-1/3">
                <div class="w-10 h-10 bg-slate-100 rounded-full"></div>
                <div class="space-y-2 w-full">
                    <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
            </div>
            <div class="h-4 bg-slate-100 rounded w-32"></div>
            <div class="h-6 bg-slate-100 rounded w-20"></div>
            <div class="h-8 bg-slate-100 rounded w-24"></div>
         </div>
      </div>

      <div v-else-if="filteredStaff.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div class="bg-slate-50 p-4 rounded-full mb-4 ring-1 ring-slate-100">
           <Users class="w-12 h-12 text-slate-300" />
        </div>
        <h3 class="text-lg font-bold text-slate-800">
          {{ searchQuery ? 'Staff Tidak Ditemukan' : 'Belum Ada Staff' }}
        </h3>
        <p class="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
           {{ searchQuery ? `Tidak ada hasil untuk "${searchQuery}".` : 'Tambahkan karyawan pertama Anda untuk memberikan akses sistem.' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identitas Staff</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Penempatan</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status Akses</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="s in filteredStaff" 
              :key="s._id" 
              class="transition-colors duration-200 group"
              :class="s.is_active ? 'hover:bg-slate-50' : 'bg-slate-50/50 grayscale opacity-70 hover:opacity-100'"
            >
              <td class="px-6 py-4 align-middle">
                <div class="flex items-center gap-4">
                  <div class="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-white ring-2 ring-slate-100"
                    :class="s.is_active ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-200 text-slate-500'">
                    {{ getInitials(s.nama_lengkap || s.username) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-800 capitalize text-sm">{{ s.nama_lengkap }}</div>
                    <div class="flex items-center gap-1.5 mt-0.5">
                        <User class="w-3 h-3 text-slate-400" />
                        <span class="text-xs text-slate-500 font-mono font-medium">@{{ s.username }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 align-middle">
                <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded-md" :class="s.branch ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'">
                        <MapPin class="w-4 h-4" />
                    </div>
                    <div class="flex flex-col">
                        <span v-if="s.branch" class="text-sm font-semibold text-slate-700">{{ s.branch.nama_cabang }}</span>
                        <span v-else class="text-xs font-bold text-slate-400 italic">Belum ditempatkan</span>
                        
                        <span v-if="s.branch" class="text-[10px] text-slate-500">{{ s.branch.kota }}</span>
                    </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center align-middle">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition-all"
                  :class="s.is_active 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-2" :class="s.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"></span>
                  {{ s.is_active ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>

              <td class="px-6 py-4 text-center align-middle">
                <div class="flex justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="edit(s)" 
                    class="p-2 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all tooltip-trigger" 
                    title="Edit Data Staff"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  
                  <button 
                    @click="toggleStatus(s)" 
                    class="p-2 rounded-lg transition-all border"
                    :class="s.is_active 
                      ? 'text-rose-600 border-transparent hover:border-rose-200 hover:bg-rose-50' 
                      : 'text-emerald-600 border-transparent hover:border-emerald-200 hover:bg-emerald-50'"
                    :title="s.is_active ? 'Matikan Akses' : 'Aktifkan Akses'"
                  >
                    <Power class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

            <div class="flex min-h-full items-center justify-center p-4">
                <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                    
                    <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 class="text-lg font-bold text-slate-800">
                                {{ isEdit ? "Edit Data Staff" : "Tambah Staff Baru" }}
                            </h3>
                            <p class="text-xs text-slate-500">Pastikan data valid untuk akses login.</p>
                        </div>
                        <button @click="closeModal" class="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-md transition-colors">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <form @submit.prevent="submit" class="p-6 space-y-5">
                        
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1.5">Nama Lengkap <span class="text-rose-500">*</span></label>
                            <div class="relative group/input">
                                <input 
                                    v-model="form.nama_lengkap" 
                                    type="text" 
                                    required
                                    class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none capitalize transition-all"
                                    placeholder="Contoh: Budi Santoso"
                                />
                                <IdCard class="w-5 h-5 text-slate-400 absolute left-3 top-2.5 group-focus-within/input:text-indigo-500 transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1.5">Username Login <span class="text-rose-500">*</span></label>
                            <div class="relative group/input">
                                <input 
                                    v-model="form.username" 
                                    type="text" 
                                    required
                                    :disabled="isEdit" 
                                    class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 transition-all font-mono text-sm"
                                    placeholder="Tanpa spasi, misal: kasir01"
                                />
                                <User class="w-5 h-5 text-slate-400 absolute left-3 top-2.5 group-focus-within/input:text-indigo-500 transition-colors" />
                            </div>
                            <p v-if="isEdit" class="text-[10px] text-slate-400 mt-1 italic">Username tidak dapat diubah setelah dibuat.</p>
                        </div>

                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <label class="block text-sm font-bold text-slate-700 mb-1.5">
                                Password Akses
                                <span v-if="isEdit" class="text-xs font-normal text-slate-500 ml-1">(Kosongkan jika tidak ingin mengubah)</span>
                                <span v-else class="text-rose-500">*</span>
                            </label>
                            <div class="relative group/input">
                                <input 
                                    v-model="form.password" 
                                    :type="showPassword ? 'text' : 'password'"
                                    :required="!isEdit"
                                    class="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white transition-all"
                                    placeholder="••••••••"
                                />
                                <Lock class="w-5 h-5 text-slate-400 absolute left-3 top-2.5 group-focus-within/input:text-indigo-500 transition-colors" />
                                
                                <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none">
                                    <Eye v-if="!showPassword" class="w-5 h-5" />
                                    <EyeOff v-else class="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1.5">Penempatan Cabang <span class="text-rose-500">*</span></label>
                            <div class="relative group/input">
                                <select 
                                    v-model="form.branch" 
                                    required
                                    class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none bg-white transition-all cursor-pointer"
                                >
                                    <option value="">-- Pilih Lokasi Kerja --</option>
                                    <option v-for="b in activeBranches" :key="b._id" :value="b._id">
                                    {{ b.nama_cabang }}
                                    </option>
                                </select>
                                <Store class="w-5 h-5 text-slate-400 absolute left-3 top-2.5 group-focus-within/input:text-indigo-500 transition-colors" />
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                    <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 pt-4 border-t border-slate-50">
                            <button 
                                type="button" 
                                @click="closeModal" 
                                class="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                :disabled="isSubmitting"
                                class="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                {{ isEdit ? "Simpan Perubahan" : "Buat Akun Staff" }}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/axios";
import { 
  Users, UserPlus, Search, Pencil, Power, X, 
  User, Lock, Eye, EyeOff, Store, MapPin, IdCard
} from 'lucide-vue-next';
// Import Global Alerts
import { Toast, ConfirmAlert } from '../../utils/alert'; 

// State
const staff = ref([]);
const branches = ref([]);
const searchQuery = ref("");
const showModal = ref(false);
const showPassword = ref(false); 
const isEdit = ref(false);
const editId = ref(null);
const isLoading = ref(true); // Skeleton State
const isSubmitting = ref(false); // Button Loading State

const form = ref({
  nama_lengkap: "",
  username: "",
  password: "",
  branch: ""
});

// Load Data
const load = async () => {
  if (staff.value.length === 0) isLoading.value = true;

  try {
    const [staffRes, branchRes] = await Promise.all([
      api.get("/users"), 
      api.get("/branches")
    ]);
    staff.value = staffRes.data;
    branches.value = branchRes.data;
  } catch (err) {
    Toast.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Tidak dapat terhubung ke server.'
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(load);

// Helpers
const getInitials = (name) => {
  if (!name) return "S";
  // Ambil 2 huruf pertama dari kata pertama dan kedua (jika ada)
  const parts = name.split(' ');
  if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const activeBranches = computed(() => branches.value.filter(b => b.is_active));

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
  isSubmitting.value = false;
};

// CRUD Logic
const submit = async () => {
  isSubmitting.value = true;
  try {
    if (isEdit.value) {
      const payload = { ...form.value };
      if (!payload.password) delete payload.password; 
      await api.put(`/users/${editId.value}`, payload);
    } else {
      await api.post("/users", { ...form.value });
    }
    
    closeModal();
    await load();
    
    Toast.fire({
        icon: 'success',
        title: isEdit.value ? 'Data Staff Diupdate' : 'Staff Baru Ditambahkan'
    });

  } catch (err) {
    const msg = err.response?.data?.message || "Gagal menyimpan data";
    ConfirmAlert.fire({
        icon: 'error',
        title: 'Error',
        text: msg
    });
  } finally {
    isSubmitting.value = false;
  }
};

const edit = (s) => {
  form.value = {
    nama_lengkap: s.nama_lengkap || "",
    username: s.username,
    password: "", 
    branch: s.branch?._id || ""
  };
  editId.value = s._id;
  isEdit.value = true;
  showModal.value = true;
};

// TOGGLE STATUS
const toggleStatus = async (s) => {
  const isDeactivating = s.is_active;

  const result = await ConfirmAlert.fire({
      title: isDeactivating ? 'Nonaktifkan Akses?' : 'Aktifkan Akses?',
      text: isDeactivating 
        ? `Staff "${s.nama_lengkap}" tidak akan bisa login ke sistem.`
        : `Staff "${s.nama_lengkap}" akan diizinkan login kembali.`,
      icon: isDeactivating ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: isDeactivating ? 'Ya, Matikan' : 'Ya, Aktifkan',
      confirmButtonColor: isDeactivating ? '#ef4444' : '#10b981',
      cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
      try {
        await api.delete(`/users/${s._id}`); 
        load();
        Toast.fire({
            icon: 'success',
            title: isDeactivating ? 'Akses Dinonaktifkan' : 'Akses Diaktifkan'
        });
      } catch (err) {
        Toast.fire({ icon: 'error', title: 'Gagal mengubah status' });
      }
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>