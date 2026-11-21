<template>
  <header class="w-full border-b border-black/10 dark:border-white/10 sticky top-0 bg-surface dark:bg-neutral-950 transition-colors z-50 h-20 flex items-center">
    <div class="flex justify-between items-center gap-2 w-full px-4 md:px-12 max-w-[1280px] mx-auto">
      <!-- Left: Brand or Breadcrumb -->
      <div class="flex items-center flex-1 min-w-0">
        <button 
          v-if="showMenuButton" 
          class="md:hidden mr-3 sm:mr-4 text-primary dark:text-white focus:outline-none shrink-0" 
          @click="$emit('toggle-sidebar')"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div v-if="breadcrumb" class="flex items-baseline gap-2 sm:gap-4 min-w-0">
          <NuxtLink to="/agendamentos" class="font-headline-lg text-xl sm:text-headline-lg uppercase tracking-tighter leading-none hover:opacity-75 dark:text-white shrink-0">
            INÍCIO
          </NuxtLink>
          <span class="font-headline-lg text-xl sm:text-headline-lg uppercase tracking-tighter leading-none opacity-20 dark:text-white shrink-0">/</span>
          <div class="flex flex-col min-w-0">
            <h2 class="font-headline-lg text-xl sm:text-headline-lg uppercase tracking-tighter leading-none dark:text-white truncate">
              {{ breadcrumb }}
            </h2>
            <p v-if="displayUserId" class="font-detail-mono text-[11px] uppercase tracking-widest opacity-60 dark:text-neutral-400 truncate">
              USUÁRIO: {{ displayUserId }}
            </p>
          </div>
        </div>

        <NuxtLink v-else to="/agendamentos" class="font-headline-lg text-2xl sm:text-headline-lg uppercase tracking-tighter text-primary dark:text-white truncate">
          THE WAY
        </NuxtLink>
      </div>

      <!-- Center: Navigation (If not breadcrumb) -->
      <nav v-if="!breadcrumb" class="hidden md:flex gap-8 mr-8 shrink-0">
        <div class="flex flex-col items-start">
          <NuxtLink to="/agendamentos" class="font-label-caps text-label-caps uppercase tracking-widest text-primary dark:text-white">
            INÍCIO
          </NuxtLink>
          <span v-if="displayUserId" class="font-detail-mono text-[10px] uppercase opacity-50 dark:text-neutral-400">
            {{ displayUserId }}
          </span>
        </div>
      </nav>

      <!-- Right: Actions -->
      <div class="flex items-center gap-3 sm:gap-4 ml-auto shrink-0">
        <button
          type="button"
          class="flex items-center focus:outline-none text-primary dark:text-white cursor-pointer hover:opacity-75 transition-opacity"
          :title="isDark ? 'MODO CLARO' : 'MODO ESCURO'"
          :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
          @click="toggleTheme"
        >
          <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        <NuxtLink to="/perfil" class="flex items-center" title="PERFIL">
          <span class="material-symbols-outlined text-primary dark:text-white cursor-pointer hover:opacity-75">account_circle</span>
        </NuxtLink>
        <button v-if="showLogoutButton" @click="handleLogout" class="flex items-center focus:outline-none" title="SAIR">
          <span class="material-symbols-outlined text-primary dark:text-white cursor-pointer hover:opacity-75">logout</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { removeAuthToken, removeClientId, removeClientName } from '~/composables/api'
import { useTheme } from '~/composables/useTheme'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const showLogoutButton = computed(() => route.path === '/agendamentos' || route.path === '/')

const props = defineProps({
  breadcrumb: {
    type: String,
    default: ''
  },
  showMenuButton: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    default: ''
  }
})

defineEmits(['toggle-sidebar'])

const clientIdCookie = useCookie('client_id')
const clientNameCookie = useCookie('client_name')

const displayUserId = computed(() => {
  if (props.userId) return props.userId
  if (clientNameCookie.value && clientIdCookie.value) {
    return `${clientNameCookie.value} (#${clientIdCookie.value})`
  }
  if (clientIdCookie.value) {
    return `ID #${clientIdCookie.value}`
  }
  return ''
})

const handleLogout = async () => {

  await useApi<any>('/logout', 'POST', {})

  await removeAuthToken()
  await removeClientId()
  await removeClientName()
  navigateTo('/login')
}
</script>
