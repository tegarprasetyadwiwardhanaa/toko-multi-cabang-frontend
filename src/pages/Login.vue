<template>
  <div class="login-container">
    <h2>Login</h2>

    <form @submit.prevent="login">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";

const username = ref("");
const password = ref("");
const router = useRouter();

const parseJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
};

const login = async () => {
  try {
    const res = await api.post("/auth/login", {
      username: username.value,
      password: password.value
    });

    const token = res.data.token;
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
    alert("Login gagal");
  }
};
</script>

<style scoped>
.login-container {
  width: 300px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

h2 {
  text-align: center;
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

button {
  width: 100%;
  padding: 8px;
  background: #2563eb;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
