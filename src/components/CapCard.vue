<template>
    <div class="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/10">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p class="text-white/70 mt-2">{{ desc }}</p>
      <div class="mt-4 opacity-0 group-hover:opacity-100 transition">→</div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ title: string; desc: string }>()
  </script>  