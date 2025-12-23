<template>
  <div class="min-h-screen bg-gray-50 font-sans text-slate-900">
    
    <Sidebar v-if="!isLoginPage" />

    <div 
      :class="[
        'flex flex-col min-h-screen transition-all duration-300', 
        !isLoginPage ? 'ml-64' : '' 
      ]"
    >
      
      <Navbar v-if="!isLoginPage" />

      <main class="flex-1 p-8">
        <router-view />
      </main>
      
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Import komponen Sidebar dan Navbar
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';

const route = useRoute();

// Deteksi otomatis: Apakah kita sedang di halaman Login?
const isLoginPage = computed(() => route.path === '/login');
</script>