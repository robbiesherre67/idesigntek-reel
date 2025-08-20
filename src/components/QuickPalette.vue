<template>
  <Teleport to="body">
    <div v-if="state.open" class="fixed inset-0 z-[999]">
      <!-- backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>

      <!-- panel -->
      <div
        class="absolute left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-xl rounded-2xl border border-white/10 bg-[#0b0b0c]/95 shadow-soft"
        role="dialog" aria-modal="true" aria-label="Quick navigation"
      >
        <!-- input -->
        <div class="p-3 border-b border-white/10">
          <input
            id="quicknav-input"
            v-model="state.query"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="activate"
            @keydown.esc.prevent="close"
            type="text" placeholder="Search: pages, actions, links…"
            class="w-full bg-transparent outline-none text-base placeholder-white/40"
          />
        </div>

        <!-- results -->
        <ul class="max-h-[60vh] overflow-auto py-2">
          <template v-for="(group, gi) in grouped" :key="gi">
            <li class="px-3 py-1 text-xs uppercase tracking-widest text-white/40">{{ group.label }}</li>
            <li v-for="(cmd, i) in group.items" :key="cmd.key">
              <button
                type="button"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 focus:bg-white/5',
                  indexFor(group, i) === selected ? 'bg-white/10' : ''
                ]"
                @mouseenter="selected = indexFor(group, i)"
                @click="cmd.run()"
              >
                <div class="flex items-center justify-between gap-3">
                  <span class="text-sm">{{ cmd.title }}</span>
                  <span v-if="cmd.kbd" class="text-[10px] text-white/40 border border-white/20 rounded px-1 py-0.5">{{ cmd.kbd }}</span>
                </div>
                <p v-if="cmd.note" class="text-xs text-white/50 mt-0.5">{{ cmd.note }}</p>
              </button>
            </li>
          </template>

          <li v-if="flat.length === 0" class="px-3 py-6 text-center text-white/50">
            No matches. Try “work”, “contact”, “github”…
          </li>
        </ul>

        <div class="flex items-center justify-between px-3 py-2 text-xs text-white/40 border-t border-white/10">
          <span>↑/↓ to navigate • Enter to open • Esc to close</span>
          <span><kbd class="border border-white/20 rounded px-1">⌘</kbd>+<kbd class="border border-white/20 rounded px-1">K</kbd></span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { quickNav as state, closeQuickNav as close, openQuickNav as open } from '@/stores/quickNav'

type CommandGroup = 'Navigate' | 'Sections' | 'Contact' | 'Social'
type Command = {
  key: string
  title: string
  group: CommandGroup
  note?: string
  kbd?: string
  run: () => void
}

const router = useRouter()

function goto(path: string) {
  return async () => {
    await router.push(path)
    close()
  }
}
function gotoAndScroll(path: string, hashId: string) {
  return async () => {
    await router.push(path)
    requestAnimationFrame(() => {
      document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    close()
  }
}

/* ---- Commands ---- */
const BASE_COMMANDS: Command[] = [
  // Navigate
  { key: 'home',  title: 'Home', group: 'Navigate', run: goto('/') },
  { key: 'work',  title: 'Work', group: 'Navigate', run: goto('/work') },
  { key: 'contact', title: 'Contact', group: 'Navigate', run: goto('/contact') },

  // Sections (ensure IDs exist)
  { key: 'selwork', title: 'Home → Selected Work', group: 'Sections', note: 'Jump to the case study rail', run: gotoAndScroll('/', 'selected-work') },

  // Social
  { key: 'github',   title: 'GitHub: RobbieSherre67', group: 'Social', run: () => { window.open('https://github.com/robbiesherre67', '_blank', 'noopener'); close() } },
  { key: 'linkedin', title: 'LinkedIn: Robbie-Sherre', group: 'Social', run: () => { window.open('https://www.linkedin.com/in/robbie-sherre', '_blank', 'noopener'); close() } },
]

/* ---- Filtering (no TS generics needed) ---- */
function score(text: string, q: string) {
  const t = text.toLowerCase()
  if (t === q) return 3
  if (t.startsWith(q)) return 2
  if (t.includes(q)) return 1
  return 0
}

const flat = computed(() => {
  const q = state.query.trim().toLowerCase()
  if (!q) return BASE_COMMANDS
  return BASE_COMMANDS
    .map(cmd => ({ cmd, s: score(cmd.title, q) + score(cmd.group, q) + score(cmd.note || '', q) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map(x => x.cmd)
})

const grouped = computed(() => {
  const by = new Map<CommandGroup, Command[]>()
  for (const c of flat.value) {
    if (!by.has(c.group)) by.set(c.group, [])
    by.get(c.group)!.push(c)
  }
  return Array.from(by.entries()).map(([label, items]) => ({ label, items }))
})

/* ---- Keyboard nav & hotkeys ---- */
const selected = ref(0)
function indexFor(group: { items: Command[] }, i: number) {
  let n = 0
  for (const g of grouped.value) {
    if (g === group) return n + i
    n += g.items.length
  }
  return 0
}
function move(delta: number) {
  const n = flat.value.length
  if (!n) return
  selected.value = (selected.value + delta + n) % n
}
function activate() {
  flat.value[selected.value]?.run()
}

function onGlobalKey(e: KeyboardEvent) {
  const metaK = (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))
  if (metaK) {
    e.preventDefault()
    state.open ? close() : open()
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKey))
onUnmounted(() => window.removeEventListener('keydown', onGlobalKey))
</script>