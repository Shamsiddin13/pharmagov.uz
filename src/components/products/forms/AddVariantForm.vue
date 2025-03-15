
<script setup>
import { ref, onMounted, computed } from 'vue'
import Button from '../../common/Button.vue'
import ImageUpload from './ImageUpload.vue'
import NumberInput from '../../common/NumberInput.vue'
import { fetchProductOptions, fetchOptionValues, createProductVariant } from '../../../services/variants'

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true
  },
  productName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'variant-added'])

const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const productOptions = ref([])
const optionValues = ref([])
const selectedOptionId = ref('')
const selectedOptionValue = ref(null)

const form = ref({
  buy_price: '',
  sell_price: '',
  product_option_value_id: '',
  image: null,
  ean13: ''
})

// Computed property for variant name
const variantName = computed(() => {
  if (!selectedOptionValue.value) return ''
  return `${props.productName} (${selectedOptionValue.value.value})`
})

onMounted(async () => {
  try {
    loading.value = true
    productOptions.value = await fetchProductOptions()
  } catch (err) {
    error.value = err.message || 'Failed to load product options'
  } finally {
    loading.value = false
  }
})

const handleOptionChange = async () => {
  if (!selectedOptionId.value) {
    optionValues.value = []
    form.value.product_option_value_id = ''
    selectedOptionValue.value = null
    return
  }

  try {
    loading.value = true
    optionValues.value = await fetchOptionValues(selectedOptionId.value)
  } catch (err) {
    error.value = err.message || 'Failed to load option values'
    optionValues.value = []
  } finally {
    loading.value = false
  }
}

const handleOptionValueChange = () => {
  selectedOptionValue.value = optionValues.value.find(v => v.id === form.value.product_option_value_id)
}

const handleImageSelected = (file) => {
  form.value.image = file
}

const validateForm = () => {
  if (!form.value.product_option_value_id) return 'Option value is required'
  return null
}

const handleSubmit = async () => {
  if (submitting.value) return

  error.value = ''
  const validationError = validateForm()
  if (validationError) {
    error.value = validationError
    return
  }

  try {
    submitting.value = true
    const variantData = {
      ...form.value,
      name: variantName.value,
      product_id: props.productId
    }
    const variant = await createProductVariant(props.productId, variantData)
    emit('variant-added', variant)
    emit('close')
  } catch (err) {
    error.value = err.message || 'Failed to create variant'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="h-full">
    <template v-if="loading">
      <div class="flex items-center justify-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    </template>

    <template v-else>
      <form @submit.prevent class="space-y-6 px-4 py-5">
        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
          {{ error }}
        </div>

        <!-- Preview of variant name -->
        <div v-if="variantName" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">Variant Name Preview</h3>
          <p class="text-gray-700 dark:text-gray-300">{{ variantName }}</p>
        </div>

        <!-- Option Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Option Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="selectedOptionId"
            @change="handleOptionChange"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            <option v-for="option in productOptions" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </div>

        <!-- Option Values -->
        <div v-if="optionValues.length > 0">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Option Value <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.product_option_value_id"
            @change="handleOptionValueChange"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select a value</option>
            <option v-for="value in optionValues" :key="value.id" :value="value.id">
              {{ value.value }}
            </option>
          </select>
        </div>

        <!-- Pricing Section -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h3 class="font-medium text-gray-900 dark:text-white">Pricing</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buy Price
              </label>
              <NumberInput
                v-model="form.buy_price"
                placeholder="0.00"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sell Price
              </label>
              <NumberInput
                v-model="form.sell_price"
                placeholder="0.00"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- SKU and EAN Section -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h3 class="font-medium text-gray-900 dark:text-white">Product Identifiers</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                EAN13
              </label>
              <input
                v-model="form.ean13"
                type="text"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter EAN13"
              />
            </div>
          </div>
        </div>

        <!-- Image Upload -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
          <h3 class="font-medium text-gray-900 dark:text-white">Product Image</h3>
          <ImageUpload @image-selected="handleImageSelected" />
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
          <Button 
            type="button" 
            variant="secondary" 
            :loading="submitting"
            :disabled="submitting"
            @click="$emit('close')"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="primary"
            :loading="submitting"
            :disabled="submitting"
            @click="handleSubmit"
          >
            {{ submitting ? 'Adding...' : 'Add Variant' }}
          </Button>
        </div>
      </form>
    </template>
  </div>
</template>