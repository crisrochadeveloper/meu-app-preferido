const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'books', component: () => import('pages/books/IndexPageBooks.vue') },
      { path: 'photo', component: () => import('pages/PhotoPage.vue') },
      { path: 'photos', component: () => import('pages/PhotosPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
