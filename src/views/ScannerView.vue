<template>
  <div class="container mx-auto p-4">
    <!-- Scanner Toggle Buttons -->
    <div class="flex space-x-4 mb-6">
      <button
        @click="setActiveScanner('crm')"
        :class="[
          'px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300',
          activeScanner === 'crm' 
            ? 'bg-indigo-600 text-white shadow-lg scale-105'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        CRM Skaner
      </button>
      <button
        @click="setActiveScanner('uzum')"
        :class="[
          'px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300',
          activeScanner === 'uzum'
            ? 'bg-indigo-600 text-white shadow-lg scale-105'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        UZUM Skaner
      </button>
    </div>

    <div class="flex space-x-6">
      <!-- CRM Scanner -->
      <div :class="[
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300',
        activeScanner === 'crm' ? 'w-full' : 'hidden'
      ]">
        <div class="border-b border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">CRM Skaner</h2>
        </div>
        
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID raqamlarni kiriting</label>
            <textarea
              v-model="crmTextarea"
              @input="processCrmInput"
              @paste="handlePaste"
              class="w-full h-32 px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-600"
              placeholder="ID raqamlarni kiriting yoki skaner qiling..."
            ></textarea>
            <div class="flex justify-end space-x-2 mt-2">
              <button
                @click="copyCrmIds"
                class="px-4 py-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
              >
                Nusxa olish
              </button>
              <button
                @click="clearCrmData"
                class="px-4 py-2 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Tozalash
              </button>
            </div>
          </div>
          
          <!-- Table -->
          <div class="mt-6">
            <div class="overflow-x-auto">
              <div class="flex justify-start mb-4">
                <span class="text-xl font-semibold text-gray-300 dark:text-gray-300">Jami ID lar: {{ crmIdList.length }}</span>
              </div>
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Soni</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(item, index) in filteredCrmIds" :key="index" 
                      :class="[
                        'hover:bg-gray-50 dark:hover:bg-gray-700',
                        item.count > 1 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                      ]">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ item.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ item.count }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        @click="startDelete(item, 'crm')"
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        O'chirish
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- UZUM Scanner -->
      <div :class="[
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300',
        activeScanner === 'uzum' ? 'w-full' : 'hidden'
      ]">
        <div class="border-b border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">UZUM Skaner</h2>
        </div>

        <div class="p-6 space-y-5">
          <div class="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="autoMode"
              v-model="uzumAutoMode"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label for="autoMode" class="text-sm text-gray-700 dark:text-gray-300">Avto-rejim</label>
          </div>
          <div class="flex space-x-4">
            <input
              type="text"
              v-model="uzumInput"
              @input="handleUzumInput"
              @keydown.enter="processUzumInput"
              placeholder="ID ni kiriting yoki skaner qiling..."
              class="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrlangan ID lar</label>
            <textarea
              v-model="filteredUzumIds"
              class="w-full h-32 px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-600"
              placeholder="Filtrlangan ID lar shu yerda ko'rsatiladi..."
              readonly
            ></textarea>
            <div class="flex justify-end space-x-2 mt-2">
              <button
                @click="copyUzumIds"
                class="px-4 py-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
              >
                Nusxa olish
              </button>
              <button
                @click="clearUzumData"
                class="px-4 py-2 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Tozalash
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="mt-6">
            <div class="overflow-x-auto">
              <div class="flex justify-start mb-4">
                <span class="text-xl font-semibold text-gray-300 dark:text-gray-300">Jami ID lar: {{ uzumIdList.length }}</span>
              </div>
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Soni</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(item, index) in filteredUzumIdsList" :key="index" 
                      :class="[
                        'hover:bg-gray-50 dark:hover:bg-gray-700',
                        item.count > 1 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                      ]">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ item.extractedId }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ item.count }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        @click="startDelete(item, 'uzum')"
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        O'chirish
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Count Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">ID larni o'chirish</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Nechta ID ni o'chirmoqchisiz?</label>
          <input
            type="number"
            v-model="deleteCount"
            class="w-full p-2 border rounded"
            min="1"
            :max="currentDeleteItem?.count || 1"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Bekor qilish
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Delete Modal State
const showDeleteModal = ref(false)
const deleteCount = ref(1)
const currentDeleteItem = ref(null)
const deleteType = ref(null)

