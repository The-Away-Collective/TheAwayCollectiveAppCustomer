<template>
  <div>
    <Toast 
      :pt="{
        root: 'fixed top-4 right-4 z-[9999] w-80 space-y-4 pointer-events-auto',
        message: 'border border-black dark:border-white/30 p-4 bg-white dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex gap-3 items-start transition-all rounded-none relative',
        messageIcon: 'hidden',
        icon: 'hidden',
        messageContent: 'flex gap-3 items-start w-full pr-6',
        container: 'flex gap-3 items-start w-full pr-6',
        content: 'flex gap-3 items-start w-full pr-6',
        text: 'flex flex-col gap-1',
        summary: 'font-detail-mono text-xs uppercase font-bold text-primary dark:text-white',
        detail: 'font-body-md text-xs text-primary/80 dark:text-neutral-300',
        closeButton: 'absolute top-2 right-2 flex items-center justify-center p-1 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors focus:outline-none rounded-none',
        closeIcon: 'material-symbols-outlined text-xs'
      }"
    />
    <ConfirmDialog :pt="{ mask: 'fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center p-4 backdrop-blur-sm' }">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="bg-surface dark:bg-neutral-900 border border-black dark:border-white/30 dark:text-neutral-100 p-8 max-w-md w-full shadow-2xl relative">
          <div class="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-6">
            <div class="flex items-center gap-3">
              <span class="font-detail-mono text-xs border border-error dark:border-red-400 text-error dark:text-red-400 px-2 py-1">CONFIRMAÇÃO</span>
              <h3 class="font-headline-lg-mobile text-headline-lg-mobile uppercase tracking-tight">
                {{ message.header || 'CONFIRMAR AÇÃO' }}
              </h3>
            </div>
            <button 
              type="button" 
              class="material-symbols-outlined text-primary dark:text-white hover:opacity-60 transition-opacity" 
              @click="rejectCallback"
            >
              close
            </button>
          </div>

          <div class="py-2 mb-8">
            <p class="font-body-md text-sm text-primary/80 dark:text-neutral-300 leading-relaxed">
              {{ message.message }}
            </p>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <button 
              type="button"
              class="border border-black dark:border-white/40 px-6 py-2.5 font-label-caps text-xs uppercase tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all bg-white dark:bg-neutral-800 dark:text-white cursor-pointer"
              @click="rejectCallback"
            >
              {{ message.rejectProps?.label || 'VOLTAR' }}
            </button>
            <button 
              type="button"
              class="border border-error bg-error text-on-error px-6 py-2.5 font-label-caps text-xs uppercase tracking-widest hover:bg-error/90 transition-all cursor-pointer font-bold"
              @click="acceptCallback"
            >
              {{ message.acceptProps?.label || 'CONFIRMAR' }}
            </button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { initTheme } = useTheme()
initTheme()
</script>
