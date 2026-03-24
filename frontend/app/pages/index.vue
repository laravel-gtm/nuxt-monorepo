<template>
  <div style="max-width: 600px; margin: 80px auto; text-align: center; font-family: system-ui, sans-serif;">
    <h1>Nuxt + Laravel Auth Demo</h1>
    <p style="color: #666; margin-bottom: 2rem;">
      A simple authentication demo using Nuxt SPA with Laravel Sanctum.
    </p>
    <div style="display: flex; gap: 1rem; justify-content: center;">
      <NuxtLink to="/login" style="padding: 0.75rem 1.5rem; background: #000; color: #fff; text-decoration: none; border-radius: 6px;">
        Login
      </NuxtLink>
      <NuxtLink to="/register" style="padding: 0.75rem 1.5rem; border: 1px solid #000; text-decoration: none; border-radius: 6px; color: #000;">
        Register
      </NuxtLink>
    </div>
  </div>
</template>
