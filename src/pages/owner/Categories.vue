<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Kategori Produk</h2>
        <p class="text-slate-500 text-sm mt-1">Kelola pengelompokan barang di toko Anda.</p>
      </div>
      
      <button 
        @click="openModal()" 
        class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 font-medium text-sm"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Kategori</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
      
      <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div class="relative w-full sm:w-72">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-slate-400" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out" 
            placeholder="Cari nama kategori..." 
          />
        </div>
        <div class="text-xs text-slate-500 font-medium">
          Total: <span class="text-indigo-600 font-bold">{{ filteredCategories.length }}</span> Kategori
        </div>
      </div>

      <div v-if="filteredCategories.length === 0" class="p-12 text-center flex flex-col items-center justify-center">
        <div class="bg-slate-50 p-4 rounded-full mb-3">
          <Tags class="w-8 h-8 text-slate-400" />
        </div>
        <h3 class="text-slate-900 font-medium mb-1">
          {{ searchQuery ? 'Tidak ditemukan' : 'Belum ada data' }}
        </h3>
        <p class="text-slate-500 text-sm max-w-xs mx-auto">
          {{ searchQuery ? `Kategori "${searchQuery}" tidak tersedia.` : 'Mulai dengan menambahkan kategori baru untuk toko Anda.' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                No
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Nama Kategori
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="(c, index) in filteredCategories" :key="c._id" class="hover:bg-slate-50 transition-colors duration-150 group">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mr-3 group-hover:bg-indigo-100 transition-colors">
                     <Tag class="w-4 h-4" />
                  </div>
                  <div class="text-sm font-medium text-slate-900">{{ c.nama_kategori }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button 
                    @click="edit(c)" 
                    class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                    title="Edit Data"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    @click="remove(c._id)" 
                    class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                    title="Hapus Data"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <Tag class="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-semibold leading-6 text-slate-900" id="modal-title">
                  {{ isEdit ? "Edit Kategori" : "Tambah Kategori Baru" }}
                </h3>
                <div class="mt-4">
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Nama Kategori</label>
                  <input 
                    v-model="form.nama_kategori" 
                    type="text" 
                    required
                    class="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm"
                    placeholder="Contoh: Elektronik, Pakaian..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button 
              type="button" 
              @click="submit"
              :disabled="isLoading"
              class="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed items-center gap-2"
            >
              <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              {{ isEdit ? "Simpan Perubahan" : "Simpan Kategori" }}
            </button>
            <button 
              type="button" 
              @click="closeModal" 
              class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
            >
              Batal
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/axios";
import { Plus, Pencil, Trash2, X, Tags, Tag, Search } from 'lucide-vue-next';

const categories = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const isLoading = ref(false);
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
  try {
    const res = await api.get("/categories");
    categories.value = res.data;
  } catch (err) {
    console.error("Gagal memuat kategori", err);
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
    isLoading.value = false;
  }, 200);
};

const submit = async () => {
  if(!form.value.nama_kategori) return;
  
  isLoading.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/categories/${editId.value}`, form.value);
    } else {
      await api.post("/categories", form.value);
    }
    await load();
    closeModal();
  } catch (err) {
    alert("Terjadi kesalahan sistem.");
  } finally {
    isLoading.value = false;
  }
};

const edit = (c) => {
  form.value.nama_kategori = c.nama_kategori;
  editId.value = c._id;
  isEdit.value = true;
  showModal.value = true;
};

const remove = async (id) => {
  if (!confirm("Yakin ingin menghapus kategori ini?")) return; // Idealnya diganti SweetAlert
  try {
    await api.delete(`/categories/${id}`);
    load();
  } catch (err) {
    alert("Gagal menghapus");
  }
};
</script>