<template>
  <div class="p-6 min-h-screen">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Cabang</h2>
        <p class="text-slate-500 text-sm mt-1">Kelola lokasi operasional dan status aktif cabang.</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <Search class="w-5 h-5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama atau kota..." 
            class="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 transition-all shadow-sm"
          />
        </div>

        <button 
          @click="openModal()" 
          class="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium cursor-pointer"
        >
          <Plus class="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Tambah Cabang</span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      <div v-if="isLoading" class="p-6 space-y-4">
        <div v-for="i in 3" :key="i" class="flex justify-between items-center animate-pulse">
           <div class="space-y-2 w-1/3">
             <div class="h-4 bg-slate-100 rounded w-3/4"></div>
             <div class="h-3 bg-slate-100 rounded w-1/2"></div>
           </div>
           <div class="h-8 bg-slate-100 rounded w-20"></div>
           <div class="h-8 bg-slate-100 rounded w-20"></div>
        </div>
      </div>

      <div v-else-if="filteredBranches.length === 0" class="p-16 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div class="bg-slate-50 p-4 rounded-full mb-4 ring-1 ring-slate-100">
          <Store class="w-10 h-10 text-slate-400" />
        </div>
        <h3 class="text-lg font-bold text-slate-800">Data Tidak Ditemukan</h3>
        <p class="text-slate-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
          {{ searchQuery ? `Tidak ada cabang dengan kata kunci "${searchQuery}".` : 'Belum ada data cabang yang ditambahkan.' }}
        </p>
        <button v-if="searchQuery" @click="searchQuery = ''" class="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium font-sans">
          Bersihkan Pencarian
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Cabang</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="b in filteredBranches" 
              :key="b._id" 
              class="group transition-colors duration-200"
              :class="b.is_active ? 'hover:bg-slate-50/80' : 'bg-slate-50/50 grayscale opacity-80 hover:opacity-100'"
            >
              <td class="px-6 py-4 align-middle">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-lg shrink-0">
                      {{ b.nama_cabang.charAt(0).toUpperCase() }}
                   </div>
                   <div class="font-semibold text-slate-800 text-sm">{{ b.nama_cabang }}</div>
                </div>
              </td>
              
              <td class="px-6 py-4 align-middle">
                <div class="flex flex-col">
                  <div class="text-sm text-slate-700 mb-0.5 font-medium flex items-center gap-1">
                    <MapPin class="w-3 h-3 text-slate-400" /> {{ b.kota }}
                  </div>
                  <div class="text-xs text-slate-500 truncate max-w-[220px]" :title="b.alamat">{{ b.alamat }}</div>
                </div>
              </td>

              <td class="px-6 py-4 text-center align-middle">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm transition-all"
                  :class="b.is_active 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="b.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
                  {{ b.is_active ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>

              <td class="px-6 py-4 text-center align-middle">
                <div class="flex items-center justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="edit(b)" 
                    class="p-2 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all tooltip-trigger"
                    title="Edit Detail"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  
                  <button 
                    @click="toggleStatus(b)" 
                    class="p-2 rounded-lg transition-all border"
                    :class="b.is_active 
                      ? 'text-rose-600 border-transparent hover:border-rose-200 hover:bg-rose-50' 
                      : 'text-emerald-600 border-transparent hover:border-emerald-200 hover:bg-emerald-50'"
                    :title="b.is_active ? 'Nonaktifkan Cabang' : 'Aktifkan Cabang'"
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
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 class="text-lg font-bold text-slate-800">
              {{ isEdit ? "Edit Informasi Cabang" : "Tambah Cabang Baru" }}
            </h3>
            <button @click="closeModal" class="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-md transition-all cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="submit" class="p-6 space-y-5 overflow-y-auto">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Cabang <span class="text-rose-500">*</span></label>
              <input 
                v-model="form.nama_cabang" 
                type="text" 
                required
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                placeholder="Contoh: Cabang Melawai Raya"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kota / Wilayah <span class="text-rose-500">*</span></label>
              <input 
                v-model="form.kota" 
                type="text" 
                required
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                placeholder="Contoh: Jakarta Selatan"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Lengkap <span class="text-rose-500">*</span></label>
              <textarea 
                v-model="form.alamat" 
                required
                rows="3"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-sm leading-relaxed"
                placeholder="Jalan, Nomor Gedung, RT/RW..."
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-50">
              <button 
                type="button" 
                @click="closeModal" 
                class="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ isEdit ? "Simpan Perubahan" : "Simpan Data" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/axios"; 
import { Plus, Pencil, Power, X, Store, Search, MapPin } from 'lucide-vue-next';
// PENTING: Kita gunakan alert global yg sudah dibuat sebelumnya agar konsisten
import { Toast, ConfirmAlert } from '../../utils/alert'; 

// State Data
const branches = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const isLoading = ref(true); // Untuk Skeleton Loader
const isSubmitting = ref(false); // Untuk tombol simpan loading
const searchQuery = ref(""); // Untuk Search Bar

// State Form
const form = ref({
  nama_cabang: "",
  alamat: "",
  kota: ""
});

// Load Data
const load = async () => {
  isLoading.value = true;
  try {
    const res = await api.get("/branches");
    branches.value = res.data;
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

// --- FITUR SEARCH (COMPUTED) ---
const filteredBranches = computed(() => {
  if (!searchQuery.value) return branches.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return branches.value.filter(b => 
    b.nama_cabang.toLowerCase().includes(lowerQuery) || 
    b.kota.toLowerCase().includes(lowerQuery)
  );
});

// --- LOGIC MODAL ---
const openModal = () => {
  resetForm();
  isEdit.value = false;
  showModal.value = true;
};

const edit = (b) => {
  form.value = {
    nama_cabang: b.nama_cabang,
    alamat: b.alamat,
    kota: b.kota
  };
  editId.value = b._id;
  isEdit.value = true;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => resetForm(), 300);
};

const resetForm = () => {
  form.value = { nama_cabang: "", alamat: "", kota: "" };
  editId.value = null;
  isSubmitting.value = false;
};

// --- LOGIC CRUD ---
const submit = async () => {
  isSubmitting.value = true;
  
  try {
    if (isEdit.value) {
      await api.put(`/branches/${editId.value}`, form.value);
    } else {
      await api.post("/branches", form.value);
    }
    
    closeModal();
    load();
    
    // Gunakan Toast Global
    Toast.fire({
      icon: 'success',
      title: isEdit.value ? 'Data Diperbarui' : 'Cabang Ditambahkan'
    });

  } catch (e) {
    // Gunakan ConfirmAlert (Modal) untuk error
    ConfirmAlert.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: e.response?.data?.message || "Terjadi kesalahan sistem",
        confirmButtonText: 'Tutup'
    });
  } finally {
    isSubmitting.value = false;
  }
};

// --- LOGIC TOGGLE STATUS ---
const toggleStatus = async (branch) => {
  const isDeactivating = branch.is_active;
  
  // Gunakan ConfirmAlert Global
  const result = await ConfirmAlert.fire({
    title: isDeactivating ? 'Nonaktifkan Cabang?' : 'Aktifkan Cabang?',
    text: isDeactivating 
      ? `Cabang "${branch.nama_cabang}" akan berhenti beroperasi sementara.` 
      : `Cabang "${branch.nama_cabang}" akan kembali aktif.`,
    icon: isDeactivating ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: isDeactivating ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan',
    confirmButtonColor: isDeactivating ? '#ef4444' : '#10b981', 
    cancelButtonText: 'Batal',
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/branches/${branch._id}`); // Asumsi endpoint toggle status
      load();
      Toast.fire({
        icon: 'success',
        title: isDeactivating ? 'Cabang Nonaktif' : 'Cabang Aktif'
      });
    } catch (e) {
      Toast.fire({
          icon: 'error',
          title: 'Gagal Mengubah Status',
          text: e.message
      });
    }
  }
};
</script>

<style scoped>
/* Transisi Modal (Fade & Scale) */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>