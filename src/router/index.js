import { createRouter, createWebHistory } from 'vue-router'
import auth from '../stores/auth'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import LoginView from '../views/LoginView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { 
        requiresGuest: true,
        title: 'Login'
      }
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/ProductsView.vue'),
          meta: { 
            title: 'Products',
            requiresStorekeeper: true
          }
        },
        {
          path: 'products/:id',
          name: 'product-details',
          component: () => import('../views/ProductDetailsView.vue'),
          meta: { 
            title: 'Product Details',
            requiresStorekeeper: true
          }
        },
        {
          path: 'storage',
          name: 'storage',
          component: () => import('../views/StorageView.vue'),
          meta: { 
            title: 'Storage',
            requiresStorekeeper: true
          }
        },
        {
          path: 'storage/in',
          name: 'storage-in',
          component: () => import('../views/storage/StorageInView.vue'),
          meta: { 
            title: 'Kirim',
            requiresStorekeeper: true
          }
        },
        {
          path: 'storage/out',
          name: 'storage-out',
          component: () => import('../views/storage/StorageOutView.vue'),
          meta: { 
            title: 'Chiqim',
            requiresStorekeeper: true
          }
        },
        {
          path: 'storage/enter',
          name: 'storage-enter',
          component: () => import('../views/storage/EnterStorageView.vue'),
          meta: { 
            title: 'Enter Storage',
            requiresStorekeeper: true,
            requiresSuperAdmin: true
          }
        },
        {
          path: 'storage/loss',
          name: 'storage-loss',
          component: () => import('../views/storage/LossStorageView.vue'),
          meta: { 
            title: 'Qarz Chiqim',
            requiresStorekeeper: true,
            requiresSuperAdmin: true
          }
        },
        {
          path: 'storage/cashin',
          name: 'storage-cashin',
          component: () => import('../views/storage/CashInStorageView.vue'),
          meta: { 
            title: 'Naqd Kirim',
            requiresStorekeeper: true
          }
        },
        {
          path: 'storage/debtin',
          name: 'storage-debtin',
          component: () => import('../views/storage/DebtInStorageView.vue'),
          meta: { 
            title: 'Qarz Kirim',
            requiresStorekeeper: true
          }
        },
        {
          path: 'storage/debtout',
          name: 'storage-debtout',
          component: () => import('../views/storage/DebtOutStorageView.vue'),
          meta: { 
            title: 'Qarz Chiqim',
            requiresStorekeeper: true
          }
        },
        {
          path: 'shipment',
          name: 'shipment',
          component: () => import('../views/ShipmentView.vue'),
          meta: { 
            title: 'Shipment',
            requiresStorekeeper: true
          }
        },
        {
          path: 'shipment/uzum',
          name: 'shipment-uzum',
          component: () => import('../views/UzumView.vue'),
          meta: { 
            title: 'Uzum Shipment',
            requiresStorekeeper: true
          }
        },
        {
          path: 'shipment/create/:id?',
          name: 'create-shipment',
          component: () => import('../views/shipments/CreateShipment.vue'),
          meta: { 
            title: 'Create Shipment',
            requiresStorekeeper: true
          }
        },
        {
          path: 'finance',
          name: 'finance',
          component: () => import('../views/FinanceView.vue'),
          meta: { 
            title: 'Finance',
            requiresCashier: true
          }
        },
        {
          path: 'Warehouse',
          name: 'warehouse',
          component: () => import('../views/WarehouseStockView.vue'),
          meta: { 
            title: 'Warehouse',
            requiresStorekeeper: true
          }
        },
        {
          path: 'warehouse-history',
          name: 'warehouse-history',
          component: () => import('../views/WarehouseStockHistory.vue'),
          meta: { 
            title: 'Warehouse History',
            requiresStorekeeper: true
          }
        },
        {
          path: 'scanner',
          name: 'scanner',
          component: () => import('../views/ScannerView.vue'),
          meta: { 
            title: 'Skaner',
            requiresStorekeeper: true
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: '404 Not Found' }
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Check auth state
  const hasAuth = await auth.checkAuth()
  
  if (to.meta.requiresAuth && !hasAuth) {
    next('/login')
  } else if (to.meta.requiresGuest && hasAuth) {
    next('/dashboard')
  } else if (to.meta.requiresStorekeeper && !auth.isStorekeeper) {
    next('/dashboard')
  } else if (to.meta.requiresCashier && !auth.isCashier) {
    next('/dashboard')
  } else if (to.meta.requiresSuperAdmin && !auth.isSuperAdmin) {
    next('/dashboard')
  } else {
    // Update document title
    document.title = to.meta.title 
      ? `WMS by Mgoods ERP | ${to.meta.title}`
      : 'WMS by Mgoods ERP'
    next()
  }
})

export default router