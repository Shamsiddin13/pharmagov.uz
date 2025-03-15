<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Ombor kirdi / chiqdi malumotlari</h1>
        <StorageActionButtons />
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <StorageFilter @filter="handleFilter" />
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-else-if="error" class="p-6 text-red-600 dark:text-red-400">
        {{ error }}
      </div>

      <template v-else>
        <StorageTable :items="items" />
        <Pagination 
          :meta="meta"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import StorageActionButtons from '../components/storage/StorageActionButtons.vue'
import StorageFilter from '../components/storage/StorageFilter.vue'
import StorageTable from '../components/storage/StorageTable.vue'
import Pagination from '../components/common/Pagination.vue'
import { useStorageData } from '../composables/useStorageData'

const {
  items,
  meta,
  loading,
  error,
  handleFilter,
  handlePageChange,
  handlePerPageChange,
  loadItems
} = useStorageData()

onMounted(loadItems)
</script>