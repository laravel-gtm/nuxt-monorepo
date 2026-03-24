<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, logout } = useAuth()
</script>

<template>
  <div style="max-width: 600px; margin: 80px auto; font-family: system-ui, sans-serif;">
    <h1>Dashboard</h1>
    <div v-if="user" style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
    <button
      style="padding: 0.75rem 1.5rem; background: #dc2626; color: #fff; border: none; border-radius: 6px; cursor: pointer;"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>
