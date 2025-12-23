<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Manajemen Cabang</h2>
        <p class="text-slate-500 text-sm">Kelola daftar cabang toko Anda di sini.</p>
      </div>
      
      <button 
        @click="openModal()" 
        class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 font-medium"
      >
        <Plus class="w-5 h-5" />
        <span>Tambah Cabang</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div v-if="branches.length === 0" class="p-10 text-center flex flex-col items-center">
        <Store class="w-16 h-16 text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-900">Belum ada cabang</h3>
        <p class="text-slate-500 mt-1">Silakan tambahkan cabang baru untuk memulai.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Cabang</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kota</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Alamat Lengkap</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="b in branches" :key="b._id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-slate-800 font-medium">{{ b.nama_cabang }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ b.kota }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600 text-sm truncate max-w-xs">{{ b.alamat }}</td>
              <td class="px-6 py-4 text-right space-x-2">
                <button 
                  @click="edit(b)" 
                  class="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition-colors"
                  title="Edit"
                >
                  <Pencil class="w-4 h-4 inline" />
                </button>
                <button 
                  @click="remove(b._id)" 
                  class="text-red-600 hover:text-red-900 font-medium text-sm transition-colors"
                  title="Hapus"
                >
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
            {{ isEdit ? "Edit Cabang" : "Tambah Cabang Baru" }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="submit" class="p-6 space-y-4">
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Cabang</label>
            <input 
              v-model="form.nama_cabang" 
              type="text" 
              required
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Contoh: Cabang Pusat"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Kota</label>
            <input 
              v-model="form.kota" 
              type="text" 
              required
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Contoh: Jakarta Selatan"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
            <textarea 
              v-model="form.alamat" 
              required
              rows="3"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              placeholder="Jl. Jendral Sudirman No. 1..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
            >
              {{ isEdit ? "Simpan Perubahan" : "Simpan Data" }}
            </button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/axios";
import { Plus, Pencil, Trash2, X, Store } from 'lucide-vue-next';

// State Data
const branches = ref([]);
const showModal = ref(false); // Mengontrol tampil/tidaknya modal
const isEdit = ref(false);
const editId = ref(null);

// State Form
const form = ref({
  nama_cabang: "",
  alamat: "",
  kota: ""
});

// Load Data
const load = async () => {
  try {
    const res = await api.get("/branches");
    branches.value = res.data;
  } catch (err) {
    console.error("Gagal load data", err);
  }
};

onMounted(load);

// --- LOGIC MODAL ---

// Buka Modal untuk Tambah Data
const openModal = () => {
  resetForm(); // Pastikan form bersih dulu
  isEdit.value = false;
  showModal.value = true;
};

// Buka Modal untuk Edit Data
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

// Tutup Modal
const closeModal = () => {
  showModal.value = false;
  setTimeout(() => resetForm(), 300); // Reset setelah animasi tutup (opsional)
};

const resetForm = () => {
  form.value = { nama_cabang: "", alamat: "", kota: "" };
  editId.value = null;
};

// --- LOGIC CRUD ---

const submit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/branches/${editId.value}`, form.value);
    } else {
      await api.post("/branches", form.value);
    }
    closeModal(); // Tutup modal otomatis jika sukses
    load();       // Refresh data tabel
  } catch (e) {
    alert("Gagal menyimpan data cabang. Cek koneksi atau input Anda.");
  }
};

const remove = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus cabang ini? Data yang dihapus tidak bisa dikembalikan.")) return;
  
  try {
    await api.delete(`/branches/${id}`);
    load();
  } catch (e) {
    alert("Gagal menghapus data.");
  }
};
</script>