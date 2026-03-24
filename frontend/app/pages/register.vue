<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const errors = ref<Record<string, string[]>>({})
const loading = ref(false)

async function submit() {
  errors.value = {}
  loading.value = true
  try {
    await register(form)
  }
  catch (e: any) {
    if (e?.data?.errors) {
      errors.value = e.data.errors
    }
    else {
      errors.value = { email: ['Registration failed. Please try again.'] }
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 80px auto; font-family: system-ui, sans-serif;">
    <h1>Register</h1>
    <form @submit.prevent="submit" style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label for="name">Name</label>
        <input id="name" v-model="form.name" type="text" required style="width: 100%; padding: 0.5rem; box-sizing: border-box;">
        <small v-if="errors.name" style="color: red;">{{ errors.name[0] }}</small>
      </div>
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
      <div>
        <label for="password_confirmation">Confirm Password</label>
        <input id="password_confirmation" v-model="form.password_confirmation" type="password" required style="width: 100%; padding: 0.5rem; box-sizing: border-box;">
      </div>
      <button type="submit" :disabled="loading" style="padding: 0.75rem; background: #000; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
        {{ loading ? 'Creating account...' : 'Register' }}
      </button>
    </form>
    <p style="margin-top: 1rem; text-align: center;">
      Already have an account? <NuxtLink to="/login">Login</NuxtLink>
    </p>
  </div>
</template>
