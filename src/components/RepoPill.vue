<template>
    <a
      :href="href"
      target="_blank"
      rel="noopener"
      class="group focus:outline-none"
    >
      <span
        :class="[
          'relative flex items-center gap-2 h-11 px-4 select-none',
          'text-[13px] font-medium text-white/90',
          'bg-gradient-to-r from-sky-500/15 via-sky-500/5 to-zinc-400/10',
          'ring-1 ring-white/10 hover:ring-white/20',
          'backdrop-blur-sm transition',
          roundedSide === 'left'
            ? 'rounded-l-full rounded-r-none pr-5'
            : 'rounded-r-full rounded-l-none pl-5'
        ]"
      >
        <!-- left icon slot (optional) -->
        <slot name="icon" />
  
        <span class="truncate">{{ label }}</span>
  
        <span v-if="meta" class="ml-2 truncate text-white/50">
          • {{ meta }}
        </span>
  
        <!-- arrow -->
        <svg
          class="ml-auto size-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
        >
          <path d="M7 17L17 7M17 7H9M17 7v8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
  
        <!-- glossy edge on rounded side -->
        <span
          :class="[
            'pointer-events-none absolute top-0 bottom-0 w-10',
            'bg-gradient-to-r from-white/6 to-transparent',
            roundedSide === 'left' ? 'left-0 rounded-l-full' : 'right-0 rotate-180 rounded-r-full'
          ]"
        />
      </span>
    </a>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    label: string
    href: string
    meta?: string
    /** which side is rounded: 'left' | 'right' */
    roundedSide?: 'left' | 'right'
  }>()
  </script>  