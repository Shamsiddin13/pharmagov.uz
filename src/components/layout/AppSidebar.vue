<script setup>
import { ref, inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SidebarNavItem from './sidebar/SidebarNavItem.vue'
import { sidebarMenuItems } from '../../config/navigation'
import { useUser } from '../../services/user'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:isOpen'])
const isMobile = inject('isMobile')
const { isCashier } = useUser()

// Filter menu items based on user permissions
const filteredMenuItems = computed(() => {
  return sidebarMenuItems.filter(item => {
    if (item.requiresCashier && !isCashier.value) {
      return false
    }
    return true
  })
})

const toggleSidebar = () => {
  emit('update:isOpen', !props.isOpen)
}
</script>

<template>
  <aside 
    :class="[
      'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-20',
      isOpen ? 'translate-x-0 w-64' : isMobile ? '-translate-x-full w-64' : 'w-20',
    ]"
  >
    <button 
      @click="toggleSidebar"
      class="absolute -right-3 top-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200 hidden md:block"
    >
      <svg 
        :class="['w-4 h-4 transition-transform duration-300', isOpen ? 'rotate-180' : '']"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <nav class="mt-8 px-4">
      <ul class="space-y-2">
        <SidebarNavItem
          v-for="item in filteredMenuItems"
          :key="item.name"
          :item="item"
          :is-sidebar-open="isOpen"
          @update:is-sidebar-open="value => emit('update:isOpen', value)"
        />
      </ul>
    </nav>
  </aside>
</template>