<template>
  <div class="space-y-2 w-full">
    <label 
      v-if="label" 
      class="font-detail-mono text-[12px] uppercase block text-primary dark:text-neutral-200 transition-opacity duration-200"
      :class="isFocused ? 'opacity-100 font-bold' : 'opacity-60'"
    >
      {{ label }}
    </label>
    
    <!-- Textarea type (PrimeVue Textarea) -->
    <Textarea
      v-if="type === 'textarea'"
      :modelValue="modelValue !== null && modelValue !== undefined ? String(modelValue) : ''"
      :placeholder="placeholder"
      :rows="rows"
      :maxlength="maxlength"
      autoResize
      class="w-full bg-white dark:bg-neutral-900 dark:text-neutral-100 border border-black/10 dark:border-white/15 p-4 font-body-md focus:border-black dark:focus:border-white dark:placeholder:text-neutral-500 transition-all resize-none rounded-none"
      @update:modelValue="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <!-- Select type (PrimeVue Select) -->
    <Select
      v-else-if="type === 'select'"
      :modelValue="modelValue"
      :options="options"
      class="w-full h-12 bg-white dark:bg-neutral-900 dark:text-neutral-100 border border-black/10 dark:border-white/15 px-4 font-body-md focus:border-black dark:focus:border-white transition-all rounded-none flex items-center justify-between cursor-pointer"
      :pt="{
        root: 'w-full h-12 bg-white dark:bg-neutral-900 dark:text-neutral-100 border border-black/10 dark:border-white/15 px-4 font-body-md focus:border-black dark:focus:border-white transition-all rounded-none flex items-center justify-between',
        label: 'text-left flex-1 font-body-md uppercase',
        trigger: 'flex items-center justify-center text-primary dark:text-white',
        panel: 'bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/15 rounded-none shadow-none font-body-md mt-1 z-50',
        item: 'px-4 py-2 hover:bg-primary hover:text-on-primary dark:text-neutral-100 dark:hover:bg-white dark:hover:text-neutral-950 cursor-pointer uppercase font-detail-mono text-xs'
      }"
      @update:modelValue="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <!-- Generic Input types (PrimeVue InputText) -->
    <InputText
      v-else
      :type="type"
      :modelValue="modelValue !== null && modelValue !== undefined ? String(modelValue) : ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      class="w-full border border-primary dark:border-white/30 bg-white dark:bg-neutral-900 dark:text-neutral-100 px-4 py-3 font-detail-mono text-body-md placeholder:opacity-30 dark:placeholder:text-neutral-500 focus:ring-0 transition-all rounded-none"
      :class="disabled ? 'opacity-50 cursor-not-allowed' : ''"
      @update:modelValue="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  rows: {
    type: Number,
    default: 4
  },
  options: {
    type: Array as () => string[],
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: [Number, String],
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue'])

const isFocused = ref(false)

const onInput = (value: any) => {
  emit('update:modelValue', value)
}
</script>
