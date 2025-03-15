<template>
  <div class="container mx-auto px-4 py-8">
    <ShipmentsFilter 
      ref="filterComponent"
      @filter="handleFilterChange" 
    />
    <ShipmentTable 
      :filters="currentFilters"
      :preserve-sort="true"
      @sort-change="handleSortChange"
    />
  </div>
</template>

<script>
import ShipmentsFilter from '../components/shipment/ShipmentsFilter.vue'
import ShipmentTable from '../components/shipment/ShipmentTable.vue'

export default {
  name: 'ShipmentsView',
  
  components: {
    ShipmentsFilter,
    ShipmentTable
  },

  data() {
    return {
      currentFilters: {}
    }
  },

  methods: {
    handleFilterChange(filters) {
      this.currentFilters = filters
    },

    handleSortChange(sortState) {
      this.$refs.filterComponent.updateSortState(sortState)
    }
  }
}
</script>
