export default [
  {
    path: '/storage',
    name: 'storage',
    component: () => import('../views/StorageView.vue')
  },
  {
    path: '/storage/enter',
    name: 'storage-enter',
    component: () => import('../views/storage/EnterStorageView.vue'),
    meta: { requiresSuperAdmin: true }
  },
  {
    path: '/storage/loss',
    name: 'storage-loss',
    component: () => import('../views/storage/LossStorageView.vue'),
    meta: { requiresSuperAdmin: true }
  }
]
