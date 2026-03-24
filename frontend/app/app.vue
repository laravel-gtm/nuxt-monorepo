<script setup lang="ts">
const { user, initialized } = useAuth()
</script>

<template>
  <div>
    <nav style="padding: 1rem 2rem; border-bottom: 1px solid #eee; display: flex; gap: 1rem; align-items: center; font-family: system-ui, sans-serif;">
      <NuxtLink to="/" style="font-weight: bold; text-decoration: none; color: #000; margin-right: auto;">
        Auth Demo
      </NuxtLink>
      <template v-if="initialized">
        <template v-if="user">
          <NuxtLink to="/dashboard" style="text-decoration: none; color: #333;">Dashboard</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" style="text-decoration: none; color: #333;">Login</NuxtLink>
          <NuxtLink to="/register" style="text-decoration: none; color: #333;">Register</NuxtLink>
        </template>
      </template>
    </nav>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
