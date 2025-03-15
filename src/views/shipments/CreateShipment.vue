<script setup>
import { API_URL } from '../../config/api'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import auth from '../../stores/auth'
import { fetchUserData } from '../../api/user'
import Button from '../../components/common/Button.vue'
import ApiSearchSelect from '../../components/common/ApiSearchSelect.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => isEditMode.value ? 'Yukni Tahrirlash' : 'Yukni Yaratish')

const selectedStore = ref(null)
const searchRefs = ref([])
const currentUser = ref(null)

const orderMethods = [
  { id: 'zoodmall', name: 'ZoodMall' },
  { id: 'wildberries', name: 'Wildberries' },
  { id: 'fbs', name: 'FBS' },
  { id: 'fba', name: 'FBA' },
  { id: 'ofis', name: 'Ofis' }
]

const formData = ref({
  store_id: null,
  order_method: '',
  order_id: '',
  invoice_id: '',
  items: [],
  description: ''
})

const showOrderId = computed(() => {
  return ['zoodmall', 'fbs', 'wildberries'].includes(formData.value.order_method)
})

const showInvoiceId = computed(() => {
  return ['fbs', 'fba'].includes(formData.value.order_method)
})

const handleStoreSelect = (store) => {
  selectedStore.value = store
  formData.value.store_id = store.id
  // Reset all product selections when store changes
  formData.value.items.forEach((item, index) => {
    const searchRef = searchRefs.value[index]
    if (searchRef && typeof searchRef.reset === 'function') {
      searchRef.reset()
    }
  })
  // Also reset the form items
  formData.value.items.forEach((item, index) => {
    formData.value.items[index] = {
      ...formData.value.items[index],
      product_id: null,
      variant_id: null,
      product_name: '',
      sku: '',
      article: '',
      quantity: 1,
      formatted_buy_price: '0',
      formatted_sell_price: '0'
    }
  })
}

const addItem = () => {
  formData.value.items.push({
    product_id: null,
    variant_id: null,
    product_name: '',
    sku: '',
    article: '',
    quantity: 1,
    formatted_buy_price: '0',
    formatted_sell_price: '0'
  })
}

const removeItem = (index) => {
  formData.value.items.splice(index, 1)
}

const handleProductSelect = (product, index) => {
  // Check if product already exists in other items
  const existingIndex = formData.value.items.findIndex((item, i) => i !== index && item.product_id === product.id)
  if (existingIndex !== -1) {
    alert(`This product already exists in item ${existingIndex + 1}`)
    return
  }

  formData.value.items[index] = {
    ...formData.value.items[index],
    product_id: product.id,
    variant_id: product.variant_id,
    product_name: product.name,
    sku: product.sku,
    article: product.article,
    formatted_buy_price: formatNumber(product.buy_price || 0),
    formatted_sell_price: '0'
  }
}

