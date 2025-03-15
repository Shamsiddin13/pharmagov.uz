<script setup>
import { ref } from 'vue'
import ProductList from '../components/products/ProductList.vue'
import SidebarForm from '../components/common/SidebarForm.vue'
import AddProductForm from '../components/products/forms/AddProductForm.vue'
import Button from '../components/common/Button.vue'
import { Teleport } from 'vue'

const showAddForm = ref(false)
const productListRef = ref(null)

const handleProductAdded = () => {
  showAddForm.value = false
  // Refresh the product list
  if (productListRef.value) {
    productListRef.value.loadProducts()
  }
}
</script>

<template>
  <div>
    <div class="space-y-6">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Products</h1>
          <Button @click="showAddForm = true">Add Product</Button>
        </div>
      </div>

      <ProductList ref="productListRef" />
    </div>

    <!-- Add Product Sidebar -->
    <Teleport to="body">
      <SidebarForm 
        v-if="showAddForm" 
        :is-open="showAddForm" 
        width="600px"
        @close="showAddForm = false"
      >
        <template #title>Add New Product</template>
        <AddProductForm
          :categories="productListRef?.categories || []"
          :stores="productListRef?.stores || []"
          @close="showAddForm = false"
          @product-added="handleProductAdded"
        />
      </SidebarForm>
    </Teleport>
  </div>
</template>