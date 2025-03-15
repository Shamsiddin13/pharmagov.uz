<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Shunchaki kirim</h1>
        <router-link
          to="/storage"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Omborga qaytish
        </router-link>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Store Selection -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do'kon</label>
            <SearchSelect
              v-model="formData.store_id"
              :display-value="selectedStore?.name || ''"
              placeholder="Search store..."
              search-endpoint="/search/stores"
              @select="handleStoreSelect"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kontragent</label>
            <SearchSelect
              v-model="formData.kontragent_id"
              :display-value="selectedKontragent?.name || ''"
              placeholder="Search kontragent..."
              search-endpoint="/search/kontragents"
              :additional-params="{ store_id: formData.store_id }"
              @select="handleKontragentSelect"
              :disabled="!formData.store_id"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valyuta</label>
            <select
              v-model="formData.k_debt_currency"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Valyutani tanlash</option>
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <!-- Items -->
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
            <div class="flex justify-between">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Mahsulot {{ index + 1 }}</h3>
              <button
                type="button"
                @click="removeItem(index)"
                class="text-red-600 hover:text-red-700"
              >
                Mahsulotni o'chirish
              </button>
            </div>

            <div class="space-y-4">
              <!-- Product and SKU in one line -->
              <div class="flex gap-4">
                <div class="flex-grow">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mahsulot</label>
                  <SearchSelect
                    ref="searchRefs"
                    :model-value="item.product_name"
                    :display-value="item.product_name"
                    :search-endpoint="'/search/products'"
                    :additional-params="{ store_id: formData.store_id }"
                    placeholder="Mahsulotni tanlash"
                    :disabled="!formData.store_id"
                    @select="(product) => handleProductSelect(product, index)"
                  />
                </div>
                <div class="w-48">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                  <input
                    type="text"
                    v-model="item.sku"
                    readonly
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2"
                  />
                </div>
              </div>

              <!-- Buy Price, Quantity and Sub Total in one line -->
              <div class="flex gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xarid narxi ({{ formData.k_debt_currency || '-' }})</label>
                  <input
                    type="text"
                    v-model="item.formatted_buy_price"
                    @input="handleBuyPriceInput($event, index)"
                    :disabled="!item.product_id"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  />
                </div>

                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Miqdori</label>
                  <input
                    type="number"
                    v-model="item.quantity"
                    @input="handleQuantityChange(index)"
                    :disabled="!item.product_id"
                    required
                    min="1"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  />
                </div>

                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jami summa ({{ formData.k_debt_currency || '-' }})</label>
                  <input
                    type="text"
                    v-model="item.formatted_sub_total"
                    @input="handleSubTotalInput($event, index)"
                    :disabled="!item.product_id"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Amount and Description after items -->
        <div class="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jami summa ({{ formData.k_debt_currency || '-' }})</label>
            <input
              type="text"
              :value="formatted_k_amount"
              readonly
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qo'shimcha ma'lumot</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.push('/storage')"
            class="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Saqlash...' : 'Saqlash' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStorageFilterData } from '../../composables/useStorageFilterData'
import { enterStorage, API_URL } from '../../services/storageOperations'
import SearchSelect from '../../components/common/SearchSelect.vue'
import { formatNumber, unformatNumber } from '../../utils/numberFormat'
import axios from 'axios'

const router = useRouter()
const { stores, kontragents, products, loading: filterLoading } = useStorageFilterData()

const loading = ref(false)
const formData = ref({
  store_id: '',
  kontragent_id: '',
  k_amount: 0,
  formatted_k_amount: '0',
  k_debt_currency: '',
  type: 'in',
  description: '',
  items: []
})

const selectedStore = ref(null)
const selectedKontragent = ref(null)
const searchRefs = ref([])

const storeKontragentMap = {
  '1': { id: 1 },
  '5': { id: 5 },
  '17': { id: 35 },
  '18': { id: 34 },
  '24': { id: 110 }
}

const addItem = () => {
  formData.value.items.push({
    product_id: '',
    base_product_id: '',
    product_name: '',
    sku: '',
    article: '',
    real_buy_price: 0,
    quantity: 1,
    sub_total: 0,
    formatted_sub_total: '0'
  })
}

const removeItem = (index) => {
  formData.value.items.splice(index, 1)
  if (formData.value.items.length === 0) {
    addItem() // Always keep at least one item
  }
  calculateTotalAmount()
}

