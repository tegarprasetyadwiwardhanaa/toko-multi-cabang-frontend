<template>
  <div class="flex min-h-screen w-full font-sans bg-gray-50">
    
    <div class="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-center items-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-slate-900 z-0"></div>
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 text-center px-12 max-w-2xl">
        <div class="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl mx-auto mb-8 w-40 h-40 flex items-center justify-center transform hover:scale-105 transition-transform duration-500 border border-white/20">
          <img :src="logoImage" alt="Logo Toko" class="w-full h-full object-contain drop-shadow-lg" />
        </div>
        <h1 class="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Sistem Manajemen Toko &<br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">Inventori Barang</span>
        </h1>
        <p class="text-slate-300 text-lg font-light leading-relaxed">
          Kelola stok, transaksi, dan dashboard keuangan dalam satu sistem.
        </p>
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
        
        <div class="text-left mb-8">
          <div class="lg:hidden mb-6 flex justify-center">
             <div class="bg-white p-2 rounded-xl shadow-md border border-gray-200">
                <img :src="logoImage" class="h-12 w-auto" alt="Logo Mobile" />
             </div>
          </div>
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang</h2>
          <p class="mt-2 text-sm text-slate-500">Silakan masuk untuk mengakses sistem.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div>
            <label for="username" class="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              :disabled="isLoading"
              class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-white"
              placeholder="Masukkan username Anda"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
                <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
            </div>
            
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="isLoading"
                class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed pr-12 hover:bg-white"
                placeholder="••••••••"
              />
              
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer focus:outline-none z-10 transition-colors duration-200"
                :class="showPassword ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'"
              >
                <Eye v-if="!showPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0 active:scale-95"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memverifikasi...
              </span>
              <span v-else>Masuk Sistem</span>
            </button>
          </div>

        </form>
        
        <div class="mt-8 pt-6 border-t border-gray-100 text-center">
            <p class="text-xs text-slate-400 leading-tight">
                &copy; 2025 Sistem Manajemen Toko.<br>
                Crafted by <span class="font-medium text-indigo-500">Ombak Bersaudara</span>.
            </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios"; // Pastikan path ini benar
import logoImage from '../components/logo.jpeg'; 
import { Eye, EyeOff } from 'lucide-vue-next'; 
import { Toast, ConfirmAlert } from '../utils/alert'; // Import Utility Alert kita

const username = ref("");
const password = ref("");
const showPassword = ref(false); 
const isLoading = ref(false);    
const router = useRouter();

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (e) {
    console.error("Gagal parse token", e);
    return {};
  }
};

const handleLogin = async () => {
  // Tidak perlu reset errorMessage manual lagi
  isLoading.value = true;

  try {
    const res = await api.post("/auth/login", {
      username: username.value,
      password: password.value
    });

    const token = res.data.token;
    if (!token) throw new Error("Token tidak diterima dari server");

    const payload = parseJwt(token);

    localStorage.setItem("token", token);
    localStorage.setItem("role", payload.role);
    localStorage.setItem("branch", payload.branch || "");
    localStorage.setItem("username", res.data.user.username);

    // UX: Tampilkan pesan sukses sebentar sebelum pindah halaman
    Toast.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: `Selamat datang kembali, ${res.data.user.username}`
    });

    // Beri jeda sedikit agar user bisa melihat notifikasi (optional, 500ms cukup)
    setTimeout(() => {
        if (payload.role === "owner") {
            router.push("/");
        } else {
            router.push("/transactions");
        }
    }, 800);

  } catch (err) {
    console.error(err);
    
    // LOGIKA ALERT BARU: Lebih interaktif
    let message = "Terjadi kesalahan sistem.";
    let iconType = "error";

    if (err.response) {
      // 1. Salah Username/Password (Gunakan Toast karena ini error ringan/umum)
      if (err.response.status === 401) {
        message = "Username atau password salah.";
        iconType = "warning"; // Warning lebih ramah daripada error merah
        Toast.fire({
            icon: iconType,
            title: 'Gagal Masuk',
            text: message
        });
      } 
      // 2. AKSES DITOLAK (Gunakan Modal karena ini isu serius)
      else if (err.response.status === 403) {
        message = err.response.data.message || "Akses ditolak untuk akun ini.";
        ConfirmAlert.fire({
            icon: 'error',
            title: 'Akses Ditolak',
            text: message,
            confirmButtonText: 'Saya Mengerti'
        });
      }
      // 3. Error Server
      else {
        message = err.response.data.message || "Terjadi kesalahan pada server.";
        Toast.fire({ icon: 'error', title: 'Error Server', text: message });
      }
    } 
    // 4. Masalah Koneksi (Penting! Pakai Modal agar user sadar internet mati)
    else if (err.code === "ERR_NETWORK") {
      ConfirmAlert.fire({
        icon: 'question',
        title: 'Koneksi Terputus',
        text: 'Gagal terhubung ke server. Mohon periksa koneksi internet Anda.',
        confirmButtonText: 'Coba Lagi'
      });
    } 
    else {
      Toast.fire({ icon: 'error', title: 'Oops...', text: message });
    }
    
  } finally {
    isLoading.value = false; 
  }
};
</script>