const startDelete = (item, type) => {
  currentDeleteItem.value = item
  deleteType.value = type
  
  // For UZUM scanner, if count is 1, delete immediately
  if (type === 'uzum' && item.count === 1) {
    removeUzumId(item.originalId)
    return
  }
  
  // For CRM scanner or UZUM items with count > 1, show modal
  deleteCount.value = 1
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  currentDeleteItem.value = null
  deleteType.value = null
  deleteCount.value = 1
}

const confirmDelete = () => {
  const count = parseInt(deleteCount.value)
  if (deleteType.value === 'crm') {
    // Remove specified number of occurrences of the ID
    let remainingToDelete = count
    const newList = crmIdList.value.filter(id => {
      if (id === currentDeleteItem.value.id && remainingToDelete > 0) {
        remainingToDelete--
        return false
      }
      return true
    })
    crmIdList.value = newList
    // Update textarea content
    crmTextarea.value = crmIdList.value.join(' ')
  } else if (deleteType.value === 'uzum') {
    // Remove specified number of occurrences of the UZUM ID
    let remainingToDelete = count
    const newList = uzumIdList.value.filter(item => {
      if (item.originalId === currentDeleteItem.value.originalId && remainingToDelete > 0) {
        remainingToDelete--
        return false
      }
      return true
    })
    uzumIdList.value = newList
  }
  
  cancelDelete()
}

// Active scanner state
const activeScanner = ref('crm') // Default to CRM scanner

const setActiveScanner = (scanner) => {
  activeScanner.value = scanner
}

// CRM Section
const crmTextarea = ref('')
const crmIdList = ref([])
const crmSearch = ref('')
const crmSortDirection = ref('desc') // Changed to desc by default

const handlePaste = (e) => {
  // Prevent default paste
  e.preventDefault()
  
  // Get pasted text
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')
  
  // Split by any whitespace and filter valid IDs
  const ids = pastedText
    .split(/\s+/)
    .filter(id => id.trim().length === 7)
  
  // Add to existing content with proper spacing
  const existingIds = crmTextarea.value
    .trim()
    .split(/\s+/)
    .filter(id => id.length === 7)
  
  // Combine existing and new IDs with double spacing
  const allIds = [...existingIds, ...ids]
  crmTextarea.value = allIds.join('  ') + '  '
  
  // Update the ID list
  crmIdList.value = allIds
}

const processCrmInput = () => {
  // Get the current input
  const text = crmTextarea.value.trim()
  
  // If empty, just return
  if (!text) {
    crmTextarea.value = ''
    crmIdList.value = []
    return
  }
  
  // Split the text into individual parts
  let parts = text.split(/\s+/)
  
  // Check if we have a new complete ID (7 characters)
  const lastPart = parts[parts.length - 1]
  if (lastPart && lastPart.length === 7) {
    // Filter valid IDs and add proper spacing
    const validIds = parts
      .filter(id => id.length === 7)
    
    // Set the value with double spacing
    crmTextarea.value = validIds.join('  ') + '  '
    
    // Move cursor to the end
    const textarea = document.querySelector('textarea')
    if (textarea) {
      setTimeout(() => {
        textarea.selectionStart = crmTextarea.value.length
        textarea.selectionEnd = crmTextarea.value.length
      })
    }
    
    // Update the ID list
    crmIdList.value = validIds
  } else {
    // Keep partial input but update ID list with only valid IDs
    crmIdList.value = parts.filter(id => id.length === 7)
  }
}

const removeCrmId = (idToRemove) => {
  crmIdList.value = crmIdList.value.filter(id => id !== idToRemove)
  // Update textarea content
  crmTextarea.value = crmIdList.value.join(' ')
}

const clearCrmData = () => {
  crmIdList.value = []
  crmTextarea.value = ''
}

const copyCrmIds = () => {
  navigator.clipboard.writeText(crmIdList.value.join(' '))
}

