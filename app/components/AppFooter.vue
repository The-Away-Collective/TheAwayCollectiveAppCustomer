<template>
  <!-- Variant simple: transparent background, metadata only -->
  <footer 
    v-if="variant === 'simple'" 
    class="w-full py-8 px-4 md:px-12 flex flex-col items-center justify-center gap-4 relative z-10 dark:text-neutral-300"
  >
    <div class="w-full max-w-[1280px] flex flex-col md:flex-row justify-between items-center opacity-40">
      <span class="font-detail-mono text-xs uppercase tracking-[0.2em] text-center md:text-left">
        FUNDADO EM 2026 — PRECISÃO INDUSTRIAL
      </span>
      <div class="flex gap-6 mt-4 md:mt-0">
        <NuxtLink to="/politica-de-privacidade" class="font-detail-mono text-xs uppercase tracking-widest cursor-pointer hover:text-primary dark:hover:text-white transition-colors">PRIVACIDADE</NuxtLink>
        <NuxtLink to="/termos-de-servico" class="font-detail-mono text-xs uppercase tracking-widest cursor-pointer hover:text-primary dark:hover:text-white transition-colors">TERMOS</NuxtLink>
      </div>
    </div>
  </footer>

  <!-- Variant full: solid primary background, multi-link -->
  <footer 
    v-else 
    class="w-full py-16 px-4 md:px-12 flex flex-col items-center gap-4 bg-primary dark:bg-neutral-900 border-t border-black/10 dark:border-white/10 mt-auto text-on-primary dark:text-neutral-100 transition-colors"
  >
    <h2 class="font-headline-lg text-headline-lg tracking-tighter uppercase">THE WAY</h2>
    <nav class="flex flex-wrap justify-center gap-6 md:gap-8 mb-4">
      <NuxtLink class="font-detail-mono text-xs text-secondary-fixed-dim dark:text-neutral-400 hover:text-on-primary dark:hover:text-white transition-colors uppercase tracking-widest" to="/politica-de-privacidade">Política de Privacidade</NuxtLink>
      <NuxtLink class="font-detail-mono text-xs text-secondary-fixed-dim dark:text-neutral-400 hover:text-on-primary dark:hover:text-white transition-colors uppercase tracking-widest" to="/termos-de-servico">Termos de Serviço</NuxtLink>
      <!-- <a class="font-detail-mono text-xs text-secondary-fixed-dim dark:text-neutral-400 hover:text-on-primary dark:hover:text-white transition-colors uppercase tracking-widest" href="#">Regras do Estúdio</a>
      <a class="font-detail-mono text-xs text-secondary-fixed-dim dark:text-neutral-400 hover:text-on-primary dark:hover:text-white transition-colors uppercase tracking-widest" href="#">Contato</a> -->
    </nav>
    <p class="font-detail-mono text-[10px] text-secondary-fixed-dim dark:text-neutral-500 uppercase tracking-[0.2em] mt-4 opacity-60 text-center">
      © 2026 THE WAY COLLECTIVE. PRECISÃO INDUSTRIAL.
    </p>
  </footer>
</template>

<script setup lang="ts">
defineProps({
  variant: {
    type: String,
    default: 'full',
    validator: (val: string) => ['full', 'simple'].includes(val)
  }
})
</script>
