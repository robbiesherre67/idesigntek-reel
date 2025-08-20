<template>
    <!-- Scales via parent class (e.g., w-9 h-9). No external deps. -->
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      class="block"
    >
      <defs>
        <!-- Bright blue gradient -->
        <linearGradient id="gearGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stop-color="#7dd3fc"/>  <!-- sky-300 -->
          <stop offset="50%" stop-color="#22d3ee"/>  <!-- cyan-400 -->
          <stop offset="100%" stop-color="#a5b4fc"/> <!-- indigo-300 -->
        </linearGradient>
  
        <!-- Soft inner glow -->
        <radialGradient id="gearGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%"  stop-color="white" stop-opacity=".25"/>
          <stop offset="60%" stop-color="white" stop-opacity=".0"/>
        </radialGradient>
      </defs>
  
      <!-- Subtle outer glow -->
      <g opacity="0.9" filter="url(#shadow)">
        <!-- Teeth (8) -->
        <g fill="url(#gearGradient)">
          <rect x="30" y="2"  width="4" height="12" rx="1" transform="rotate(0 32 32)"/>
          <rect x="30" y="2"  width="4" height="12" rx="1" transform="rotate(45 32 32)"/>
          <rect x="30" y="2"  width="4" height="12" rx="1" transform="rotate(90 32 32)"/>
          <rect x="30" y="2"  width="4" height="12" rx="1" transform="rotate(135 32 32)"/>
          <rect x="30" y="2"  width="4" height="12" rx="1" transform="rotate(180 32 32)"/>
          <rect x="30" y="2"  width="4" height="12" rx="1" transform="rotate(225 32 32)"/>
          <rect x="30" y="2"  width="4" height="12" rx="1" transform="rotate(270 32 32)"/>
          <rect x="30" y="2"  width="4" height="12" rx="1" transform="rotate(315 32 32)"/>
        </g>
  
        <!-- Body -->
        <circle cx="32" cy="32" r="20" fill="url(#gearGradient)"/>
        <!-- Inner detail ring -->
        <circle cx="32" cy="32" r="14" fill="none" stroke="white" stroke-opacity=".25" stroke-width="2"/>
  
        <!-- Bore (punched out look) -->
        <circle cx="32" cy="32" r="6" fill="#0b0b0c"/>
        <!-- Shine -->
        <circle cx="28" cy="24" r="16" fill="url(#gearGlow)" />
      </g>
  
      <!-- Drop shadow filter -->
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#38bdf8" flood-opacity=".35"/>
      </filter>
    </svg>
  </template>
  