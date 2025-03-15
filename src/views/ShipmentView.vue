<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../components/common/Button.vue'
import ShipmentTable from '../components/shipment/ShipmentTable.vue'
import ShipmentsFilter from '../components/shipment/ShipmentsFilter.vue'

const router = useRouter()
const loading = ref(false)
const error = ref(null)
const filters = ref({})

const handleFilter = (newFilters) => {
  filters.value = newFilters
  // Here you can implement the logic to fetch filtered data
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Yuborishlar</h1>
        <div class="flex gap-4">
          <Button variant="primary" @click="router.push('/shipment/uzum')">
            Uzum
          </Button>
          <Button variant="primary" @click="router.push({ name: 'create-shipment' })">
            Yaratish
          </Button>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <ShipmentsFilter @filter="handleFilter" />
    </div>

    <!-- Table Section -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <ShipmentTable :filters="filters" />
    </div>
  </div>
</template>