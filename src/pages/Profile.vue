<template>
  <div class="max-w-4xl mx-auto mt-8 px-4">

    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Akun Saya</h2>
      <p class="text-slate-500 text-sm">
        Kelola informasi akun dan keamanan Anda.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Profile Card -->
      <div class="md:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center h-full">

          <div class="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold mb-4 border-4 border-indigo-50">
            {{ getInitials(username) }}
          </div>

          <h3 class="text-lg font-bold text-slate-800">{{ username }}</h3>

          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 capitalize"
            :class="role === 'owner'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'"
          >
            {{ role }}
          </span>

          <div class="mt-6 w-full border-t border-slate-100 pt-4 text-left">
            <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
              Detail Login
            </p>

            <div class="flex items-center gap-3 text-sm text-slate-600 mb-2">
              <User class="w-4 h-4 text-slate-400" />
              <span>@{{ username }}</span>
            </div>

            <div class="flex items-center gap-3 text-sm text-slate-600">
              <Shield class="w-4 h-4 text-slate-400" />
              <span class="capitalize">Akses: {{ role }}</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Security Section -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

          <!-- Section Header -->
          <h3 class="font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Lock class="w-5 h-5 text-indigo-600" />
            Keamanan Akun
          </h3>
          <p class="text-sm text-slate-500 mb-4">
            Perbarui password untuk menjaga keamanan akun Anda
          </p>

          <!-- Security Context -->
          <div class="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-800">
            <p class="font-medium mb-1">Perhatian Keamanan</p>
            <p>
              Demi keamanan akun Anda, gunakan password yang kuat dan jangan
              membagikannya kepada siapa pun.
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="submit" class="space-y-4">

            <!-- Old Password -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Password Lama
              </label>
              <div class="relative">
                <input
                  v-model="form.oldPassword"
                  :type="showOld ? 'text' : 'password'"
                  required
                  class="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  @click="showOld = !showOld"
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <Eye v-if="!showOld" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Password Baru
              </label>
              <div class="relative">
                <input
                  v-model="form.newPassword"
                  :type="showNew ? 'text' : 'password'"
                  required
                  class="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  @click="showNew = !showNew"
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <Eye v-if="!showNew" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                Gunakan kombinasi huruf dan angka untuk keamanan yang lebih baik.
              </p>
            </div>

            <!-- Actions -->
            <div class="pt-3 flex flex-col sm:flex-row items-center gap-3">

              <button
                type="submit"
                :disabled="!isValid || loading"
                class="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span
                  v-if="loading"
                  class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                ></span>
                Perbarui Password
              </button>

              <button
                type="button"
                @click="resetForm"
                class="text-sm text-slate-500 hover:text-slate-700"
              >
                Batalkan perubahan
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from '../api/axios'
import { Lock, User, Shield, Eye, EyeOff } from 'lucide-vue-next'
import { Toast, ConfirmAlert } from '../utils/alert'

// User Info
const username = localStorage.getItem('username') || 'User'
const role = localStorage.getItem('role') || 'staff'

// State
const form = ref({
  oldPassword: '',
  newPassword: ''
})

const loading = ref(false)
const showOld = ref(false)
const showNew = ref(false)

// Validation UX
const isValid = computed(() => {
  return form.value.oldPassword && form.value.newPassword.length >= 6
})

const getInitials = (name) => {
  if (!name) return 'U'
  return name.substring(0, 2).toUpperCase()
}

const resetForm = () => {
  form.value = { oldPassword: '', newPassword: '' }
}

const submit = async () => {
  const confirm = await ConfirmAlert.fire({
    title: 'Perbarui Password?',
    text: 'Anda akan diminta login ulang setelah password diperbarui.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Perbarui',
    cancelButtonText: 'Batal'
  })

  if (!confirm.isConfirmed) return

  loading.value = true
  try {
    await axios.put('/users/change-password', form.value)

    Toast.fire({
      icon: 'success',
      title: 'Password berhasil diperbarui'
    })

    resetForm()

    // Optional auto logout
    // localStorage.clear()
    // window.location.href = '/login'

  } catch (error) {
    Toast.fire({
      icon: 'error',
      title: error.response?.data?.message || 'Gagal memperbarui password'
    })
  } finally {
    loading.value = false
  }
}
</script>