const loadShipmentData = async () => {
  if (!isEditMode.value) return

  try {
    loading.value = true
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found')
    }

    const response = await axios.get(`${API_URL}/shipments/send/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to load shipment')
    }

    const shipment = response.data.data
    
    // Debug log before setting form data
    console.log('Loaded shipment:', shipment)
    console.log('Original order method:', shipment.order_method)

    // Find matching order method from our options
    const matchedMethod = orderMethods.find(method => 
      method.id.toLowerCase() === shipment.order_method?.toLowerCase() ||
      method.name.toLowerCase() === shipment.order_method?.toLowerCase()
    )

    formData.value = {
      store_id: shipment.store_id,
      order_method: matchedMethod?.id || '', // Use matched method ID
      order_id: shipment.order_id || '',
      invoice_id: shipment.invoice_id || '',
      description: shipment.desc || '',
      items: [{
        product_id: shipment.product_id,
        variant_id: shipment.variant_id,
        product_name: shipment.product,
        sku: shipment.sku,
        article: shipment.article,
        quantity: shipment.quantity,
        formatted_buy_price: formatNumber(shipment.buy_price || 0),
        formatted_sell_price: formatNumber(shipment.sell_price || 0),
        uzum_sku: shipment.uzum_sku || ''
      }]
    }

    // Load store data
    selectedStore.value = {
      id: shipment.store_id,
      name: shipment.store
    }

    // Debug log after setting form data
    console.log('Matched order method:', matchedMethod)
    console.log('Form data:', formData.value)
  } catch (error) {
    console.error('Error loading shipment:', error)
    // Add error notification here
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true

    if (!auth.token) {
      throw new Error('Not authenticated')
    }

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found')
    }

    if (!currentUser.value?.id) {
      throw new Error('User data not loaded')
    }

    const promises = formData.value.items.map(async (item) => {
      const data = {
        store_id: formData.value.store_id,
        user_id: currentUser.value.id,
        store: selectedStore.value.name,
        product: item.product_name,
        article: item.article,
        sku: item.sku,
        quantity: parseInt(item.quantity),
        buy_price: parseFloat(parseFormattedNumber(item.formatted_buy_price)),
        sell_price: parseFloat(parseFormattedNumber(item.formatted_sell_price)),
        order_method: formData.value.order_method,
        desc: formData.value.description || null
      }

      if (formData.value.order_method === 'zoodmall') {
        data.order_id = formData.value.order_id
      } else if (formData.value.order_method === 'wildberries') {
        data.order_id = formData.value.order_id
      } else if (formData.value.order_method === 'fbs') {
        data.order_id = formData.value.order_id
        data.invoice_id = formData.value.invoice_id
      } else if (formData.value.order_method === 'fba') {
        data.invoice_id = formData.value.invoice_id
      }

      if (item.uzum_sku) {
        data.uzum_sku = item.uzum_sku
      }

      const url = isEditMode.value 
        ? `${API_URL}/shipments/send/${route.params.id}`
        : `${API_URL}/shipments/send/create`

      const method = isEditMode.value ? 'put' : 'post'

      return axios({
        method,
        url,
        data,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    })

    await Promise.all(promises)
    router.push('/shipment')
  } catch (error) {
    console.error('Error saving shipment:', error)
    // Add error notification here
  } finally {
    loading.value = false
  }
}

const handleBuyPriceInput = (event, index) => {
  const item = formData.value.items[index]
  item.formatted_buy_price = formatNumber(parseFormattedNumber(event.target.value))
}

const handleSellPriceInput = (event, index) => {
  const item = formData.value.items[index]
  item.formatted_sell_price = formatNumber(parseFormattedNumber(event.target.value))
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('uz-UZ').format(number)
}

const parseFormattedNumber = (formattedNumber) => {
  return parseInt(formattedNumber.replace(/\D/g, '')) || 0
}

// Load user data
const loadUserData = async () => {
  try {
    const userData = await fetchUserData()
    currentUser.value = userData
  } catch (err) {
    console.error('Error loading user data:', err)
  }
}

onMounted(() => {
  loadUserData()
  if (isEditMode.value) {
    loadShipmentData()
  } else {
    addItem()
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
        <Button variant="secondary" @click="router.back()">
          Qaytish
        </Button>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Store Search and Order Method in one line -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do'kon</label>
            <ApiSearchSelect
              v-model="formData.store_id"
              :display-value="selectedStore?.name || ''"
              placeholder="Search store..."
              endpoint="/search/stores"
              @select="handleStoreSelect"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buyurtma Turi</label>
            <div class="relative">
              <select
                v-model="formData.order_method"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="" disabled>Buyurtma turini tanlang</option>
                <option
                  v-for="method in orderMethods"
                  :key="method.id"
                  :value="method.id"
                >
                  {{ method.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Conditional Fields in one line -->
        <div v-if="showOrderId || showInvoiceId" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div v-if="showOrderId">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buyurtma ID</label>
            <div class="relative">
              <input
                type="text"
                v-model="formData.order_id"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Buyurtma raqami"
                required
              />
            </div>
          </div>

          <div v-if="showInvoiceId">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nakladnoy raqami</label>
            <div class="relative">
              <input
                type="text"
                v-model="formData.invoice_id"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Nakladnoy raqami"
                required
              />
            </div>
          </div>
        </div>

        <!-- Products Section -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Mahsulotlar</h2>
            <button
              type="button"
              @click="addItem"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Mahsulot qo'shish
            </button>
          </div>

          <div v-for="(item, index) in formData.items" :key="index" class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
            <div class="flex justify-between items-start">
              <h3 class="text-md font-medium text-gray-900 dark:text-white">Mahsulot {{ index + 1 }}</h3>
              <button
                v-if="formData.items.length > 1"
                type="button"
                @click="removeItem(index)"
                class="text-red-600 hover:text-red-700"
              >
                Mahsulotni o'chirish
              </button>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-9">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mahsulot</label>
                <ApiSearchSelect
                  :ref="el => { if (el) searchRefs[index] = el }"
                  :model-value="item.product_id"
                  :display-value="item.product_name"
                  endpoint="/search/products"
                  :additional-params="{ store_id: formData.store_id }"
                  placeholder="Mahsulotni qidirish"
                  :disabled="!formData.store_id"
                  @select="(product) => handleProductSelect(product, index)"
                />
              </div>

              <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                <input
                  type="text"
                  v-model="item.sku"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2"
                  readonly
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Miqdor</label>
                <input
                  type="number"
                  v-model="item.quantity"
                  min="1"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xarid narxi</label>
                <input
                  type="text"
                  :value="item.formatted_buy_price"
                  @input="e => handleBuyPriceInput(e, index)"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sotuv narxi</label>
                <input
                  type="text"
                  :value="item.formatted_sell_price"
                  @input="e => handleSellPriceInput(e, index)"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Total Amount and Description -->
        <div class="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Izoh</label>
            <input
              type="text"
              v-model="formData.description"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            :disabled="loading"
            class="px-6"
          >
            {{ loading ? 'Yaratilyapti...' : 'Yaratish' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
