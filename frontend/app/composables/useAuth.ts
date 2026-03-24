const user = ref<Record<string, any> | null>(null)
const initialized = ref(false)

function getXsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match?.[1] ? decodeURIComponent(match[1]) : ''
}

async function csrfCookie(): Promise<void> {
  await $fetch('/sanctum/csrf-cookie', {
    credentials: 'include',
  })
}

async function apiFetch<T>(url: string, options: Record<string, any> = {}): Promise<T> {
  return $fetch<T>(url, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-XSRF-TOKEN': getXsrfToken(),
      ...options.headers,
    },
  })
}

export function useAuth() {
  async function login(email: string, password: string): Promise<void> {
    await csrfCookie()
    const data = await apiFetch<Record<string, any>>('/api/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data
    await navigateTo('/dashboard')
  }

  async function register(fields: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<void> {
    await csrfCookie()
    const data = await apiFetch<Record<string, any>>('/api/register', {
      method: 'POST',
      body: fields,
    })
    user.value = data
    await navigateTo('/dashboard')
  }

  async function logout(): Promise<void> {
    await apiFetch('/api/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  async function fetchUser(): Promise<void> {
    try {
      user.value = await apiFetch<Record<string, any>>('/api/user')
    }
    catch {
      user.value = null
    }
  }

  async function initAuth(): Promise<void> {
    if (initialized.value) return
    await fetchUser()
    initialized.value = true
  }

  return {
    user: readonly(user),
    initialized: readonly(initialized),
    login,
    register,
    logout,
    fetchUser,
    initAuth,
  }
}
