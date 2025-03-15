<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isSidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:isSidebarOpen'])
const route = useRoute()
const isActive = computed(() => route.path === props.item.route)

const handleClick = () => {
  if (window.innerWidth < 768) { // md breakpoint
    emit('update:isSidebarOpen', false)
  }
}
</script>

<template>
  <li>
    <router-link
      :to="item.route"
      @click="handleClick"
      class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200"
      :class="[
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        !isSidebarOpen && 'justify-center'
      ]"
    >
      <svg 
        class="w-6 h-6"
        :class="{ 'mr-3': isSidebarOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
      </svg>
      <transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <span v-if="isSidebarOpen" class="font-medium">{{ item.name }}</span>
      </transition>
    </router-link>
  </li>
</template>