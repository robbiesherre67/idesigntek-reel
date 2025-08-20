<template>
  <main class="mx-auto max-w-7xl px-6 py-24">
    <!-- Header with GitHub mark -->
    <header class="flex items-center gap-3 mb-10">
      <div class="shrink-0 p-2 rounded-xl bg-white/5 ring-1 ring-white/10">
        <IconGitHub class="size-6 text-sky-300" />
      </div>
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Work & Repos</h1>
        <p class="text-white/60 text-sm">Code I’ve shipped • Selected GitHub repositories • Live demos</p>
      </div>
      <a
        href="https://github.com/robbiesherre67"
        target="_blank"
        rel="noopener"
        class="ml-auto inline-flex items-center gap-2 text-sky-300/90 hover:text-sky-300 transition"
      >
        <IconGitHub class="size-5" />
        <span class="text-sm font-medium">GitHub Profile</span>
      </a>
    </header>

    <!-- Repositories -->
    <section class="mb-14">
      <h2 class="text-sm uppercase tracking-[.2em] text-white/50 mb-4">Repositories</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <RepoPill
          v-for="(r, i) in repos"
          :key="r.href"
          v-bind="r"
          :roundedSide="i % 2 === 0 ? 'left' : 'right'"
        >
          <template #icon>
            <IconGitHub class="size-4 text-sky-300/90" />
          </template>
        </RepoPill>
      </div>
    </section>

    <!-- Live URLs -->
    <section>
      <h2 class="text-sm uppercase tracking-[.2em] text-white/50 mb-4">Live URLs / Demos</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <RepoPill
          v-for="(l, i) in links"
          :key="l.href"
          v-bind="l"
          :roundedSide="i % 2 === 0 ? 'right' : 'left'"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import RepoPill from '@/components/RepoPill.vue'
import IconGitHub from '@/components/icons/IconGitHub.vue'

type Item = { label: string; href: string; meta?: string }

const repos: Item[] = [
  {
    label: 'taskflow — Vue 3 + Pinia + DnD',
    href: 'https://github.com/robbiesherre67/taskflow',
    meta: 'drag-and-drop • dark mode',
  },
  {
    label: 'react-secure — SPA auth starter',
    href: 'https://github.com/robbiesherre67/react-secure',
    meta: 'JWT • testing • routing',
  },
  {
    label: 'portfolio-vite — this site',
    href: 'https://github.com/robbiesherre67/portfolio-vite',
    meta: 'GSAP • Tailwind • Vite',
  },
]

const links: Item[] = [
  {
    label: 'iDesignTEK — Portfolio',
    href: 'https://idesigntek.com/portfolio/',
    meta: 'live deployment',
  },
  {
    label: 'WordPress + Next.js case',
    href: 'https://www.cityofpasadena.net/',
    meta: 'headless CMS',
  },
  {
    label: 'VUE 3 TaskFlow demo',
    href: 'https://idesigntek.com/vue-taskflow/',
    meta: 'VUE 3, Interactive demo',
  },
]
</script>