const filteredCrmIds = computed(() => {
  // Count duplicates
  const counts = crmIdList.value.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1
    return acc
  }, {})

  // Create array of objects with id and count
  let items = Object.entries(counts).map(([id, count]) => ({ id, count }))

  // Filter by search
  if (crmSearch.value) {
    items = items.filter(item => 
      item.id.toLowerCase().includes(crmSearch.value.toLowerCase())
    )
  }

  // Sort items by count first, then by ID if counts are equal
  items.sort((a, b) => {
    if (a.count !== b.count) {
      return b.count - a.count // Sort by count desc
    }
    // If counts are equal, sort by ID
    return crmSortDirection.value === 'asc' 
      ? a.id.localeCompare(b.id) 
      : b.id.localeCompare(a.id)
  })

  return items
})

const sortCrmIds = (direction) => {
  crmSortDirection.value = direction
}

// UZUM Section
const uzumInput = ref('')
const uzumIdList = ref([])
const uzumSearch = ref('')
const uzumSortDirection = ref('desc') // Changed to desc by default
const uzumAutoMode = ref(true)
let uzumProcessTimeout = null

const handleUzumPaste = (e) => {
  // Prevent default paste
  e.preventDefault()
  
  // Get pasted text
  const pastedText = (e.clipboardData || window.clipboardData).getData('text')
  
  // Process multiple IDs
  const ids = pastedText.trim().split(/\s+/)
  ids.forEach(id => {
    processUzumId(id)
  })
  
  // Clear input
  uzumInput.value = ''
}

const handleUzumInput = () => {
  if (uzumAutoMode.value && uzumInput.value.trim()) {
    // Clear existing timeout
    if (uzumProcessTimeout) {
      clearTimeout(uzumProcessTimeout)
    }
    // Set new timeout
    uzumProcessTimeout = setTimeout(() => {
      processUzumInput()
    }, 500)
  }
}

const processUzumInput = () => {
  if (!uzumInput.value.trim()) return
  
  const ids = uzumInput.value.trim().split(/\s+/)
  ids.forEach(id => {
    processUzumId(id)
  })
  uzumInput.value = ''
}

const processUzumId = (id) => {
  id = id.trim()
  
  // Check if it's already in filtered format (8 digits)
  if (/^\d{8}$/.test(id)) {
    uzumIdList.value.push({
      originalId: `10-00${id}-1`, // Reconstruct full format
      extractedId: id
    })
    return
  }
  
  // Check if it's in full format (XX-XXXXXXXXXX-X)
  if (/^\d{2}-\d{10}-\d{1}$/.test(id)) {
    const extractedId = id.substring(5, 13)
    uzumIdList.value.push({
      originalId: id,
      extractedId
    })
    return
  }
}

const removeUzumId = (originalId) => {
  uzumIdList.value = uzumIdList.value.filter(item => item.originalId !== originalId)
}

const clearUzumData = () => {
  uzumIdList.value = []
  uzumInput.value = ''
}

const filteredUzumIdsList = computed(() => {
  // Count duplicates
  const counts = uzumIdList.value.reduce((acc, item) => {
    const key = item.originalId
    acc[key] = acc[key] || { ...item, count: 0 }
    acc[key].count++
    return acc
  }, {})

  // Create array of objects
  let items = Object.values(counts)

  // Filter by search
  if (uzumSearch.value) {
    const search = uzumSearch.value.toLowerCase()
    items = items.filter(item => 
      item.originalId.toLowerCase().includes(search) ||
      item.extractedId.toLowerCase().includes(search)
    )
  }

  // Sort items by count first, then by ID if counts are equal
  items.sort((a, b) => {
    if (a.count !== b.count) {
      return b.count - a.count // Sort by count desc
    }
    // If counts are equal, sort by ID
    return uzumSortDirection.value === 'asc' 
      ? a.extractedId.localeCompare(b.extractedId) 
      : b.extractedId.localeCompare(a.extractedId)
  })

  return items
})

// Computed property for filtered UZUM IDs in textarea
const filteredUzumIds = computed(() => {
  return uzumIdList.value.map(item => item.extractedId).join('  ') + '  '
})

const sortUzumIds = (direction) => {
  uzumSortDirection.value = direction
}

const copyUzumIds = () => {
  navigator.clipboard.writeText(filteredUzumIds.value)
}
</script>
