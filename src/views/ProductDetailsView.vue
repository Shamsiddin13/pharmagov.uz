<template>
    <div class="container mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-lg">
        {{ error }}
      </div>
    
      <!-- Content -->
      <div v-else-if="product" class="space-y-6">
        <!-- Back Button -->
        <div class="mb-6">
          <button
            @click="$router.back()"
            class="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
        </div>
  
        <!-- Product Details -->
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex justify-between items-start">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ product.name }}</h1>
          </div>
  
          <!-- Main Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Basic Info Card -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input 
                      v-model="product.name" 
                      @change="updateField('name', product.name)"
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select
                      v-model="product.category_id"
                      @change="updateField('category_id', product.category_id)"
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    >
                      <option value="">Select category</option>
                      <option 
                        v-for="category in categories" 
                        :key="category.id" 
                        :value="category.id"
                        :selected="category.id === product?.category_id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Store</label>
                    <p class="mt-1 text-gray-900 dark:text-white">{{ product.store?.name || 'N/A' }}</p>
                  </div>

                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">IKPU</label>
                    <input 
                      v-model="product.IKPU" 
                      @change="updateField('IKPU', product.IKPU)"
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Enter IKPU"
                    />
                  </div>
                  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Article</label>
                    <p class="mt-1 text-gray-900 dark:text-white">{{ product.article || 'N/A' }}</p>
                  </div>
  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                    <p class="mt-1 text-gray-900 dark:text-white">{{ product.sku  || 'N/A' }}</p>
                  </div>
  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">UZUM SKU</label>
                    <input 
                      v-model="product.uzum_sku" 
                      @change="updateField('uzum_sku', product.uzum_sku)"
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Enter UZUM SKU"
                    />
                  </div>
  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">UZUM SKU 2</label>
                    <input 
                      v-model="product.uzum_sku_title" 
                      @change="updateField('uzum_sku_title', product.uzum_sku_title)"
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Enter UZUM SKU 2"
                    />
                  </div>
  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight</label>
                    <input 
                      v-model="product.weight" 
                      @change="updateField('weight', product.weight)"
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Enter weight"
                    />
                  </div>
                  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">EAN13</label>
                    <input 
                      v-model="product.ean13" 
                      @change="updateField('ean13', product.ean13)"
                      class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Enter EAN13"
                    />
                  </div>
                  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Buy Price</label>
                    <div v-if="isSuperAdmin" class="mt-1 relative rounded-md shadow-sm">
                      <input 
                        :value="Intl.NumberFormat().format(parseFloat(product.buy_price).toFixed(0))"
                        @change="e => updateField('buy_price', e.target.value.replace(/\D/g, ''))"
                        class="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-12 transition-colors duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        type="text"
                        placeholder="0"
                      />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 dark:text-gray-400 sm:text-sm">{{ product.currency }}</span>
                      </div>
                    </div>
                    <div v-else class="mt-2 text-sm text-gray-900 dark:text-white">
                      {{ Intl.NumberFormat().format(parseFloat(product.buy_price).toFixed(0)) }} {{ product.currency }}
                    </div>
                  </div>
  
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Sell Price</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <input 
                        :value="Intl.NumberFormat().format(parseFloat(product.sell_price).toFixed(0))"
                        @change="e => updateField('sell_price', e.target.value.replace(/\D/g, ''))"
                        class="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-12 transition-colors duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        type="text"
                        placeholder="0"
                      />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 dark:text-gray-400 sm:text-sm">{{ product.currency }}</span>
                      </div>
                    </div>
                  </div>
  
                  
                </div>
              </div>
            </div>
  
            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Image Card -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">Product Image</h2>
                <div class="relative group">
                  <img 
                    :src="product.image || 'https://via.placeholder.com/300'" 
                    :alt="product.name"
                    class="w-full rounded-lg"
                  >
                  <div v-if="uploadProgress !== null" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div class="text-white text-center">
                      <div class="mb-2">Uploading...</div>
                      <div class="w-48 h-2 bg-gray-200 rounded-full">
                        <div 
                          class="h-full bg-indigo-600 rounded-full transition-all duration-300"
                          :style="{ width: `${uploadProgress}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-between items-center mt-4">
                  <div class="relative">
                    <input
                      type="file"
                      ref="fileInput"
                      @change="handleImageUpload"
                      accept="image/jpeg,image/png,image/jpg"
                      class="hidden"
                    />
                    <button
                      @click="$refs.fileInput.click()"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Product Variants -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Product Variants</h2>
              <Button @click="openAddVariantModal" variant="primary" class="px-4 py-2">Add Variant</Button>
            </div>
            
            <div v-if="product.variants?.length" class="relative">
              <div class="overflow-x-auto">
                <div class="inline-block min-w-full align-middle">
                  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Image</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[400px]">Name</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SKU</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[160px]">Buy Price</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[160px]">Sell Price</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[180px]">UZUM SKU</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[180px]">UZUM SKU 2</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[160px]">EAN13</th>
                          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="variant in product.variants" :key="variant.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td class="px-6 py-4 whitespace-nowrap w-24">
                            <img :src="variant.image" :alt="variant.name" class="h-12 w-12 object-cover rounded-lg">
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-sm text-gray-900 dark:text-gray-100">
                              {{ variant.name }}
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900 dark:text-gray-100">
                              {{ variant.sku }}
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div v-if="isSuperAdmin" class="relative rounded-md shadow-sm">
                              <input 
                                :value="Intl.NumberFormat().format(parseFloat(variant.buy_price).toFixed(0))"
                                @change="e => updateVariantField(variant.id, 'buy_price', e.target.value.replace(/\D/g, ''))"
                                class="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                                type="text"
                                placeholder="0"
                              />
                              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 dark:text-gray-400 sm:text-sm">{{ product.currency }}</span>
                              </div>
                            </div>
                            <div v-else class="text-sm text-gray-500 dark:text-gray-400">
                              {{ Intl.NumberFormat().format(parseFloat(variant.buy_price).toFixed(0)) }} {{ product.currency }}
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="relative rounded-md shadow-sm">
                              <input 
                                :value="Intl.NumberFormat().format(parseFloat(variant.sell_price).toFixed(0))"
                                @change="e => updateVariantField(variant.id, 'sell_price', e.target.value.replace(/\D/g, ''))"
                                class="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                                type="text"
                                placeholder="0"
                              />
                              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 dark:text-gray-400 sm:text-sm">{{ product.currency }}</span>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="relative rounded-md shadow-sm">
                              <input 
                                v-model="variant.uzum_sku"
                                @change="updateVariantField(variant.id, 'uzum_sku', variant.uzum_sku)"
                                class="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                                type="text"
                                placeholder="Enter UZUM SKU"
                              />
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="relative rounded-md shadow-sm">
                              <input 
                                v-model="variant.uzum_sku_title"
                                @change="updateVariantField(variant.id, 'uzum_sku_title', variant.uzum_sku_title)"
                                class="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                                type="text"
                                placeholder="Enter UZUM SKU 2"
                              />
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="relative rounded-md shadow-sm">
                              <input 
                                v-model="variant.ean13"
                                @change="updateVariantField(variant.id, 'ean13', variant.ean13)"
                                class="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                                type="text"
                                placeholder="Enter EAN13"
                              />
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              v-if="isSuperAdmin"
                              @click="deleteVariant(variant.id)"
                              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <div class="text-gray-500 dark:text-gray-400">No variants added yet</div>
              <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Click the "Add Variant" button to create your first variant</p>
            </div>
          </div>
  
          <!-- Price History -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Price History</h2>
            
            <div v-if="formattedPriceHistory.length" class="relative">
              <!-- Loading Overlay -->
              <div v-if="loadingPriceHistory" class="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
  
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Storage</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">SKU</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Buy Price</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Updated</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="history in formattedPriceHistory" :key="history.created_at" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ history.formattedDate }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ history.storage_id || 'N/A' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ history.product_name }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ history.sku }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ Number(history.real_buy_price).toLocaleString() }} {{ product.currency }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ Math.trunc(history.quantity) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ history.formattedUpdated }}</td>
                    </tr>
                  </tbody>
                </table>
  
                <!-- Pagination -->
                <div v-if="priceHistoryMeta" class="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6">
                  <div class="flex flex-1 justify-between sm:hidden">
                    <button
                      @click="changePage(priceHistoryMeta.current_page - 1)"
                      :disabled="!priceHistoryMeta.prev_page_url"
                      class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      @click="changePage(priceHistoryMeta.current_page + 1)"
                      :disabled="!priceHistoryMeta.next_page_url"
                      class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p class="text-sm text-gray-700 dark:text-gray-300">
                        Showing
                        <span class="font-medium">{{ ((priceHistoryMeta.current_page - 1) * priceHistoryMeta.per_page) + 1 }}</span>
                        to
                        <span class="font-medium">{{ Math.min(priceHistoryMeta.current_page * priceHistoryMeta.per_page, priceHistoryMeta.total) }}</span>
                        of
                        <span class="font-medium">{{ priceHistoryMeta.total }}</span>
                        results
                      </p>
                    </div>
                    <div>
                      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          @click="changePage(priceHistoryMeta.current_page - 1)"
                          :disabled="!priceHistoryMeta.prev_page_url"
                          class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <span class="sr-only">Previous</span>
                          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        <button
                          v-for="page in getPageNumbers(priceHistoryMeta.last_page, priceHistoryMeta.current_page)"
                          :key="page"
                          @click="changePage(page)"
                          :class="{
                            'relative z-10 inline-flex items-center bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600': page === priceHistoryMeta.current_page,
                            'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0': page !== priceHistoryMeta.current_page,
                            'pointer-events-none': page === '...'
                          }"
                        >
                          {{ page }}
                        </button>
                        <button
                          @click="changePage(priceHistoryMeta.current_page + 1)"
                          :disabled="!priceHistoryMeta.next_page_url"
                          class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <span class="sr-only">Next</span>
                          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06.02z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <div class="text-gray-500 dark:text-gray-400">No price history available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Simple Sidebar Implementation -->
    <template v-if="showAddVariantModal">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="closeAddVariantModal"
      ></div>
  
      <!-- Sidebar -->
      <div class="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-xl z-50">
        <div class="h-full flex flex-col">
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Add Variant</h3>
            <button 
              @click="closeAddVariantModal"
              class="text-gray-400 hover:text-gray-500"
            >×</button>
          </div>
  
          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <AddVariantForm
              :product-id="route.params.id"
              :product-name="product.name"
              @close="closeAddVariantModal"
              @variant-added="handleVariantAdded"
            />
          </div>
        </div>
      </div>
    </template>
  
  </template>
  
  <script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { useUser } from '../services/user'
    import auth from '../stores/auth'
    import { fetchProductById } from '../services/products'
    import Button from '../components/common/Button.vue'
    import AddVariantForm from '../components/products/forms/AddVariantForm.vue'
    import axios from 'axios'
    import { useToast } from 'vue-toastification'

    const API_BASE_URL = 'https://api.mgoods.uz'

    const route = useRoute()
    const { user } = useUser()
    const isSuperAdmin = computed(() => user.value?.type === 'superadmin')

    // State
    const product = ref(null)
    const categories = ref([])
    const loading = ref(false)
    const error = ref(null)
    const showAddVariantModal = ref(false)
    const currentPage = ref(1)
    const priceHistories = ref([])
    const priceHistoryMeta = ref(null)
    const loadingPriceHistory = ref(false)
    const loadingBasicInfo = ref(false)
    const uploadProgress = ref(null)
    const fileInput = ref(null)
    const toast = useToast()

    // Get token helper
    const getAuthToken = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      return token
    }

    // Fetch categories function
    const loadCategories = async () => {
      try {
        const token = getAuthToken()
        const response = await axios.get(`${API_BASE_URL}/api/categories/get`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        if (response.data.status) {
          categories.value = response.data.data
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    // API function for updating product fields
    async function updateProduct(id, data) {
      try {
        const token = getAuthToken()

        // Extract the field and value from the data object
        const [property] = Object.keys(data)
        const value = data[property]

        console.log('Sending update:', { property, value }) // Debug log

        // Convert data to URLSearchParams
        const params = new URLSearchParams()
        params.append('property', property)
        params.append('value', value)

        const response = await axios.put(`${API_BASE_URL}/api/products/product/${id}/putByPropertyName`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('Server response:', response.data) // Debug log
        return response.data
      } catch (error) {
        console.error('Error updating product:', error)
        throw error
      }
    }

    // Computed properties for formatted data
    const formattedPriceHistory = computed(() => {
      return priceHistories.value.map(history => ({
        ...history,
        formattedDate: formatDateTime(history.created_at),
        formattedUpdated: formatDateTime(history.updated_at)
      }))
    })

    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }

    // Function to handle field updates
    const updateField = async (fieldName, value) => {
      try {
        console.log('Updating field:', fieldName, 'with value:', value) // Debug log
        const response = await updateProduct(route.params.id, { [fieldName]: value })
        console.log('Update response:', response) // Debug log
        
        if (response.status) {
          toast.success(response.message)
          // Update the local product data with the response
          product.value = { ...product.value, ...response.data }
          console.log('Updated product:', product.value) // Debug log
          console.log(`Successfully updated ${fieldName}`)
        } else {
          toast.error(response.message)
          console.error(`Failed to update ${fieldName}`)
          // Revert the change if update failed
          product.value[fieldName] = product.value[fieldName]
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred while updating the field')
        console.error(`Error updating ${fieldName}:`, error)
        // Revert the change if update failed
        product.value[fieldName] = product.value[fieldName]
      }
    }

    const updateVariantField = async (variantId, fieldName, value) => {
      try {
        console.log('Updating variant field:', fieldName, 'with value:', value) // Debug log
        const response = await axios.put(`${API_BASE_URL}/api/products/product/p-variants/${variantId}/put`, {
          [fieldName]: value
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          }
        })
        console.log('Update response:', response.data) // Debug log
        
        if (response.data?.status) {
          toast.success(response.data.message)
          // Update the variant in the product.variants array
          const variantIndex = product.value.variants.findIndex(v => v.id === variantId)
          if (variantIndex !== -1) {
            product.value.variants[variantIndex] = { 
              ...product.value.variants[variantIndex],
              [fieldName]: value
            }
          }
          console.log(`Successfully updated ${fieldName}`)
        } else {
          toast.error(response.data.message)
          console.error(`Failed to update ${fieldName}`)
          // Revert the change if update failed
          const variantIndex = product.value.variants.findIndex(v => v.id === variantId)
          if (variantIndex !== -1) {
            product.value.variants[variantIndex][fieldName] = product.value.variants[variantIndex][fieldName]
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred while updating the variant')
        console.error(`Error updating ${fieldName}:`, error)
        // Revert the change if update failed
        const variantIndex = product.value.variants.findIndex(v => v.id === variantId)
        if (variantIndex !== -1) {
          product.value.variants[variantIndex][fieldName] = product.value.variants[variantIndex][fieldName]
        }
      }
    }

    const deleteVariant = async (variantId) => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/products/product/p-variants/${variantId}/delete`, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
        if (response.status === 200) {
          // Remove the variant from the local state
          product.value.variants = product.value.variants.filter(v => v.id !== variantId);
          toast.success('Variant deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting variant:', error);
        toast.error(error.response?.data?.message || 'Failed to delete variant');
      }
    };

    const getPageNumbers = (lastPage, currentPage) => {
      const pages = []
      const maxPagesToShow = 5

      if (lastPage <= maxPagesToShow) {
        // If total pages are less than maxPagesToShow, show all pages
        for (let i = 1; i <= lastPage; i++) {
          pages.push(i)
        }
      } else {
        // Always show first page
        pages.push(1)

        // Calculate start and end of page numbers around current page
        let start = Math.max(2, currentPage - 1)
        let end = Math.min(lastPage - 1, currentPage + 1)

        // Adjust if current page is near the start
        if (currentPage <= 3) {
          end = 4
        }

        // Adjust if current page is near the end
        if (currentPage >= lastPage - 2) {
          start = lastPage - 3
        }

        // Add ellipsis if there's a gap after first page
        if (start > 2) {
          pages.push('...')
        }

        // Add page numbers around current page
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }

        // Add ellipsis if there's a gap before last page
        if (end < lastPage - 1) {
          pages.push('...')
        }

        // Always show last page
        if (lastPage !== 1) {
          pages.push(lastPage)
        }
      }

      return pages
    }

    // Separate data fetching for basic info
    const fetchProductBasicInfo = async () => {
      if (!loadingBasicInfo.value) {
        loadingBasicInfo.value = true
        error.value = null
        try {
          const response = await fetchProductById(route.params.id)
          if (response.data) {
            product.value = response.data
            priceHistories.value = response.data.price_histories || []
            priceHistoryMeta.value = response.data.price_history_meta || null
          }
        } catch (err) {
          error.value = 'Failed to load product details'
          console.error('Error fetching product:', err)
        } finally {
          loadingBasicInfo.value = false
        }
      }
    }

    // Modified price history fetching
    const fetchPriceHistory = async (page = 1) => {
      if (!loadingPriceHistory.value) {
        loadingPriceHistory.value = true
        try {
          const response = await fetchProductById(route.params.id, { 
            page,
            per_page: 5
          })
          
          if (response.data?.price_histories?.length > 0) {
            priceHistories.value = response.data.price_histories
            priceHistoryMeta.value = response.data.price_history_meta
          }
        } catch (err) {
          console.error('Error fetching price history:', err)
        } finally {
          loadingPriceHistory.value = false
        }
      }
    }

    const changePage = async (page) => {
      if (page !== currentPage.value) {
        currentPage.value = page
        await fetchPriceHistory(page)
      }
    }

    const openAddVariantModal = () => {
      showAddVariantModal.value = true
    }

    const closeAddVariantModal = () => {
      showAddVariantModal.value = false
    }

    const handleVariantAdded = async () => {
      closeAddVariantModal()
      await fetchProductBasicInfo()
    }

    // Parallel loading on mount
    onMounted(async () => {
      loading.value = true
      error.value = null
        
      try {
        await Promise.all([
          fetchProductBasicInfo(),
          loadCategories(),
          fetchPriceHistory(1)
        ])
      } catch (err) {
        error.value = err.message || 'Failed to load product details'
      } finally {
        loading.value = false
      }
    })

    const handleImageUpload = async (event) => {
      try {
        const file = event.target.files[0]
        if (!file) return
        
        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
          alert('Please select a valid image file (JPEG, PNG, or JPG)')
          return
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert('Image size should be less than 2MB')
          return
        }

        // Create form data with all required fields
        const formData = new FormData()
        formData.append('image', file)
        formData.append('name', product.value.name)
        formData.append('category_id', product.value.category_id)
        formData.append('store_id', product.value.store_id)
        formData.append('buy_price', product.value.buy_price)
        formData.append('sell_price', product.value.sell_price)
        formData.append('IKPU', product.value.IKPU)
        formData.append('currency', product.value.currency)
        formData.append('uzum_sku_title', product.value.uzum_sku_title || '')
        formData.append('weight', product.value.weight || '')
        formData.append('ean13', product.value.ean13 || '')

        // Get token
        const token = getAuthToken()
        if (!token) {
          throw new Error('Authentication token not found')
        }

        // Upload the image with progress tracking
        const response = await axios.post(
          `${API_BASE_URL}/api/products/product/${route.params.id}/update`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              uploadProgress.value = progress
            }
          }
        )

        // Update the product image in the UI
        if (response.data?.status) {
          // Fetch updated product data to get the new image URL
          await fetchProductBasicInfo()
          alert('Image uploaded successfully')
        } else {
          throw new Error(response.data?.message || 'Failed to upload image')
        }

        // Reset the file input
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        alert(error.response?.data?.message || error.message || 'Failed to upload image. Please try again.')
      } finally {
        uploadProgress.value = null
      }
    }
  </script>
  