<template>
  <div class="min-h-screen bg-gray-50 font-sans text-slate-900">
    
    <Sidebar v-if="!isLoginPage" />

    <div 
      :class="[
        'flex flex-col min-h-screen transition-all duration-300 ease-in-out', 
        !isLoginPage ? 'ml-0 lg:ml-64' : ''  
      ]"
    >
      <Navbar v-if="!isLoginPage" />

      <main class="flex-1 p-4 lg:p-8">
        <router-view v-slot="{ Component }">
          <transition 
            name="fade" 
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>