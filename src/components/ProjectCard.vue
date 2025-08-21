<template>
  <article class="flex-none w-full md:w-[360px]">
    <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <!-- aspect is on the wrapper; image fills it -->
      <div class="w-full aspect-[4/3] md:aspect-[16/10]">
        <img
          :src="img"
          :alt="title"
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
    <h3 class="mt-3 text-base font-semibold text-white">{{ title }}</h3>
    <p class="text-white/60 text-sm">{{ tag }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  tag: string
  img: string
}>()
</script>