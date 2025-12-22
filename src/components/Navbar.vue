<template>
  <nav class="navbar">
    <span>Dashboard Owner</span>
    <button @click="logout">Logout</button>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.clear();
  router.push("/login");
};

</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #1e293b;
  color: white;
}
button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
