interface RequestOptions {
  headers?: Record<string, string>
  query?: Record<string, any>
  [key: string]: any
}

/**
 * Composable global de requisições de API (useApi)
 * Recupera o token Bearer de forma assíncrona/síncrona de um cookie seguro (auth_token).
 * Utiliza useCookie do Nuxt 3, suportando tanto Server-Side Rendering (SSR) quanto Client-Side.
 */
export const useApi = async <T = any>(
  route: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  options: RequestOptions = {},
  body: any = null
): Promise<T> => {

  const config = useRuntimeConfig()
  const rawApiUrl = (config.public.apiUrl as string) || 'https://theawaycollectiveapi.onrender.com'
  const apiUrl = rawApiUrl.replace(/\/+$/, '')
  const cleanRoute = route.startsWith('/') ? route : `/${route}`

  // Constrói a URL completa se a rota for relativa
  const finalUrl = route.startsWith('http://') || route.startsWith('https://') ? route : `${apiUrl}${cleanRoute}`

  // Validação estrita de segurança na URL para evitar injeções ou redirecionamentos maliciosos
  if (!finalUrl.startsWith('/') && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    throw new Error('Segurança de Rede: URL de requisição inválida.')
  }

  let token: string | null = null

  // Rotas públicas (como login ou cadastro de cliente) não necessitam de token
  const isPublicRoute = finalUrl.includes('/login') || (finalUrl.endsWith('/cliente') && method === 'POST')
  if (!isPublicRoute) {
    // Lê o cookie usando o utilitário nativo do Nuxt 3
    const tokenCookie = useCookie<string | null>('auth_token')
    token = tokenCookie.value || null
  }

  // Prepara os cabeçalhos de forma segura
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    // Higienização de segurança contra injeção de cabeçalhos (Header Injection)
    headers['Authorization'] = `Bearer ${token.replace(/[\n\r]/g, '')}`
  }

  // Dentro de useApi, logo após montar o objeto headers:
  if (import.meta.server) {
    const reqHeaders = useRequestHeaders(['cookie'])
    if (reqHeaders.cookie) {
      headers['cookie'] = reqHeaders.cookie
    }
  }

  const fetchOptions: any = {
    method,
    headers,
    credentials: 'include',
    ...options
  }

  if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    fetchOptions.body = typeof body === 'object' ? JSON.stringify(body) : body
  }

  try {
    const response = await $fetch<T>(finalUrl, fetchOptions)
    return response
  } catch (error: any) {
    const apiErrorMessage = error?.data?.error?.message || error?.response?._data?.error?.message || error.message
    console.error(`Erro na chamada API (${method} ${finalUrl}):`, apiErrorMessage)
    throw error
  }
}

/**
 * Salva o token Bearer com segurança em um cookie.
 */
export const setAuthToken = async (token: string) => {
  // Limpa e sanitiza o token antes de salvar
  const sanitizedToken = token.trim().replace(/[\n\r]/g, '')
  const tokenCookie = useCookie('auth_token', {
    maxAge: 60 * 60 * 24, // Expira em 1 dia (24 horas)
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/'
  })
  tokenCookie.value = sanitizedToken
}

/**
 * Remove o token do cookie (Logout).
 */
export const removeAuthToken = async () => {
  const tokenCookie = useCookie('auth_token')
  tokenCookie.value = null
}

/**
 * Salva o ID do cliente no cookie.
 */
export const setClientId = async (clientId: string) => {
  const clientIdCookie = useCookie('client_id', {
    maxAge: 60 * 60 * 24, // Expira em 1 dia (24 horas)
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/'
  })
  clientIdCookie.value = clientId
}

/**
 * Recupera o ID do cliente do cookie.
 */
export const getClientId = async () => {
  const clientIdCookie = useCookie('client_id')
  return clientIdCookie.value
}

/**
 * Remove o ID do cliente do cookie (Logout).
 */
export const removeClientId = async () => {
  const clientIdCookie = useCookie('client_id')
  clientIdCookie.value = null
}

/**
 * Salva o nome do cliente no cookie.
 */
export const setClientName = async (clientName: string) => {
  const clientNameCookie = useCookie('client_name', {
    maxAge: 60 * 60 * 24, // Expira em 1 dia (24 horas)
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/'
  })
  clientNameCookie.value = clientName
}

/**
 * Recupera o nome do cliente do cookie.
 */
export const getClientName = async () => {
  const clientNameCookie = useCookie('client_name')
  return clientNameCookie.value
}

/**
 * Remove o nome do cliente do cookie (Logout).
 */
export const removeClientName = async () => {
  const clientNameCookie = useCookie('client_name')
  clientNameCookie.value = null
}