const handleStoreSelect = async (store) => {
  if (!store) return

  selectedStore.value = store
  formData.value.store_id = store.id
  formData.value.kontragent_id = null
  selectedKontragent.value = null

  // Check if we have a predefined kontragent for this store
  if (storeKontragentMap[store.id]) {
    try {
      const token = localStorage.getItem('token')
      // Fetch the kontragent details by ID
      const response = await axios.get(`${API_URL}/search/kontragents`, {
        params: {
          id: storeKontragentMap[store.id].id
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data && response.data[0]) {
        const kontragent = response.data[0]
        formData.value.kontragent_id = kontragent.id
        selectedKontragent.value = kontragent
      }
    } catch (error) {
      console.error('Error fetching mapped kontragent:', error)
    }
    return
  }

  // If store has group_id 48, auto-fetch kontragent
  if (store.group_id === 48) {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/search/kontragents`, {
        params: {
          store_id: store.id,
          limit: 1
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data && response.data[0]) {
        const kontragent = response.data[0]
        formData.value.kontragent_id = kontragent.id
        selectedKontragent.value = kontragent
      }
    } catch (error) {
      console.error('Error fetching kontragent:', error)
    }
  }
}

const handleKontragentSelect = (kontragent) => {
  selectedKontragent.value = kontragent
  formData.value.kontragent_id = kontragent.id
}

const handleBuyPriceInput = (event, index) => {
  const item = formData.value.items[index]
  const unformattedValue = unformatNumber(event.target.value)
  item.real_buy_price = unformattedValue
  item.formatted_buy_price = formatNumber(unformattedValue)
  calculateSubTotal(index)
}

const handleQuantityChange = (index) => {
  calculateSubTotal(index)
}

const handleSubTotalInput = (event, index) => {
  const item = formData.value.items[index]
  const unformattedValue = unformatNumber(event.target.value)
  item.sub_total = unformattedValue
  item.formatted_sub_total = formatNumber(unformattedValue)
  
  // Only recalculate buy price when sub total changes
  if (item.sub_total && item.quantity) {
    item.real_buy_price = Math.round(item.sub_total / parseInt(item.quantity))
    item.formatted_buy_price = formatNumber(item.real_buy_price)
  }
  
  calculateTotalAmount()
}

const calculateSubTotal = (index) => {
  const item = formData.value.items[index]
  if (item.real_buy_price && item.quantity) {
    item.sub_total = Math.round(item.real_buy_price * parseInt(item.quantity))
    item.formatted_sub_total = formatNumber(item.sub_total)
    calculateTotalAmount()
  }
}

const calculateTotalAmount = () => {
  formData.value.k_amount = formData.value.items.reduce((total, item) => {
    return total + (item.sub_total ? parseInt(item.sub_total) : 0)
  }, 0)
}

watch(() => formData.value.k_amount, (newValue) => {
  formData.value.formatted_k_amount = formatNumber(newValue)
})

const formatted_k_amount = ref(formData.value.formatted_k_amount)

watch(() => formData.value.k_amount, (newValue) => {
  formatted_k_amount.value = formatNumber(newValue)
})

const handleProductSelect = (product, index) => {
  // For variants, we'll use both base_product_id and variant id for proper duplicate checking
  const productId = product.id
  const baseProductId = product.type === 'variant' ? product.base_product_id : product.id
  
  // Check if exact same product/variant already exists in items
  const isDuplicate = formData.value.items.some((item, idx) => 
    idx !== index && item.product_id === productId
  )

  if (isDuplicate) {
    alert('Bu mahsulot qo\'shilgan')
    // Reset the current item's product-related fields
    formData.value.items[index].product_id = ''
    formData.value.items[index].product_name = ''
    formData.value.items[index].sku = ''
    // Reset the SearchSelect component
    if (searchRefs.value[index]) {
      searchRefs.value[index].reset()
    }
    return
  }

  const item = formData.value.items[index]
  item.product_id = productId
  item.base_product_id = baseProductId // Store base product id for reference
  item.product_name = product.name
  item.sku = product.sku
  item.real_buy_price = Math.round(product.buy_price)
  item.formatted_buy_price = formatNumber(item.real_buy_price)
  item.article = product.article
  
  calculateSubTotal(index)
}

const validateForm = () => {
  if (!formData.value.store_id) {
    alert('Please select a store')
    return false
  }
  if (!formData.value.kontragent_id) {
    alert('Please select a kontragent')
    return false
  }
  if (!formData.value.k_debt_currency) {
    alert('Please select a currency')
    return false
  }
  if (!formData.value.items.length) {
    alert('Please add at least one item')
    return false
  }
  for (const item of formData.value.items) {
    if (!item.product_id || !item.real_buy_price || !item.quantity) {
      alert('Please fill all required fields for each item')
      return false
    }
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    // Prepare data in the format expected by the backend
    const apiData = {
      ...formData.value,
      items: formData.value.items.map(item => ({
        product_id: parseInt(item.base_product_id || item.product_id), // Use base_product_id for variants
        sku: item.sku || '',
        article: item.article || '',
        real_buy_price: parseInt(item.real_buy_price),
        quantity: parseInt(item.quantity),
        sub_total: parseInt(item.sub_total)
      }))
    }
    
    await enterStorage(apiData)
    router.push('/storage')
  } catch (error) {
    console.error('Failed to save enter storage:', error)
    alert(error.message || 'Failed to save')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  addItem() // Add first item by default
})
</script>
