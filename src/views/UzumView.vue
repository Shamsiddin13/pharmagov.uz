<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">UZUMga yuborish</h1>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <form @submit.prevent="fetchShipment" class="space-y-6">
        <!-- Token -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Authorization Token
          </label>
          <input
            type="text"
            v-model="form.token"
            placeholder="Enter your Uzum authorization token"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <!-- SKU Prefix -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Artikul boshidegi Prefix
          </label>
          <input
            type="text"
            v-model="form.skuPrefix"
            placeholder="e.g., MBOOKS-"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
          <p class="mt-1 text-sm text-gray-500">Barcha artikul nomlaridan shu prefix olib tashlanadi</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Shipment Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Yuborish turini tanlang
            </label>
            <select
              v-model="form.shipmentType"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="fba">FBA</option>
              <option value="fbs">FBS</option>
            </select>
          </div>

          <!-- Shop ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Do'kon ID
            </label>
            <input
              type="text"
              v-model="form.shopId"
              placeholder="Enter Shop ID"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <!-- Invoice ID -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nakladnoy raqami
            </label>
            <input
              type="text"
              v-model="form.invoiceId"
              placeholder="Enter Invoice ID"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <Button type="submit" :loading="loading">
            Malumotlarni olish
          </Button>
        </div>
      </form>
    </div>

    <!-- Results -->
    <div v-if="error" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="text-red-600 dark:text-red-400">
        {{ error }}
      </div>
    </div>

    <div v-if="shipmentData" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Olingan malumotlar</h2>
      
      <!-- Products Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uzum mahsulot nomi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tizimdegi nomi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">UZUMdegi SKU</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tizimdegi SKU</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Buyurtma raqami </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Miqdori</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sotuv narxi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Xarid narxi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Holati</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in processedProducts" :key="item.id" :class="{ 'bg-red-50 dark:bg-red-900/20': !item.isValid }">
              <td class="px-6 py-4 whitespace-nowrap text-sm bg-green-50 dark:bg-green-900/20">
                {{ item.originalProductTitle }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ item.productTitle }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm bg-green-50 dark:bg-green-900/20">
                {{ item.originalSku }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div v-if="!item.isValid" class="flex items-center space-x-2">
                  <div v-if="item.isEditing" class="flex items-center space-x-2">
                    <input
                      type="text"
                      v-model="editedSkus[item.id]"
                      @keyup.enter="handleSkuEdit(item)"
                      @keyup.esc="cancelEdit(item)"
                      class="w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-1 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter SKU"
                    />
                    <button
                      @click="handleSkuEdit(item)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      Saqlash
                    </button>
                    <button
                      @click="cancelEdit(item)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <template v-else>
                    <span>{{ item.skuTitle }}</span>
                    <button
                      @click="startEdit(item)"
                      class="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Tahrirlash
                    </button>
                  </template>
                </div>
                <span v-else>{{ item.skuTitle }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="item.isDuplicateOrder ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-900 dark:text-white'">
                {{ item.orderId || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="flex items-center space-x-2">
                  <div v-if="editableQuantity[item.id]" class="flex items-center space-x-2">
                    <input
                      type="number"
                      v-model="editedQuantities[item.id]"
                      @keyup.enter="handleQuantityEdit(item)"
                      @keyup.esc="cancelEditQuantity(item)"
                      class="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-1 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter quantity"
                    />
                    <button
                      @click="handleQuantityEdit(item)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      Saqlash
                    </button>
                    <button
                      @click="cancelEditQuantity(item)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <template v-else>
                    <span>{{ item.quantityToStock }}</span>
                    <button
                      @click="startEditQuantity(item)"
                      class="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Tahrirlash
                    </button>
                  </template>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="flex items-center space-x-2">
                  <div v-if="editablePrice[item.id]" class="flex items-center space-x-2">
                    <input
                      type="number"
                      v-model="editedPrices[item.id]"
                      @keyup.enter="handlePriceEdit(item)"
                      @keyup.esc="cancelEditPrice(item)"
                      class="w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-1 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter price"
                    />
                    <button
                      @click="handlePriceEdit(item)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      Saqlash
                    </button>
                    <button
                      @click="cancelEditPrice(item)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <template v-else>
                    <span>{{ item.price ? new Intl.NumberFormat('ru-RU').format(item.price) : '-' }}</span>
                    <button
                      @click="startEditPrice(item)"
                      class="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Tahrirlash
                    </button>
                  </template>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div v-if="item.isValid" class="flex items-center space-x-2">
                  <div v-if="editableBuyPrice[item.id]" class="flex items-center space-x-2">
                    <input
                      type="number"
                      v-model="editedBuyPrices[item.id]"
                      @keyup.enter="handleBuyPriceEdit(item)"
                      @keyup.esc="cancelEditBuyPrice(item)"
                      class="w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-1 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter price"
                    />
                    <button
                      @click="handleBuyPriceEdit(item)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      Saqlash
                    </button>
                    <button
                      @click="cancelEditBuyPrice(item)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <template v-else>
                    <span>{{ item.buyPrice ? new Intl.NumberFormat('ru-RU').format(item.buyPrice) : '-' }}</span>
                    <button
                      @click="startEditBuyPrice(item)"
                      class="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Tahrirlash
                    </button>
                  </template>
                </div>
                <span v-else>-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="item.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ item.isValid ? 'To\'g\'ri' : 'Xatolik bor' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="processedProducts.length > 0" class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label for="invoiceId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nakladnoy raqami *
          </label>
          <div class="relative rounded-md shadow-sm">
            <input
              id="invoiceId"
              v-model="form.invoiceId"
              type="number"
              required
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white px-4 py-2.5"
              placeholder="Enter invoice ID"
            />
          </div>
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Izoh (Ixtiyoriy)
          </label>
          <div class="relative rounded-md shadow-sm">
            <input
              id="description"
              v-model="form.description"
              type="text"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white px-4 py-2.5"
              placeholder="Ixtiyoriy izoh"
            />
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm">
          <span v-if="!allSkusValid" class="text-red-600 dark:text-red-400">
            Barcha SKU-larni tekshirish majburiy
          </span>
          <span v-else-if="!form.invoiceId" class="text-yellow-600 dark:text-yellow-400">
            Nakladnoy raqami kiritish majburiy
          </span>
        </div>
        
        <button
          @click="sendToDatabase"
          :disabled="!allSkusValid || !form.invoiceId"
          class="inline-flex justify-center rounded-md border border-transparent px-6 py-2.5 text-sm font-medium shadow-sm transition-colors duration-200"
          :class="[
            allSkusValid && form.invoiceId 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          ]"
        >
          Ma'lumotlarni yuborish
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from '../components/common/Button.vue'
import { fetchUzumFBAShipment, fetchUzumFBSShipment } from '../services/uzum'
import { validateUzumSku } from '../services/products'
import { createUzumShipment } from '../services/shipments'

const loading = ref(false)
const error = ref(null)
const shipmentData = ref(null)
const validatedProducts = ref({})
const editableSku = ref({})
const editedSkus = ref({}) // Store edited SKU values
const manuallyEditedSkus = ref({}) // Store manually edited SKUs and their validation results
const editableBuyPrice = ref({})
const editedBuyPrices = ref({})
const editableQuantity = ref({})
const editedQuantities = ref({})
const editablePrice = ref({})
const editedPrices = ref({})

// Function to validate a single SKU
const validateSingleSku = async (sku) => {
  try {
    // Remove prefix if exists
    const processedSku = form.value.skuPrefix && sku.startsWith(form.value.skuPrefix)
      ? sku.slice(form.value.skuPrefix.length)
      : sku
      
    console.log('Validating single SKU:', processedSku)
    const result = await validateUzumSku(processedSku)
    console.log('Validation result:', result)
    return result
  } catch (err) {
    console.error(`Error validating SKU ${sku}:`, err)
    return { status: false, message: 'Error validating SKU' }
  }
}

// Start editing SKU
const startEdit = (item) => {
  editableSku.value[item.id] = true
  editedSkus.value[item.id] = item.skuTitle
}

// Cancel editing SKU
const cancelEdit = (item) => {
  editableSku.value[item.id] = false
  editedSkus.value[item.id] = undefined
}

// Handle SKU edit
const handleSkuEdit = async (item) => {
  const newSku = editedSkus.value[item.id]
  console.log('Editing SKU:', item.skuTitle, 'to:', newSku)
  
  // Skip if no change
  if (!newSku || newSku === item.skuTitle) {
    cancelEdit(item)
    return
  }
  
  // Validate the new SKU
  const result = await validateSingleSku(newSku)
  console.log('Validation result for edited SKU:', result)
  
  if (result.status) {
    // Store validation result using processed SKU
    const processedSku = form.value.skuPrefix && newSku.startsWith(form.value.skuPrefix)
      ? newSku.slice(form.value.skuPrefix.length)
      : newSku
    
    manuallyEditedSkus.value[item.id] = {
      sku: processedSku,
      validationResult: result
    }
  }
  
  // Close edit mode
  cancelEdit(item)
}

// Start editing buy price
const startEditBuyPrice = (item) => {
  editableBuyPrice.value[item.id] = true
  editedBuyPrices.value[item.id] = item.buyPrice || 0
}

// Cancel editing buy price
const cancelEditBuyPrice = (item) => {
  editableBuyPrice.value[item.id] = false
  editedBuyPrices.value[item.id] = undefined
}

// Handle buy price edit
const handleBuyPriceEdit = (item) => {
  const newPrice = editedBuyPrices.value[item.id]
  console.log('Editing buy price:', item.buyPrice, 'to:', newPrice)
  
  // Skip if no change
  if (newPrice === item.buyPrice) {
    cancelEditBuyPrice(item)
    return
  }
  
  // Update the item with new buy price
  if (manuallyEditedSkus.value[item.id]) {
    manuallyEditedSkus.value[item.id].validationResult.data.buy_price = newPrice
  } else {
    validatedProducts.value[item.skuTitle].data.buy_price = newPrice
  }
  
  // Close edit mode
  cancelEditBuyPrice(item)
}

// Start editing quantity
const startEditQuantity = (item) => {
  editableQuantity.value[item.id] = true
  editedQuantities.value[item.id] = item.quantityToStock
}

// Cancel editing quantity
const cancelEditQuantity = (item) => {
  editableQuantity.value[item.id] = false
  editedQuantities.value[item.id] = undefined
}

// Handle quantity edit
const handleQuantityEdit = (item) => {
  const newQuantity = editedQuantities.value[item.id]
  console.log('Editing quantity:', item.quantityToStock, 'to:', newQuantity)
  
  // Skip if no change
  if (newQuantity === item.quantityToStock) {
    cancelEditQuantity(item)
    return
  }
  
  // Update the item with new quantity
  if (manuallyEditedSkus.value[item.id]) {
    manuallyEditedSkus.value[item.id].validationResult.data.quantity = newQuantity
  } else {
    validatedProducts.value[item.skuTitle].data.quantity = newQuantity
  }
  
  // Close edit mode
  cancelEditQuantity(item)
}

// Start editing price
const startEditPrice = (item) => {
  editablePrice.value[item.id] = true
  editedPrices.value[item.id] = item.price
}

// Cancel editing price
const cancelEditPrice = (item) => {
  editablePrice.value[item.id] = false
  editedPrices.value[item.id] = undefined
}

// Handle price edit
const handlePriceEdit = (item) => {
  const newPrice = editedPrices.value[item.id]
  console.log('Editing price:', item.price, 'to:', newPrice)
  
  // Skip if no change
  if (newPrice === item.price) {
    cancelEditPrice(item)
    return
  }
  
  // Update the item with new price
  if (manuallyEditedSkus.value[item.id]) {
    manuallyEditedSkus.value[item.id].validationResult.data.price = newPrice
  } else {
    validatedProducts.value[item.skuTitle].data.price = newPrice
  }
  
  // Close edit mode
  cancelEditPrice(item)
}

const form = ref({
  shipmentType: 'fba',
  shopId: '',
  invoiceId: '',
  description: '',
  token: '',
  skuPrefix: ''
})

// Process the products data with validation
const processedProducts = computed(() => {
  console.log('Raw shipment data:', shipmentData.value)
  
  if (!shipmentData.value) {
    return []
  }

  // Handle different response formats for FBA and FBS
  let products = []
  if (form.value.shipmentType === 'fba') {
    // FBA format
    products = shipmentData.value.map(item => ({
      ...item,
      items: item.skuForInvoiceDtoList.map(sku => ({
        orderId: null, // FBA doesn't have orderId
        skuTitle: sku.skuTitle,
        amount: sku.quantityToStock,
        price: 0, // Set initial price to 0 for FBA
        productTitle: item.productTitle,
        originalProductTitle: item.productTitle // Same as productTitle for FBA
      }))
    }))
  } else {
    // FBS format - data is in payload.items
    const items = shipmentData.value?.payload?.items || []
    console.log('FBS items:', items)
    
    // Count order occurrences
    const orderCounts = items.reduce((acc, item) => {
      acc[item.orderId] = (acc[item.orderId] || 0) + 1
      return acc
    }, {})
    
    products = [{
      items: items.map(item => ({
        orderId: item.orderId,
        skuTitle: item.skuTitle,
        amount: item.amount,
        price: item.price,
        productTitle: item.title,
        originalProductTitle: item.title, // Use title from FBS
        isDuplicateOrder: orderCounts[item.orderId] > 1
      }))
    }]
  }
  
  console.log('Normalized products:', products)

  // Process each product
  return products.flatMap(item => {
    if (!item?.items?.length) {
      console.log('No items found:', item)
      return []
    }
    
    return item.items.map(skuItem => {
      console.log('Processing SKU item:', skuItem)
      
      // Check if this SKU was manually edited
      const editedData = manuallyEditedSkus.value[skuItem.orderId || skuItem.skuTitle]
      
      if (editedData) {
        // Use the edited SKU data
        const validationData = editedData.validationResult
        return {
          id: skuItem.orderId || skuItem.skuTitle,
          orderId: skuItem.orderId,
          originalSku: skuItem.skuTitle,
          originalProductTitle: skuItem.originalProductTitle,
          skuTitle: editedData.sku,
          productTitle: validationData.data?.name || skuItem.productTitle,
          quantityToStock: validationData.data?.quantity || skuItem.amount,
          price: validationData.data?.price || skuItem.price,
          buyPrice: validationData.data?.buy_price,
          isValid: validationData.status,
          isEditing: editableSku.value[skuItem.orderId || skuItem.skuTitle] || false,
          isDuplicateOrder: skuItem.isDuplicateOrder
        }
      }
      
      // Handle non-edited SKUs
      const processedSkuTitle = form.value.skuPrefix && skuItem.skuTitle.startsWith(form.value.skuPrefix)
        ? skuItem.skuTitle.slice(form.value.skuPrefix.length)
        : skuItem.skuTitle

      // Use processed SKU for validation lookup
      const validationData = validatedProducts.value[processedSkuTitle]
      console.log('Validation data for', processedSkuTitle, ':', validationData)

      return {
        id: skuItem.orderId || skuItem.skuTitle,
        orderId: skuItem.orderId,
        originalSku: skuItem.skuTitle,
        originalProductTitle: skuItem.originalProductTitle,
        skuTitle: processedSkuTitle,
        productTitle: validationData?.data?.name || skuItem.productTitle,
        quantityToStock: validationData?.data?.quantity || skuItem.amount,
        price: validationData?.data?.price || skuItem.price,
        buyPrice: validationData?.data?.buy_price,
        isValid: validationData?.status || false,
        isEditing: editableSku.value[skuItem.orderId || skuItem.skuTitle] || false,
        isDuplicateOrder: skuItem.isDuplicateOrder
      }
    })
  })
})

const allSkusValid = computed(() => {
  return processedProducts.value.every(item => item.isValid)
})

const validateProducts = async () => {
  const products = form.value.shipmentType === 'fba'
    ? shipmentData.value
    : shipmentData.value?.payload?.items || []

  console.log('Validating products:', products)

  if (form.value.shipmentType === 'fba') {
    for (const item of products) {
      if (!item?.skuForInvoiceDtoList?.length) continue

      for (const skuItem of item.skuForInvoiceDtoList) {
        try {
          const result = await validateSingleSku(skuItem.skuTitle)
          // Store validation result using processed SKU
          const processedSku = form.value.skuPrefix && skuItem.skuTitle.startsWith(form.value.skuPrefix)
            ? skuItem.skuTitle.slice(form.value.skuPrefix.length)
            : skuItem.skuTitle
          validatedProducts.value[processedSku] = result
        } catch (err) {
          console.error(`Error validating SKU ${skuItem.skuTitle}:`, err)
        }
      }
    }
  } else {
    // FBS validation
    for (const item of products) {
      try {
        const result = await validateSingleSku(item.skuTitle)
        // Store validation result using processed SKU
        const processedSku = form.value.skuPrefix && item.skuTitle.startsWith(form.value.skuPrefix)
          ? item.skuTitle.slice(form.value.skuPrefix.length)
          : item.skuTitle
        validatedProducts.value[processedSku] = result
      } catch (err) {
        console.error(`Error validating SKU ${item.skuTitle}:`, err)
      }
    }
  }
  
  console.log('Validation results:', validatedProducts.value)
}

const fetchShipment = async () => {
  loading.value = true
  error.value = null
  shipmentData.value = null
  validatedProducts.value = {}

  try {
    const { shipmentType, shopId, invoiceId, token } = form.value
    console.log('Fetching shipment data...', { shipmentType, shopId, invoiceId })

    if (shipmentType === 'fba') {
      const response = await fetchUzumFBAShipment(shopId, invoiceId, token)
      console.log('FBA Response:', response)
      shipmentData.value = response
    } else {
      const response = await fetchUzumFBSShipment(shopId, invoiceId, token)
      console.log('FBS Response:', response)
      shipmentData.value = response
    }

    console.log('Shipment data received:', shipmentData.value)
    console.log('Starting product validation...')
    await validateProducts()
    console.log('Products validated')
  } catch (err) {
    console.error('Error fetching shipment:', err)
    error.value = err.message || 'Failed to fetch shipment data'
  } finally {
    loading.value = false
  }
}

const sendToDatabase = async () => {
  try {
    if (!form.value.invoiceId) {
      alert('Please enter an invoice ID')
      return
    }

    if (!allSkusValid.value) {
      alert('Please validate all SKUs before sending to database')
      return
    }

    const items = processedProducts.value.map(item => ({
      orderId: form.value.shipmentType === 'fbs' ? parseInt(item.orderId) || null : null,
      uzum_sku: (item.skuTitle || '').toLowerCase(),
      amount: parseInt(item.quantityToStock) || 0,
      buy_price: parseFloat(item.buyPrice) || 0,
      sell_price: parseFloat(item.price) || 0
    }))

    const shipmentData = {
      invoice_id: parseInt(form.value.invoiceId),
      order_method: form.value.shipmentType,
      description: form.value.description || undefined,
      items
    }

    console.log('Sending shipment data:', shipmentData)
    await createUzumShipment(shipmentData)
    alert('Shipment data saved successfully!')
  } catch (error) {
    console.error('Error sending shipment data:', error)
    alert('Error saving shipment data: ' + error.message)
  }
}
</script>
