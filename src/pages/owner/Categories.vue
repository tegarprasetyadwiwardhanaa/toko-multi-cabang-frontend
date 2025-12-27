<template>
  <div class="space-y-6">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Kategori Produk</h2>
        <p class="text-slate-500 text-sm mt-1">Kelola pengelompokan jenis barang di toko Anda.</p>
      </div>
      
      <button 
        @click="openModal()" 
        class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm cursor-pointer group"
      >
        <Plus class="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>Tambah Kategori</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
      
      <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div class="relative w-full sm:w-72">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-slate-400" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out shadow-sm" 
            placeholder="Cari nama kategori..." 
          />
        </div>
        <div class="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
          Total: <span class="text-indigo-600 font-bold text-sm ml-1">{{ filteredCategories.length }}</span>
        </div>
      </div>

      <div v-if="isTableLoading" class="p-6 space-y-4">
         <div v-for="i in 5" :key="i" class="flex items-center justify-between animate-pulse">
            <div class="flex items-center gap-4 w-1/2">
                <div class="w-8 h-8 bg-slate-100 rounded-full"></div>
                <div class="h-4 bg-slate-100 rounded w-full"></div>
            </div>
            <div class="h-6 bg-slate-100 rounded w-20"></div>
            <div class="h-8 bg-slate-100 rounded w-24"></div>
         </div>
      </div>

      <div v-else-if="filteredCategories.length === 0" class="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div class="bg-slate-50 p-4 rounded-full mb-3 ring-1 ring-slate-100">
          <Tags class="w-10 h-10 text-slate-400" />
        </div>
        <h3 class="text-slate-900 font-bold text-lg mb-1">
          {{ searchQuery ? 'Tidak ditemukan' : 'Belum ada data' }}
        </h3>
        <p class="text-slate-500 text-sm max-w-xs mx-auto">
          {{ searchQuery ? `Kategori "${searchQuery}" tidak tersedia.` : 'Mulai dengan menambahkan kategori baru untuk toko Anda.' }}
        </p>
        <button v-if="searchQuery" @click="searchQuery = ''" class="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Reset Pencarian
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">No</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Kategori</th>
              <th scope="col" class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Status</th>
              <th scope="col" class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr 
              v-for="(c, index) in filteredCategories" 
              :key="c._id" 
              class="transition-colors duration-150 group"
              :class="c.is_active ? 'hover:bg-slate-50' : 'bg-slate-50/50 grayscale opacity-60 hover:opacity-100'"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                {{ index + 1 }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mr-3 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <Tag class="w-4 h-4" />
                  </div>
                  <div class="text-sm font-semibold text-slate-800">{{ c.nama_kategori }}</div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm"
                  :class="c.is_active 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="c.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
                  {{ c.is_active ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="flex justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="edit(c)" 
                    class="p-2 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all"
                    title="Edit Data"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  
                  <button 
                    @click="toggleStatus(c)" 
                    class="p-2 rounded-lg transition-all border"
                    :class="c.is_active 
                      ? 'text-rose-600 border-transparent hover:border-rose-200 hover:bg-rose-50' 
                      : 'text-emerald-600 border-transparent hover:border-emerald-200 hover:bg-emerald-50'"
                    :title="c.is_active ? 'Nonaktifkan' : 'Aktifkan'"
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
        <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-slate-100">
                <div class="sm:flex sm:items-center">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 sm:mx-0 sm:h-10 sm:w-10">
                    <Tags class="h-5 w-5 text-indigo-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 class="text-lg font-bold leading-6 text-slate-800" id="modal-title">
                    {{ isEdit ? "Edit Kategori" : "Tambah Kategori Baru" }}
                    </h3>
                    <p class="text-xs text-slate-500 mt-1">Isi informasi kategori dengan lengkap.</p>
                </div>
                </div>
            </div>

            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Nama Kategori <span class="text-rose-500">*</span></label>
                    <input 
                        v-model="form.nama_kategori" 
                        type="text" 
                        required
                        class="block w-full rounded-lg border-slate-300 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none transition-all"
                        placeholder="Contoh: Semen, Paku, Pipa..."
                        @keyup.enter="submit"
                    />
                </div>
            </div>

            <div class="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-slate-100">
                <button 
                type="button" 
                @click="submit"
                :disabled="isSubmitting"
                class="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-70 disabled:cursor-wait items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                {{ isEdit ? "Simpan Perubahan" : "Simpan Kategori" }}
                </button>
                <button 
                type="button" 
                @click="closeModal" 
                class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto cursor-pointer transition-colors"
                >
                Batal
                </button>
            </div>

            </div>
        </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/axios";
import { Plus, Pencil, Power, Tags, Tag, Search } from 'lucide-vue-next';
import { Toast, ConfirmAlert } from '../../utils/alert'; // Import Utilitas Global

const categories = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const isTableLoading = ref(true); // Untuk Skeleton Loader
const isSubmitting = ref(false);  // Untuk Tombol Simpan
const searchQuery = ref("");

const form = ref({ nama_kategori: "" });

// Computed untuk Search Filter
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  return categories.value.filter(c => 
    c.nama_kategori.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const load = async () => {
  // Hanya tampilkan loading skeleton jika data kosong (initial load)
  // Agar saat refresh data setelah edit, tabel tidak kedip
  if(categories.value.length === 0) isTableLoading.value = true;
  
  try {
    const res = await api.get("/categories");
    categories.value = res.data;
  } catch (err) {
    Toast.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Tidak dapat terhubung ke server.'
    });
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(load);

const openModal = () => {
  form.value.nama_kategori = "";
  isEdit.value = false;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    form.value.nama_kategori = "";
    isEdit.value = false;
    editId.value = null;
    isSubmitting.value = false;
  }, 300); // Sesuaikan dengan durasi transisi
};

const submit = async () => {
  if(!form.value.nama_kategori.trim()) {
      Toast.fire({ icon: 'warning', title: 'Nama Kategori Wajib Diisi' });
      return;
  }
  
  isSubmitting.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/categories/${editId.value}`, form.value);
    } else {
      await api.post("/categories", form.value);
    }
    
    await load();
    closeModal();

    Toast.fire({
        icon: 'success',
        title: isEdit.value ? 'Kategori Diperbarui' : 'Kategori Ditambahkan'
    });

  } catch (err) {
    const msg = err.response?.data?.message || "Terjadi kesalahan sistem.";
    ConfirmAlert.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: msg,
        confirmButtonText: 'Tutup'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const edit = (c) => {
  form.value.nama_kategori = c.nama_kategori;
  editId.value = c._id;
  isEdit.value = true;
  showModal.value = true;
};

// LOGIC TOGGLE STATUS (SOFT DELETE)
const toggleStatus = async (cat) => {
  const isDeactivating = cat.is_active;

  const result = await ConfirmAlert.fire({
    title: isDeactivating ? 'Nonaktifkan Kategori?' : 'Aktifkan Kategori?',
    text: isDeactivating 
        ? `Kategori "${cat.nama_kategori}" tidak akan muncul saat input produk.`
        : `Kategori "${cat.nama_kategori}" akan kembali aktif.`,
    icon: isDeactivating ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: isDeactivating ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan',
    confirmButtonColor: isDeactivating ? '#ef4444' : '#10b981',
    cancelButtonText: 'Batal',
  });

  if (result.isConfirmed) {
    try {
        await api.delete(`/categories/${cat._id}`);
        await load(); // Reload data untuk update UI
        
        Toast.fire({
            icon: 'success',
            title: isDeactivating ? 'Kategori Nonaktif' : 'Kategori Aktif'
        });
    } catch (err) {
        Toast.fire({
            icon: 'error',
            title: 'Gagal Mengubah Status',
            text: err.response?.data?.message || "Error"
        });
    }
  }
};
</script>

<style scoped>
/* Animasi Modal agar halus */
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
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>