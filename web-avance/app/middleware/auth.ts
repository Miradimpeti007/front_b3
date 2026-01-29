export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // On force l'initialisation si l'utilisateur n'est pas encore là
  if (!auth.isAuthenticated) {
    await auth.initAuth()
  }

  // Seulement après, on décide si on redirige
  if (!auth.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }
})