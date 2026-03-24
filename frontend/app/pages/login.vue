<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const { login } = useAuth()

const form = reactive({ email: '', password: '' })
const errors = ref<Record<string, string[]>>({})
const loading = ref(false)

async function submit() {
  errors.value = {}
  loading.value = true
  try {
    await login(form.email, form.password)
  }
  catch (e: any) {
    if (e?.data?.errors) {
      errors.value = e.data.errors
    }
    else {
      errors.value = { email: ['Login failed. Please try again.'] }
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 80px auto; font-family: system-ui, sans-serif;">
    <h1>Login</h1>
    <form @submit.prevent="submit" style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required style="width: 100%; padding: 0.5rem; box-sizing: border-box;">
        <small v-if="errors.email" style="color: red;">{{ errors.email[0] }}</small>
      </div>
      <div>
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" required style="width: 100%; padding: 0.5rem; box-sizing: border-box;">
        <small v-if="errors.password" style="color: red;">{{ errors.password[0] }}</small>
      </div>
      <button type="submit" :disabled="loading" style="padding: 0.75rem; background: #000; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p style="margin-top: 1rem; text-align: center;">
      Don't have an account? <NuxtLink to="/register">Register</NuxtLink>
    </p>
  </div>
</template>
