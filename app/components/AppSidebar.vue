<template>
  <div>
    <!-- Backdrop for mobile -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/20 dark:bg-black/60 z-30 md:hidden"
      @click="$emit('close')"
    ></div>

    <aside 
      class="fixed left-0 top-0 h-full w-64 flex flex-col z-40 bg-surface dark:bg-neutral-950 border-r border-black/10 dark:border-white/10 transition-all duration-300"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <!-- Title -->
      <div class="px-6 h-20 flex items-center border-b border-black/10 dark:border-white/10 justify-between">
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary dark:text-white tracking-tighter uppercase">
          THE WAY
        </h1>
        <button class="md:hidden text-primary dark:text-white focus:outline-none" @click="$emit('close')">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Access Status -->
      <div class="p-6 flex items-center gap-3 border-b border-black/10 dark:border-white/10">
        <div class="w-10 h-10 bg-primary dark:bg-white flex items-center justify-center">
          <span class="material-symbols-outlined text-white dark:text-neutral-950" style="font-variation-settings: 'FILL' 1;">account_circle</span>
        </div>
        <div>
          <p class="font-label-caps text-label-caps uppercase text-xs leading-none mb-1 dark:text-white">ACESSO AO ESTÚDIO</p>
          <p class="font-detail-mono text-[10px] text-on-surface-variant dark:text-neutral-400 uppercase leading-none">Membro Verificado</p>
        </div>
      </div>

      <!-- Menu Navigation -->
      <nav class="flex-1 py-6 overflow-y-auto">
        <div class="px-4 mb-4">
          <p class="font-detail-mono text-[10px] text-on-surface-variant dark:text-neutral-400 uppercase mb-2 px-4 opacity-50">Menu Principal</p>
          <ul class="space-y-1">
            <li>
              <NuxtLink 
                to="/agendamentos" 
                class="flex items-center gap-3 px-4 py-3 transition-colors font-detail-mono text-detail-mono uppercase"
                :class="route.path === '/agendamentos' ? 'bg-primary text-on-primary dark:bg-white dark:text-neutral-950 font-bold' : 'text-on-surface-variant dark:text-neutral-400 hover:bg-secondary-container dark:hover:bg-neutral-800 dark:hover:text-white'"
                @click="$emit('close')"
              >
                <span class="material-symbols-outlined">grid_view</span>
                <span>Agendamentos</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/perfil" 
                class="flex items-center gap-3 px-4 py-3 transition-colors font-detail-mono text-detail-mono uppercase"
                :class="route.path === '/perfil' ? 'bg-primary text-on-primary dark:bg-white dark:text-neutral-950 font-bold' : 'text-on-surface-variant dark:text-neutral-400 hover:bg-secondary-container dark:hover:bg-neutral-800 dark:hover:text-white'"
                @click="$emit('close')"
              >
                <span class="material-symbols-outlined">settings</span>
                <span>Configurações</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Footer Menu -->
      <div class="p-4 border-t border-black/10 dark:border-white/10">
        <ul class="space-y-1">
          <!-- <li>
            <a 
              href="#" 
              class="flex items-center gap-3 text-on-surface-variant hover:bg-secondary-container px-4 py-3 transition-colors font-detail-mono text-detail-mono uppercase"
            >
              <span class="material-symbols-outlined">help_outline</span>
              <span>Suporte</span>
            </a>
          </li> -->
          <li>
            <button 
              @click="handleLogout" 
              class="w-full text-left flex items-center gap-3 text-on-surface-variant dark:text-neutral-400 hover:bg-secondary-container dark:hover:bg-neutral-800 dark:hover:text-white px-4 py-3 transition-colors font-detail-mono text-detail-mono uppercase focus:outline-none"
            >
              <span class="material-symbols-outlined">logout</span>
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { removeAuthToken } from '~/composables/api'

const route = useRoute()

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const handleLogout = async () => {

  await useApi<any>('/logout', 'POST', {})

  await removeAuthToken()
  navigateTo('/login')
}
</script>
