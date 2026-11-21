<template>
  <Button
    :type="type"
    :loading="loading"
    class="w-full font-bold py-5 px-6 font-label-caps text-label-caps uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] rounded-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    :class="
      variant === 'secondary'
        ? 'border border-primary dark:border-white/40 bg-white dark:bg-neutral-900 text-primary dark:text-white hover:bg-secondary-container dark:hover:bg-neutral-800'
        : 'bg-primary dark:bg-white text-on-primary dark:text-neutral-950 hover:bg-secondary dark:hover:bg-neutral-200'
    "
  >
    <template v-if="!loading">
      <slot></slot>
    </template>
    <span v-else>VALIDANDO...</span>
    <span 
      v-if="icon && !loading" 
      class="material-symbols-outlined text-sm"
    >
      {{ icon }}
    </span>
  </Button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  variant: {
    type: String as () => 'primary' | 'secondary',
    default: 'primary'
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>
