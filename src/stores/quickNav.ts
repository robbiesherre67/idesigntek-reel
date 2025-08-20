import { reactive } from 'vue'

export const quickNav = reactive({ open: false, query: '' })

export function openQuickNav() {
  quickNav.open = true
  requestAnimationFrame(() => document.getElementById('quicknav-input')?.focus())
}
export function closeQuickNav() {
  quickNav.open = false
  quickNav.query = ''
}