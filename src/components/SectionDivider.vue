<template>
    <div :class="['relative flex items-center', $attrs.class]">
      <div class="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
      <div class="absolute left-1/2 -translate-x-1/2">
        <div class="w-2.5 h-2.5 rounded-full bg-sky-300/35 ring-1 ring-sky-200/30"></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // no props needed; accepts class from parent for spacing
  </script>  