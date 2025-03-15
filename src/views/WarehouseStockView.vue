<template>
  <div class="w-full max-w-[2000px] mx-auto px-4 py-6">
    <!-- Filters -->
    <WarehouseFilter @filter="handleFilter" />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900 p-4 rounded-md">
      <div class="text-red-700 dark:text-red-200">{{ error }}</div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Warehouse Stock</h1>
      </div>

      <!-- Stock Table -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Article
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  SKU
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  In
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Out
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in items" :key="item.sku" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img 
                        :src="item.image" 
                        class="h-10 w-10 rounded-full object-cover" 
                        :alt="item.product_name"
                        @error="handleImageError"
                      >
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ item.product_name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.article }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.sku }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.in }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.out }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="getStockClass(item.stock)">
                  {{ item.stock }}
                </td>
              </tr>
              <!-- Empty State -->
              <tr v-if="items.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No items found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="!loading"
        :meta="{
          current_page: pagination.current_page,
          last_page: pagination.last_page,
          per_page: pagination.per_page,
          this_page: items.length,
          filtered_total: pagination.total
        }"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Pagination from '../components/common/Pagination.vue'
import WarehouseFilter from '../components/warehouse/WarehouseFilter.vue'
import { fetchWarehouseStock } from '../services/warehouse'

const items = ref([])
const loading = ref(false)
const error = ref(null)

const filters = ref({
  search: '',
  article: '',
  sku: ''
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0
})

async function fetchStockData() {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetchWarehouseStock(pagination.value.current_page, {
      ...filters.value,
      per_page: pagination.value.per_page
    })
    
    items.value = response.data
    pagination.value = response.meta
  } catch (e) {
    error.value = 'Error loading warehouse stock data'
    console.error('Error:', e)
  } finally {
    loading.value = false
  }
}

function handleFilter(newFilters) {
  // Reset pagination when filters change
  pagination.value.current_page = 1
  filters.value = { ...newFilters }
  fetchStockData()
}

function handlePerPageChange(perPage) {
  pagination.value.per_page = perPage
  pagination.value.current_page = 1
  fetchStockData()
}

function handlePageChange(page) {
  pagination.value.current_page = page
  fetchStockData()
}

function getStockClass(stock) {
  if (stock <= 0) return 'text-red-600 dark:text-red-400'
  if (stock <= 10) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

function handleImageError(event) {
  event.target.src = '/placeholder-image.png'
}

onMounted(() => {
  fetchStockData()
})
</script>
