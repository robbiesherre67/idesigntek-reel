<!-- src/components/SiteNav.vue -->
<template>
  <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/20">
    <nav class="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
      <!-- Brand -->
        <RouterLink to="/" aria-label="iDesignTEK — Home" class="flex items-center gap-3 group">
        <LogoGear
        class="w-9 h-9 md:w-10 md:h-10
        drop-shadow-[0_0_14px_rgba(56,189,248,.28)]
        group-hover:drop-shadow-[0_0_24px_rgba(56,189,248,.45)]
        transition-transform duration-300"
        />
        <span
        class="wordmark text-xl md:text-2xl font-extrabold tracking-tight
        bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300
        bg-clip-text text-transparent
        drop-shadow-[0_0_10px_rgba(56,189,248,.25)] leading-none"
        >
        iDesignTEK
        </span>
        </RouterLink>


      <!-- Nav -->
      <div class="relative">
        <ul
          class="relative flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 shadow-soft"
        >
          <li v-for="item in items" :key="item.key">
            <component
              :is="item.external ? 'a' : RouterLink"
              :to="item.external ? undefined : item.to"
              :href="item.external ? item.to : undefined"
              :target="item.external ? '_blank' : undefined"
              rel="noopener"
              class="navlink relative inline-flex items-center px-4 py-2 rounded-full
                     text-sm font-medium text-white/80 hover:text-white focus:outline-none select-none"
            >
              <span class="label px-1">{{ item.label }}</span>
            </component>
          </li>
        </ul>
      </div>

      <!-- Quick Nav -->
      <button
        @click="openPalette"
        class="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        aria-label="Open quick navigation (Command K)"
      >
        <kbd class="px-1 py-0.5 rounded border border-white/20 text-xs">⌘K</kbd>
        Quick Nav
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import LogoGear from '@/components/LogoGear.vue'
import { RouterLink } from 'vue-router'
import { openQuickNav } from '@/stores/quickNav'

type Item = { key: string; label: string; to: string; external?: boolean }

const items: Item[] = [
  { key: 'home', label: 'Home', to: '/' },
  { key: 'work', label: 'Work', to: '/work' },
  { key: 'contact', label: 'Contact', to: '/contact' }
]

function openPalette() {
  openQuickNav()
}
</script>

<style scoped>
/* Animated hover underline (bottom). Works for RouterLink and <a>. */
.navlink .label {
  position: relative;
  display: inline-block;
}
.navlink .label::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;              /* move to -2px for a little breathing room; change to 'top: -2px' for top-underline */
  height: 2px;
  background: #8affc1;       /* accent color */
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform .28s cubic-bezier(.22,.61,.36,1);
}

/* Show underline on hover & focus */
.navlink:hover .label::after,
.navlink:focus-visible .label::after {
  transform: scaleX(1);
}

/* Keep underline visible on active route */
.navlink.router-link-active .label::after,
.navlink.router-link-exact-active .label::after {
  transform: scaleX(1);
}

/* Optional: subtle gradient text on hover (keep if you like) */
.navlink:hover .label {
  background: linear-gradient(90deg, #e7e7ec, #8affc1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
/* subtle “shine” sweep on hover */
.group:hover .wordmark {
  background-position: 100% 0;
}
.wordmark {
  background-size: 200% 100%;
  transition: background-position .8s cubic-bezier(.22,.61,.36,1);
}
</style>