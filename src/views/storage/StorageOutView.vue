<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Chiqim</h1>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do'kon</label>
            <SearchSelect
              v-model="formData.store_id"
              :display-value="selectedStore?.name || ''"
              placeholder="Do'konni qidirish..."
              search-endpoint="/search/stores"
              :additional-params="{ group_id: 48 }"
              @select="handleStoreSelect"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kontragent</label>
            <SearchSelect
              v-model="formData.kontragent_id"
              :display-value="selectedKontragent?.name || ''"
              placeholder="Kontragentni qidirish..."
              search-endpoint="/search/kontragents"
              :additional-params="{ store_id: formData.store_id }"
              @select="handleKontragentSelect"
              :disabled="selectedStore?.group_id === 48"
            />
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
                    placeholder="Mahsulotni qidirish..."
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
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xarid Narxi</label>
                  <input
                    type="text"
                    v-model="item.formatted_buy_price"
                    @input="(e) => handleBuyPriceInput(e, index)"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Miqdor</label>
                  <input
                    type="number"
                    v-model="item.quantity"
                    min="1"
                    @input="() => handleQuantityChange(index)"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jami summa</label>
                  <input
                    type="text"
                    v-model="item.formatted_sub_total"
                    @input="(e) => handleSubTotalInput(e, index)"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Amount and Description -->
        <div class="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ummumiy summa</label>
            <input
              type="text"
              v-model="formData.formatted_k_amount"
              readonly
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qo'shimcha ma'lumot</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2"
            ></textarea>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            :disabled="loading"
          >
            {{ loading ? 'Saqlanmoqda...' : 'Saqlash' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import SearchSelect from '../../components/common/SearchSelect.vue'

const API_URL = 'https://api.mgoods.uz/api'
const toast = useToast()
const router = useRouter()

// Data
const loading = ref(false)
const selectedStore = ref(null)
const selectedKontragent = ref(null)
const searchRefs = ref([])

const formData = ref({
  store_id: '',
  kontragent_id: '',
  k_amount: 0,
  formatted_k_amount: '0',
  k_debt_currency: 'UZS',
  type: 'out',
  description: '',
  items: []
})

// Methods
const addItem = () => {
  formData.value.items.push({
    product_id: '',
    base_product_id: '',
    product_name: '',
    sku: '',
    article: '',
    real_buy_price: 0,
    formatted_buy_price: '0',
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
  selectedStore.value = store
  formData.value.store_id = store.id
  
  // Reset kontragent if store changes
  selectedKontragent.value = null
  formData.value.kontragent_id = ''
  
  // Reset all product selections
  formData.value.items.forEach(item => {
    item.product_id = ''
    item.product_name = ''
    item.sku = ''
    item.article = ''
    item.real_buy_price = 0
    item.formatted_buy_price = '0'
    item.quantity = 1
    item.sub_total = 0
    item.formatted_sub_total = '0'
  })
  
  // If store has group_id 48, auto-fetch kontragent
  if (store.group_id === 48) {
    try {
      const response = await fetch(`${API_URL}/search/kontragents?store_id=${store.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch kontragent')
      }

      const [kontragent] = await response.json()
      if (kontragent) {
        selectedKontragent.value = kontragent
        formData.value.kontragent_id = kontragent.id
      }
    } catch (error) {
      console.error('Error fetching kontragent:', error)
    }
  }
  
  calculateTotalAmount()
}

const handleKontragentSelect = (kontragent) => {
  selectedKontragent.value = kontragent
  formData.value.kontragent_id = kontragent.id
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('uz-UZ').format(number)
}

const parseFormattedNumber = (formattedNumber) => {
  return parseFloat(formattedNumber.replace(/[^0-9.-]+/g, '')) || 0
}

const handleBuyPriceInput = (event, index) => {
  const value = parseFormattedNumber(event.target.value)
  formData.value.items[index].real_buy_price = value
  formData.value.items[index].formatted_buy_price = formatNumber(value)
  calculateSubTotal(index)
}

const handleQuantityChange = (index) => {
  calculateSubTotal(index)
}

const handleSubTotalInput = (event, index) => {
  const value = parseFormattedNumber(event.target.value)
  const item = formData.value.items[index]
  item.sub_total = value
  
  if (item.quantity > 0) {
    item.real_buy_price = value / item.quantity
  }
  
  item.formatted_sub_total = formatNumber(value)
  item.formatted_buy_price = formatNumber(item.real_buy_price)
  calculateTotalAmount()
}

const calculateSubTotal = (index) => {
  const item = formData.value.items[index]
  item.sub_total = item.real_buy_price * item.quantity
  item.formatted_sub_total = formatNumber(item.sub_total)
  item.formatted_buy_price = formatNumber(item.real_buy_price)
  calculateTotalAmount()
}

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
    toast.error('Please select a store')
    return false
  }
  
  if (!formData.value.kontragent_id) {
    toast.error('Please select a kontragent')
    return false
  }
  
  if (!formData.value.items.length) {
    toast.error('Please add at least one item')
    return false
  }
  
  for (const item of formData.value.items) {
    if (!item.product_id) {
      toast.error('Please select a product for all items')
      return false
    }
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    
    // Prepare data for API
    const apiData = {
      ...formData.value,
      k_amount: formData.value.k_amount,
      items: formData.value.items.map(item => ({
        product_id: parseInt(item.base_product_id || item.product_id), // Use base_product_id for variants
        sku: item.sku || '',
        article: item.article || '',
        real_buy_price: parseInt(item.real_buy_price),
        quantity: parseInt(item.quantity),
        sub_total: parseInt(item.sub_total)
      }))
    }
    
    const response = await axios.post(`${API_URL}/storages/store/out`, apiData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    if (response.data.status) {
      toast.success('Storage entry created successfully')
      router.push('/storage')
    }
  } catch (error) {
    console.error('Error creating storage entry:', error)
    toast.error(error.response?.data?.message || 'Failed to create storage entry')
  } finally {
    loading.value = false
  }
}

// Watch for changes in quantity or price
watch(
  () => formData.value.k_amount,
  (newValue) => {
    formData.value.formatted_k_amount = formatNumber(newValue)
  }
)

const calculateTotalAmount = () => {
  const total = formData.value.items.reduce((sum, item) => sum + item.sub_total, 0)
  formData.value.k_amount = total
  formData.value.formatted_k_amount = formatNumber(total)
}

onMounted(() => {
  addItem() // Add first item by default
})
</script>
