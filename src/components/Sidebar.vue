<template>
  <aside class="sidebar">
    <ul v-if="role === 'owner'">
      <li @click="$router.push('/')">Dashboard</li>
      <li @click="$router.push('/branches')">Cabang</li>
      <li @click="$router.push('/categories')">Kategori</li>
      <li @click="$router.push('/products')">Produk</li>
      <li @click="$router.push('/inventory')">Gudang</li>
      <li @click="$router.push('/staff')">Staff</li>

    </ul>

    <ul v-else-if="role === 'staff'">
      <li @click="$router.push('/transactions')">Transaksi</li>
    </ul>
  </aside>
</template>

<script setup>
const role = localStorage.getItem("role");
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #f1f5f9;
  height: 100vh;
  padding: 10px;
}
li {
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
