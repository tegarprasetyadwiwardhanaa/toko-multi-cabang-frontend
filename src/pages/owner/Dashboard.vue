<template>
  <div class="layout">
    <Sidebar />
    <div class="content">
      <Navbar />

      <h2>Ringkasan</h2>

      <div class="cards">
        <div class="card">
          <h3>Cabang</h3>
          <p>{{ stats.branches }}</p>
        </div>
        <div class="card">
          <h3>Produk</h3>
          <p>{{ stats.products }}</p>
        </div>
        <div class="card">
          <h3>Transaksi</h3>
          <p>{{ stats.transactions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import api from "../../api/axios";
import Navbar from "../../components/Navbar.vue";
import Sidebar from "../../components/Sidebar.vue";

const stats = reactive({
  branches: 0,
  products: 0,
  transactions: 0
});

onMounted(async () => {
  try {
    const [branches, products, transactions] = await Promise.all([
      api.get("/branches"),
      api.get("/products"),
      api.get("/transactions")
    ]);

    stats.branches = branches.data.length;
    stats.products = products.data.length;
    stats.transactions = transactions.data.length;
  } catch (err) {
    console.error("Gagal memuat dashboard", err);
  }
});
</script>

<style scoped>
.layout {
  display: flex;
}
.content {
  flex: 1;
  padding: 20px;
}
.cards {
  display: flex;
  gap: 20px;
}
.card {
  background: #e5e7eb;
  padding: 20px;
  width: 150px;
  text-align: center;
}
</style>
