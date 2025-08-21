<template>
  <div id="layout" class="min-h-screen text-mist">
    <!-- Use the responsive header -->
    <AppHeader />

    <!-- Page content -->
    <RouterView v-slot="{ Component }">
      <Transition name="route" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <!-- Extras -->
    <QuickPalette />
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'   // ← new
// remove SiteNav import
import QuickPalette from './components/QuickPalette.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<style>
.route-enter-from, .route-leave-to { opacity: 0; transform: translateY(8px); }
.route-enter-active, .route-leave-active { transition: all .45s cubic-bezier(.22,.61,.36,1); }
</style>