<template>
  <div v-if="user && user.is_cashier" class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="flex flex-col space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Moliya</h1>
          <div class="flex items-center space-x-4">
            <button
              v-if="!isStorekeeper"
              @click="openTransactionForm('in')"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Kirim
            </button>
            <button
              @click="openTransactionForm('out')"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Chiqim
            </button>
            <button
              @click="showTransferForm = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              O'tkazma
            </button>
          </div>
        </div>
        
        <BankAccountsGrid />
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <FinanceFilter
        :filters="filters"
        @filter="handleFilter"
      />
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div v-if="isLoading" class="p-6 text-center text-gray-500">
        O'tkazmalar yuklanmoqda...
      </div>
      
      <div v-else-if="error" class="p-6 text-center text-red-500">
        {{ error }}
      </div>
      
      <div v-else>
        <FinanceTable 
          :transactions="transactions" 
          :transfers="transfers" 
          :filters="filters"
          :transaction-meta="transactionMeta"
          :transfer-meta="transferMeta"
          :current-page="currentPage"
          :per-page="perPage"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
        />
      </div>
    </div>

    <!-- Transaction Forms -->
    <Teleport to="body">
      <TransactionForm
        v-if="showTransactionForm"
        :show="showTransactionForm"
        :type="transactionType"
        :filters="filters"
        @close="closeTransactionForm"
        @transaction-created="handleTransactionCreated"
      />
    </Teleport>

    <!-- Transfer Form -->
    <TransferForm
      v-if="showTransferForm"
      @close="showTransferForm = false"
      @transfer-created="handleTransferCreated"
    />
  </div>
  <div v-else class="flex items-center justify-center h-[calc(100vh-4rem)]">
    <div class="text-center">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Ruxsat berilmagan</h2>
      <p class="text-gray-600 dark:text-gray-400">Sizga qo'shimcha ma'lumotlar uchun ruxsat berilmagan.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { API_URL } from '../services/api'
import { getAuthHeaders } from '../services/auth'
import FinanceFilter from '../components/finance/FinanceFilter.vue'
import FinanceTable from '../components/finance/FinanceTable.vue'
import TransactionForm from '../components/finance/TransactionForm.vue'
import TransferForm from '../components/finance/TransferForm.vue'
import FinanceActionButtons from '../components/finance/FinanceActionButtons.vue'
import BankAccountsGrid from '../components/finance/BankAccountsGrid.vue'
import { useUser } from '../services/user'

// Get user from auth store
const { user, isStorekeeper } = useUser()

const transactions = ref([])
const transfers = ref([])
const transactionMeta = ref({})
const transferMeta = ref({})
const filters = ref({
  bankAccounts: [],
  kontragents: [],
  reasons: []
})
const activeFilters = ref({})
const isLoading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const perPage = ref(20)

const showTransactionForm = ref(false)
const showTransferForm = ref(false)
const transactionType = ref('in')

const openTransactionForm = (type) => {
  transactionType.value = type
  showTransactionForm.value = true
}

const closeTransactionForm = () => {
  showTransactionForm.value = false
}

const handleTransactionCreated = (transaction) => {
  // Refresh the data with current filters
  fetchFinanceData(currentPage.value, activeFilters.value)
}

const fetchFinanceData = async (page = 1, filterValues = {}) => {
  try {
    isLoading.value = true
    error.value = null
    currentPage.value = page

    const headers = await getAuthHeaders()
    
    // Transform filters if needed
    const transformedFilters = Object.keys(filterValues).length > 0
      ? Object.entries(filterValues).reduce((acc, [key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            acc[key] = value.join(',')
          } else if (value) {
            acc[key] = value
          }
          return acc
        }, {})
      : {}

    const params = {
      page,
      per_page: perPage.value,
      ...(Object.keys(transformedFilters).length > 0 ? transformedFilters : {})
    }

    // Determine which requests to make based on type
    const isTransferOnly = transformedFilters.types === 'transfer'
    const isTransactionOnly = transformedFilters.types === 'in' || transformedFilters.types === 'out'
    const hasKontragentOrReason = transformedFilters.kontragent_ids || transformedFilters.reason_ids

    const shouldSkipTransactions = isTransferOnly
    const shouldSkipTransfers = isTransactionOnly || hasKontragentOrReason

    // Make requests based on conditions
    const [transactionsData, transfersData] = await Promise.all([
      shouldSkipTransactions
        ? Promise.resolve({ data: [], meta: { total: 0 } })
        : axios.get(`${API_URL}/transactions/get`, {
            headers,
            params
          }).then(res => res.data),
      shouldSkipTransfers
        ? Promise.resolve({ data: [], meta: { total: 0 }, filters: { bankAccounts: [] } })
        : axios.get(`${API_URL}/transfers/get`, {
            headers,
            params
          }).then(res => res.data)
    ])


    // Update data and metadata
    transactions.value = transactionsData.data || []
    transfers.value = transfersData.data || []
    transactionMeta.value = transactionsData.meta || {}
    transferMeta.value = transfersData.meta || {}
    
    // Update filters with data from both responses
    const transferBankAccounts = transfersData.filters?.bankAccounts || []
    const transactionBankAccounts = transactionsData.filters?.bankAccounts || []
    
    // Merge bank accounts from both sources, removing duplicates by ID
    const bankAccountsMap = new Map()
    
    // Add transfer bank accounts
    transferBankAccounts.forEach(account => {
      bankAccountsMap.set(account.id, account)
    })
    
    // Add transaction bank accounts
    transactionBankAccounts.forEach(account => {
      if (!bankAccountsMap.has(account.id)) {
        bankAccountsMap.set(account.id, account)
      }
    })
    
    filters.value = {
      ...filters.value,
      bankAccounts: Array.from(bankAccountsMap.values()),
      kontragents: transactionsData.filters?.kontragents || [],
      reasons: transactionsData.filters?.reasons || []
    }
    
    isLoading.value = false
  } catch (err) {
    console.error('Error fetching finance data:', err)
    error.value = 'Failed to fetch finance data. Please try again.'
    isLoading.value = false
  }
}

const handlePageChange = (page) => {
  fetchFinanceData(page, activeFilters.value)
}

const handlePerPageChange = (newPerPage) => {
  perPage.value = newPerPage
  currentPage.value = 1 // Reset to first page when changing items per page
  fetchFinanceData(1, activeFilters.value)
}

const handleFilter = (filterValues) => {
  activeFilters.value = filterValues
  fetchFinanceData(1, filterValues)
}

const handleTransferCreated = () => {
  // Refresh the data with current filters
  fetchFinanceData(currentPage.value, activeFilters.value)
}

// Fetch data when component mounts
onMounted(() => {
  fetchFinanceData(1)
})
</script>