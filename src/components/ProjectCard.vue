<template>
  <article class="flex-none w-[320px] sm:w-[360px]">
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <img
        :src="img"
        :alt="title"
        class="block w-full aspect-[16/10] object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
    <h3 class="mt-3 text-base font-semibold">{{ title }}</h3>
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
