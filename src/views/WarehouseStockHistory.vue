<template>
  <div class="w-full max-w-[2000px] mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Ombor tarixi</h1>
    </div>

    <div class="space-y-6">
      <WarehouseStockFilter
        @filter="handleFilter"
      />

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div v-if="loading" class="p-4 flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        <div v-else>
          <WarehouseStockTable 
            :items="items" 
            @sort="handleSort"
          />
          
          <!-- Pagination -->
          <Pagination
            :meta="meta"
            @page-change="handlePageChange"
            @per-page-change="handlePerPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import WarehouseStockFilter from '../components/warehouse/WarehouseStockFilter.vue'
import WarehouseStockTable from '../components/warehouse/WarehouseStockTable.vue'
import Pagination from '../components/common/Pagination.vue'
import { fetchWarehouseHistory } from '../services/warehouse'

const router = useRouter()
const route = useRoute()

const items = ref([])
const loading = ref(false)
const meta = ref({
  total: 0,
  per_page: 20,
  current_page: 1,
  last_page: 1
})

// Initialize state from URL query parameters
const initFilters = () => {
  const query = route.query
  return {
    search: query.search || '',
    sku: query.sku || '',
    article: query.article || '',
    store: query.store || '',
    fromDate: query.from_date || '',
    toDate: query.to_date || '',
    sort_by: query.sort_by || 'current_stock',
    sort_order: query.sort_order || 'desc',
    page: parseInt(query.page) || 1,
    perPage: parseInt(query.per_page) || 20
  }
}

const filters = reactive(initFilters())

// Update URL when filters change
const updateUrl = () => {
  const query = {}
  
  if (filters.search) query.search = filters.search
  if (filters.sku) query.sku = filters.sku
  if (filters.article) query.article = filters.article
  if (filters.store) query.store = filters.store
  if (filters.fromDate) query.from_date = filters.fromDate
  if (filters.toDate) query.to_date = filters.toDate
  if (filters.sort_by && filters.sort_by !== 'current_stock') {
    query.sort_by = filters.sort_by
  }
  if (filters.sort_order && filters.sort_order !== 'desc') {
    query.sort_order = filters.sort_order
  }
  if (filters.page > 1) query.page = filters.page
  if (filters.perPage !== 20) query.per_page = filters.perPage
  
  router.replace({ query })
}

const loadData = async () => {
  try {
    loading.value = true
    const response = await fetchWarehouseHistory(filters.page, {
      search: filters.search,
      sku: filters.sku,
      article: filters.article,
      store: filters.store,
      from_date: filters.fromDate,
      to_date: filters.toDate,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
      per_page: filters.perPage
    })
    
    items.value = response.data
    meta.value = response.meta
    updateUrl()
  } catch (error) {
    console.error('Error loading warehouse history:', error)
    items.value = []
  } finally {
    loading.value = false
  }
}

const handleFilter = (newFilters) => {
  // Reset page when filters change
  filters.page = 1
  
  // Preserve sort settings while updating other filters
  const { sort_by, sort_order } = filters
  Object.assign(filters, newFilters, { sort_by, sort_order })
  
  loadData()
}

const handleSort = ({ sortBy, sortOrder }) => {
  filters.sort_by = sortBy
  filters.sort_order = sortOrder
  loadData()
}

const handlePageChange = (page) => {
  filters.page = page
  loadData()
}

const handlePerPageChange = (perPage) => {
  filters.perPage = perPage
  filters.page = 1 // Reset to first page when changing items per page
  loadData()
}

onMounted(() => {
  loadData()
})
</script>
