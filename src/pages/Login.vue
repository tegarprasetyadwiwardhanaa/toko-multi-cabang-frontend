<template>
  <div class="flex min-h-screen w-full font-sans">
    
    <div class="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-center items-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900 z-0"></div>
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 text-center px-12 max-w-2xl">
        <div class="bg-white p-6 rounded-3xl shadow-2xl mx-auto mb-8 w-40 h-40 flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
          <img :src="logoImage" alt="Logo Toko" class="max-w-full max-h-full object-contain" />
        </div>
        <h1 class="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Sistem Manajemen Toko <br/> <span class="text-indigo-400">& Inventori Barang</span>
        </h1>
        <p class="text-slate-300 text-lg font-light leading-relaxed">
          Kelola stok, pantau transaksi, dan laporan keuangan dalam satu dashboard.
        </p>
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
      <div class="mx-auto w-full max-w-sm lg:w-96 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        
        <div class="text-left mb-8">
          <div class="lg:hidden mb-6 flex justify-center">
             <div class="bg-white p-2 rounded-xl shadow-md border border-gray-200">
                <img :src="logoImage" class="h-12 w-auto" alt="Logo Mobile" />
             </div>
          </div>
          <h2 class="text-3xl font-extrabold text-slate-900">Selamat Datang</h2>
          <p class="mt-2 text-sm text-slate-500">Masuk untuk mengelola toko Anda.</p>
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-fade-in-down">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div>
            <label for="username" class="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              :disabled="isLoading"
              class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="isLoading"
                class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                placeholder="••••••••"
              />
              
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer focus:outline-none z-10 transition-colors duration-200"
                :class="showPassword ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'"
                title="Tampilkan/Sembunyikan Password"
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
              class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
              <span v-else>Masuk Sistem</span>
            </button>
          </div>

        </form>
        
        <div class="mt-8 pt-6 border-t border-gray-100 text-center">
            <p class="text-xs text-slate-400">&copy; 2024 Toko Inventory System.<br>Dikelola oleh Ombak Bersaudara.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";
import logoImage from '../components/logo.jpeg'; 

// --- PERBAIKAN UTAMA: Import Icon Eye dan EyeOff ---
import { Eye, EyeOff } from 'lucide-vue-next'; 

const username = ref("");
const password = ref("");
const showPassword = ref(false); 
const isLoading = ref(false);    
const errorMessage = ref("");    
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
  errorMessage.value = "";
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

    if (payload.role === "owner") {
      router.push("/");
    } else {
      router.push("/transactions");
    }
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 401) {
        errorMessage.value = "Username atau password salah.";
    } else if (err.code === "ERR_NETWORK") {
        errorMessage.value = "Gagal terhubung ke server. Cek koneksi internet.";
    } else {
        errorMessage.value = "Terjadi kesalahan sistem. Silakan coba lagi.";
    }
  } finally {
    isLoading.value = false; 
  }
};
</script>