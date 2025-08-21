<template>
  <header class="sticky top-0 z-[1000] bg-black/70 backdrop-blur border-b border-white/10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[1fr_auto_1fr] items-center">
      <!-- Brand (bigger gear + wordmark) -->
      <RouterLink to="/" class="flex items-center gap-2 group" aria-label="iDesignTEK Home">
        <svg
          class="h-9 w-9 md:h-10 md:w-10 text-sky-400 drop-shadow-[0_0_14px_rgba(56,189,248,0.35)] transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 15a7.5 7.5 0 0 0 .2-1l2-.9-1.3-3.2-2.1.1a7.9 7.9 0 0 0-.7-.8l.6-2-3-1.5-1.4 1.5c-.3 0-.7-.1-1-.1s-.7 0-1 .1L9 3.7 6 5.2l.6 2c-.3.2-.5.5-.8.8l-2.1-.1L2.4 11l2 .9a8.6 8.6 0 0 0 0 2l-2 .9 1.3 3.2 2.1-.1c.2.3.5.6.8.8l-.6 2L9 20.3l1.4-1.5c.3 0 .7.1 1 .1s.7 0 1-.1l1.4 1.5 3-1.5-.6-2c.3-.2.5-.5.8-.8l2.1.1 1.3-3.2-2-.9c0-.3-.1-.7-.2-1Z" />
        </svg>
        <span
          class="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent
                 drop-shadow-[0_2px_12px_rgba(56,189,248,0.28)] tracking-tight">
          iDesignTEK
        </span>
      </RouterLink>

      <!-- CENTERED NAV in bordered box -->
      <div class="justify-self-center">
        <nav class="hidden md:flex items-center gap-6 px-4 py-1.5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm shadow-sm">
          <RouterLink :to="'/'"        :class="navLinkClass('/')">Home</RouterLink>
          <RouterLink :to="'/work'"    :class="navLinkClass('/work')">Work</RouterLink>
          <RouterLink :to="'/contact'" :class="navLinkClass('/contact')">Contact</RouterLink>
        </nav>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden inline-flex items-center justify-center rounded-xl p-2 border border-white/15 hover:bg-white/10 transition"
          :aria-expanded="open ? 'true' : 'false'"
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
          @click="toggle"
        >
          <span class="sr-only">Menu</span>
          <span class="relative block w-6 h-4">
            <span :class="bar(1)"></span>
            <span :class="bar(2)"></span>
            <span :class="bar(3)"></span>
          </span>
        </button>
      </div>

      <!-- spacer -->
      <div />
    </div>

    <!-- Mobile dropdown -->
    <transition name="slide">
      <nav v-if="open" id="mobile-menu" class="md:hidden border-t border-white/10 bg-black/80 backdrop-blur">
        <ul class="px-4 py-3 flex flex-col gap-1">
          <li><RouterLink :to="'/'"        class="mobile-link" @click="close">Home</RouterLink></li>
          <li><RouterLink :to="'/work'"    class="mobile-link" @click="close">Work</RouterLink></li>
          <li><RouterLink :to="'/contact'" class="mobile-link" @click="close">Contact</RouterLink></li>
        </ul>
      </nav>
    </transition>

    <!-- Sound toggle: show ONLY on Home route -->
    <button
      v-if="route.path === '/'"
      class="fixed right-4 top-[calc(4rem+8px)] md:right-6 z-[900] rounded-full border border-white/15 bg-white/10 backdrop-blur px-4 py-2 text-sm hover:bg-white/20 transition"
      :aria-pressed="soundOn ? 'true' : 'false'"
      @click="emitToggleSound"
    >
      {{ soundOn ? '🔊 Sound off' : '🔈 Sound on' }}
    </button>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)
const soundOn = ref(false)

function toggle(){ open.value = !open.value }
function close(){ open.value = false }

function bar(n:number){
  return [
    "absolute left-0 right-0 h-0.5 bg-white rounded-full transition-transform duration-200",
    n===1 ? (open.value ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0") : "",
    n===2 ? (open.value ? "opacity-0 top-1/2 -translate-y-1/2" : "top-1/2 -translate-y-1/2") : "",
    n===3 ? (open.value ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0") : "",
  ].join(" ")
}

/* Active link underline that persists on current route */
function navLinkClass(path: string){
  const active = route.path === path
  return [
    "relative text-sm font-medium text-white/90 hover:text-white transition",
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full",
    "after:origin-left after:scale-x-0 hover:after:scale-x-100",
    "after:rounded after:bg-gradient-to-r after:from-sky-400 after:to-blue-400",
    "after:transition-transform after:duration-300",
    active ? "after:scale-x-100 text-white" : ""
  ].join(" ")
}

/* Body lock for mobile menu */
const lock = () => document.body.classList.add('overflow-hidden')
const unlock = () => document.body.classList.remove('overflow-hidden')
watch(open, v => v ? lock() : unlock())

/* ESC to close */
const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onEsc))
onBeforeUnmount(() => window.removeEventListener('keydown', onEsc))

/* Emit sound toggle event that HomeView listens to */
function emitToggleSound(){
  window.dispatchEvent(new CustomEvent('toggle-sound'))
  soundOn.value = !soundOn.value
}
</script>

<style scoped>
.mobile-link { display:block; padding:.5rem .5rem; border-radius:.5rem; }
.mobile-link.router-link-active {
  background: linear-gradient(to right, rgba(56,189,248,.18), rgba(37,99,235,.18));
}
/* Fallback if Tailwind md: isn't applied */
@media (max-width: 767.98px) {
  .md\:flex { display: none !important; }
}
/* Mobile menu slide transition */
.slide-enter-from, .slide-leave-to { transform: translateY(-8px); opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 180ms ease; }
</style>