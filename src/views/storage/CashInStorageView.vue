<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Naqd kirim</h1>
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
        <!-- Store and Kontragent Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do'kon</label>
            <ApiSearchSelect
              v-model="formData.store_id"
              :display-value="selectedStore?.name || ''"
              placeholder="Search store..."
              endpoint="/search/stores"
              :additional-params="{ group_id: 47 }"
              @select="handleStoreSelect"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kontragent</label>
            <ApiSearchSelect
              v-model="formData.kontragent_id"
              :display-value="selectedKontragent?.name || ''"
              placeholder="Search kontragent..."
              endpoint="/search/kontragents"
              :additional-params="{ store_id: formData.store_id }"
              @select="handleKontragentSelect"
              :disabled="selectedStore?.group_id === 48"
            />
          </div>
        </div>

        <!-- Bank Account Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hisob</label>
            <select
              v-model="formData.bank_account_id"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              @change="handleBankAccountSelect"
            >
              <option value="">Select Bank Account</option>
              <option v-for="account in bankAccounts" :key="account.id" :value="account.id">
                {{ account.bank_name }} ({{ account.currency }}) - {{ formatNumber(account.balance) }}
              </option>
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
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xarid narxi ({{ selectedCurrency }})</label>
                <input
                  type="text"
                  v-model="item.formatted_buy_price"
                  @input="e => handleBuyPriceInput(e, index)"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Miqdor</label>
                <input
                  type="number"
                  v-model="item.quantity"
                  min="1"
                  @input="() => handleQuantityChange(index)"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jami summa ({{ selectedCurrency }})</label>
                <input
                  type="text"
                  v-model="item.formatted_sub_total"
                  @input="e => handleSubTotalInput(e, index)"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Umumiy summa ({{ selectedCurrency }})</label>
              <input
                type="text"
                v-model="formData.formatted_k_amount"
                readonly
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2"
              />
            </div>

            <div class="flex gap-4 items-end">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foiz</label>
                <input
                  type="number"
                  v-model="percentageValue"
                  step="0.1"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2"
                  placeholder="0.5"
                />
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    percentageType === 'plus' 
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  ]"
                  @click="setPercentageType('plus')"
                >
                  +
                </button>
                <button
                  type="button"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    percentageType === 'minus'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  ]"
                  @click="setPercentageType('minus')"
                >
                  -
                </button>
              </div>
              <button
                type="button"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                @click="applyPercentage"
              >
                Hisoblash
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qo'shimcha ma'lumot</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              :disabled="loading"
            >
              {{ loading ? 'Saqlanmoqda...' : 'Saqlash' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ApiSearchSelect from '../../components/common/ApiSearchSelect.vue'
import { API_URL } from '../../services/api'
import { getAuthHeaders } from '../../services/auth'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const selectedStore = ref(null)
const selectedKontragent = ref(null)
const bankAccounts = ref([])
const selectedCurrency = ref('')
const searchRefs = ref([])

const formData = ref({
  store_id: '',
  kontragent_id: '',
  bank_account_id: '',
  k_amount: 0,
  formatted_k_amount: '0',
  description: '',
  items: []
})

const percentageValue = ref(0)
const percentageType = ref('plus')

const addItem = () => {
  formData.value.items.push({
    product_id: '',
    variant_id: null,
    product_name: '',
    sku: '',
    article: '',
    real_buy_price: 0,
    original_buy_price: 0,
    formatted_buy_price: '0',
    quantity: 1,
    sub_total: 0,
    formatted_sub_total: '0'
  })
  nextTick(() => {
    searchRefs.value.push(null)
  })
}

const removeItem = (index) => {
  formData.value.items.splice(index, 1)
  searchRefs.value.splice(index, 1)
  calculateTotalAmount()
}

const handleStoreSelect = (store) => {
  selectedStore.value = store
  formData.value.store_id = store.id

  // Reset kontragent if store changes
  selectedKontragent.value = null
  formData.value.kontragent_id = ''

  // Reset bank account if store changes
  formData.value.bank_account_id = ''

  // Load bank accounts
  loadBankAccounts()
}

const handleKontragentSelect = (kontragent) => {
  selectedKontragent.value = kontragent
  formData.value.kontragent_id = kontragent.id
}

const handleBankAccountSelect = (event) => {
  const accountId = event.target.value
  const account = bankAccounts.value.find(acc => acc.id === parseInt(accountId))
  if (account) {
    selectedCurrency.value = account.currency
  }
}

const handleBuyPriceInput = (event, index) => {
  const value = parseFormattedNumber(event.target.value)
  formData.value.items[index].real_buy_price = value
  formData.value.items[index].original_buy_price = value
  formData.value.items[index].formatted_buy_price = formatNumber(value)
  calculateSubTotal(index)
}

const handleQuantityChange = (index) => {
  calculateSubTotal(index)
}

const handleSubTotalInput = (event, index) => {
  const value = parseFormattedNumber(event.target.value)
  formData.value.items[index].sub_total = value
  formData.value.items[index].formatted_sub_total = formatNumber(value)
  
  // If quantity is valid, calculate buy price
  if (formData.value.items[index].quantity > 0) {
    const buyPrice = formData.value.items[index].sub_total / formData.value.items[index].quantity
    formData.value.items[index].real_buy_price = buyPrice
    formData.value.items[index].formatted_buy_price = formatNumber(buyPrice)
  }
  
  calculateTotalAmount()
}

const calculateSubTotal = (index) => {
  const item = formData.value.items[index]
  const subTotal = item.real_buy_price * item.quantity
  item.sub_total = subTotal
  item.formatted_sub_total = formatNumber(subTotal)
  calculateTotalAmount()
}

const calculateTotalAmount = () => {
  const total = formData.value.items.reduce((sum, item) => sum + item.sub_total, 0)
  formData.value.k_amount = total
  formData.value.formatted_k_amount = formatNumber(total)
}

watch(() => formData.value.k_amount, (newValue) => {
  formData.value.formatted_k_amount = formatNumber(newValue)
})

const loadBankAccounts = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${API_URL}/bankAccount/get`, { headers })
    if (response.data.status) {
      bankAccounts.value = response.data.data
    }
  } catch (error) {
    console.error('Error loading bank accounts:', error)
    bankAccounts.value = []
  }
}

const handleProductSelect = async (product, index) => {
  const item = formData.value.items[index]
  
  // Always use base_product_id for validation with P_products table
  const productId = product.base_product_id || product.id
  const variantId = product.type === 'variant' ? product.id : null

  // Check if exact same product/variant already exists in items
  const isDuplicate = formData.value.items.some((item, idx) => 
    idx !== index && item.product_id === productId && item.variant_id === variantId
  )

  if (isDuplicate) {
    alert('Bu mahsulot qo\'shilgan')
    // Reset the current item's product-related fields
    formData.value.items[index] = {
      ...formData.value.items[index],
      product_id: '',
      variant_id: null,
      product_name: '',
      sku: '',
      article: '',
      real_buy_price: 0,
      original_buy_price: 0,
      formatted_buy_price: '0',
      quantity: 1,
      sub_total: 0,
      formatted_sub_total: '0'
    }
    // Reset the SearchSelect component
    nextTick(() => {
      if (searchRefs.value[index]) {
        searchRefs.value[index].reset()
      }
    })
    return
  }

  item.product_id = productId
  item.variant_id = variantId
  item.product_name = product.name
  item.sku = product.sku
  item.article = product.article
  item.real_buy_price = Math.round(product.buy_price || 0)
  item.original_buy_price = Math.round(product.buy_price || 0)
  item.formatted_buy_price = formatNumber(item.real_buy_price)
  item.quantity = 1
  calculateSubTotal(index)
}

const setPercentageType = (type) => {
  percentageType.value = type
}

const applyPercentage = () => {
  if (!percentageValue.value) return

  const percent = parseFloat(percentageValue.value) / 100
  formData.value.items.forEach((item, index) => {
    // Use original price for calculation
    let originalPrice = item.original_buy_price
    let adjustment = originalPrice * percent
    
    if (percentageType.value === 'minus') {
      item.real_buy_price = originalPrice - adjustment
    } else {
      item.real_buy_price = originalPrice + adjustment
    }
    
    item.formatted_buy_price = formatNumber(item.real_buy_price)
    calculateSubTotal(index)
  })
  
  calculateTotalAmount()
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

  if (!formData.value.bank_account_id) {
    alert('Please select a bank account')
    return false
  }

  if (!selectedCurrency.value) {
    alert('Currency is required. Please select a bank account')
    return false
  }

  if (!formData.value.items.length) {
    alert('Please add at least one item')
    return false
  }

  for (const item of formData.value.items) {
    if (!item.product_id || !item.quantity || !item.real_buy_price) {
      alert('Please fill in all item details')
      return false
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    const headers = await getAuthHeaders()
    const response = await axios.post(
      `${API_URL}/storages/cash/in`,
      {
        store_id: parseInt(formData.value.store_id),
        kontragent_id: parseInt(formData.value.kontragent_id),
        bank_account_id: parseInt(formData.value.bank_account_id),
        k_debt_currency: selectedCurrency.value,
        k_amount: formData.value.k_amount,
        description: formData.value.description,
        items: formData.value.items.map(item => ({
          product_id: parseInt(item.product_id),
          variant_id: item.variant_id,
          sku: item.sku,
          article: item.article,
          real_buy_price: item.real_buy_price,
          quantity: item.quantity,
          sub_total: item.sub_total
        }))
      },
      { headers }
    )

    if (response.data.status) {
      router.push('/storage')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert(error.response?.data?.message || 'An error occurred')
  }
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('uz-UZ').format(number)
}

const parseFormattedNumber = (formattedNumber) => {
  return parseFloat(formattedNumber.replace(/\D+/g, ''))
}

onMounted(() => {
  addItem() // Add first item by default
  loadBankAccounts() // Load bank accounts on mount
})
</script>
